import { readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  categories,
  mergeWithCarryForward,
  processArticles
} from "./news/scoring.mjs";

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
};

const NEWSAPI_AI_KEY = requireEnv("NEWSAPI_AI_KEY");
const NEWSDATA_KEY = requireEnv("NEWSDATA_KEY");
const NEWSAPI_ORG_KEY = requireEnv("NEWSAPI_ORG_KEY");

const FETCH_WINDOW_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
const today = new Date();
const fromDate = new Date(today.getTime() - FETCH_WINDOW_DAYS * DAY_MS).toISOString().slice(0, 10);
const OUTPUT_PATH = "data/why-stallplus-news.json";

const searchTerms = [
  "bathroom privacy",
  "restroom privacy",
  "peeping tom",
  "voyeurism",
  "hidden camera",
  "bathroom stall gaps",
  "public restroom"
];

const newsDataQuery = '"restroom privacy" OR "hidden camera" OR "dorm bathroom" OR voyeurism';

const newsApiOrgQuery = [
  '"bathroom privacy"',
  '"restroom privacy"',
  '"peeping tom"',
  "voyeurism",
  '"hidden camera"',
  '"spy camera"',
  '"dorm bathroom"',
  '"shared bathroom"',
  '"bathroom stall gaps"',
  '"american bathroom stalls"',
  '"workplace privacy"',
  '"employee experience"',
  '"shoulder surfing"'
].join(" OR ");

const normalizeText = (value) => String(value || "").replace(/\s+/g, " ").trim();

const toArticle = (provider, item) => {
  const title = normalizeText(item.title || item.name);
  const description = normalizeText(item.description || item.body || item.content || item.summary);
  const url = item.url || item.link || item.uri;

  if (!title || !url) {
    return null;
  }

  return {
    provider,
    title,
    description,
    url,
    source: normalizeText(item.source?.name || item.source_name || item.source?.title || item.source?.uri || provider),
    image: item.urlToImage || item.image_url || item.image || null,
    publishedAt: item.publishedAt || item.pubDate || item.dateTimePub || item.dateTime || null
  };
};

const execFileAsync = promisify(execFile);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchJsonWithNode = async (url, options = {}) => {
  const timeoutMs = options.timeoutMs ?? 15000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`${response.status} ${response.statusText}: ${message.slice(0, 180)}`);
    }

    return response.json();
  } finally {
    clearTimeout(timeout);
  }
};

const fetchJsonWithCurl = async (url, options = {}) => {
  const args = ["-sS", "-L", "--fail", "--max-time", String((options.timeoutMs ?? 20000) / 1000)];
  const headers = options.headers || {};
  Object.entries(headers).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    args.push("-H", `${key}: ${value}`);
  });
  args.push(String(url));

  const { stdout } = await execFileAsync("curl", args, { maxBuffer: 1024 * 1024 * 10 });
  return JSON.parse(stdout);
};

const fetchJson = async (url, options = {}) => {
  const attempts = options.attempts ?? 2;
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetchJsonWithNode(url, options);
    } catch (error) {
      lastError = error;
      const message = error?.message || String(error);
      const isNetworky =
        message.includes("fetch failed") ||
        message.includes("ECONNRESET") ||
        message.includes("ENOTFOUND") ||
        message.includes("ETIMEDOUT") ||
        message.includes("aborted");

      if (!isNetworky) {
        throw error;
      }

      try {
        return await fetchJsonWithCurl(url, options);
      } catch (curlError) {
        lastError = curlError;
      }
    }

    if (attempt < attempts) {
      await sleep(300 * attempt);
    }
  }

  throw lastError;
};

const fetchNewsApiOrg = async () => {
  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", newsApiOrgQuery);
  url.searchParams.set("from", fromDate);
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", "30");

  const json = await fetchJson(url, {
    headers: {
      "X-Api-Key": NEWSAPI_ORG_KEY
    }
  });

  return (json.articles || []).map((item) => toArticle("NewsAPI.org", item)).filter(Boolean);
};

const fetchNewsData = async () => {
  const url = new URL("https://newsdata.io/api/1/latest");
  url.searchParams.set("apikey", NEWSDATA_KEY);
  url.searchParams.set("q", newsDataQuery);
  url.searchParams.set("language", "en");
  url.searchParams.set("country", "us");
  url.searchParams.set("size", "10");

  const json = await fetchJson(url);

  return (json.results || []).map((item) => toArticle("NewsData.io", item)).filter(Boolean);
};

const fetchNewsApiAi = async () => {
  const url = new URL("https://eventregistry.org/api/v1/article/getArticles");
  url.searchParams.set("resultType", "articles");
  url.searchParams.set("keywordOper", "or");
  url.searchParams.set("lang", "eng");
  url.searchParams.set("articlesSortBy", "date");
  url.searchParams.set("articlesCount", "30");
  url.searchParams.set("dateStart", fromDate);
  url.searchParams.set("apiKey", NEWSAPI_AI_KEY);

  searchTerms.forEach((term) => url.searchParams.append("keyword", term));

  const json = await fetchJson(url);
  const results = json.articles?.results || [];

  return results.map((item) => toArticle("NewsAPI.ai", item)).filter(Boolean);
};

const readExistingFeed = async () => {
  try {
    const raw = await readFile(OUTPUT_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const stripInternalFields = (article) => {
  const { carriedForward, ...rest } = article;
  return rest;
};

export const run = async () => {
  const providerResults = await Promise.allSettled([
    fetchNewsApiAi(),
    fetchNewsData(),
    fetchNewsApiOrg()
  ]);

  const errors = [];
  const fetchedArticles = [];
  let providersSucceeded = 0;

  providerResults.forEach((result) => {
    if (result.status === "fulfilled") {
      providersSucceeded += 1;
      fetchedArticles.push(...result.value);
    } else {
      errors.push(result.reason.message);
    }
  });

  if (providersSucceeded === 0) {
    console.error("All news providers failed. Keeping existing feed unchanged.");
    process.exit(1);
  }

  const byUrl = new Map();
  fetchedArticles.forEach((article) => {
    const key = article.url.replace(/[?#].*$/, "");
    if (!byUrl.has(key)) {
      byUrl.set(key, article);
    }
  });

  const { publishCandidates, pendingReview, rejected } = processArticles([...byUrl.values()], today);
  const existingFeed = await readExistingFeed();
  const existingArticles = existingFeed?.articles || [];

  const { articles, carriedForward } = mergeWithCarryForward(publishCandidates, existingArticles, today);
  const publishedArticles = articles.map(stripInternalFields);

  const categoryCounts = categories.map((category) => ({
    id: category.id,
    label: category.label,
    count: publishedArticles.filter((article) => article.categoryId === category.id).length
  }));

  const output = {
    updatedAt: today.toISOString(),
    generatedBy: "scripts/update-news.mjs",
    note: "News is categorized for StallPlus messaging. Hidden camera and safety stories should be framed as additional privacy protection, not guaranteed prevention.",
    providerStatus: {
      attempted: ["NewsAPI.ai", "NewsData.io", "NewsAPI.org"],
      errors
    },
    reviewSummary: {
      published: publishedArticles.length,
      pending: pendingReview.length,
      rejected,
      carriedForward
    },
    categoryCounts,
    articles: publishedArticles,
    pendingReview: pendingReview.map(stripInternalFields)
  };

  await writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(
    `Wrote ${publishedArticles.length} published, ${pendingReview.length} pending, ${rejected} rejected to ${OUTPUT_PATH}`
  );

  if (errors.length) {
    console.warn("Provider errors:");
    errors.forEach((error) => console.warn(`- ${error}`));
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
