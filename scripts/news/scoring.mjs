const DAY_MS = 24 * 60 * 60 * 1000;

export const PUBLISH_THRESHOLD = 70;
export const PENDING_THRESHOLD = 40;
export const MAX_PUBLISHED = 9;
export const MIN_PUBLISHED_BEFORE_CARRY = 3;
export const CARRY_FORWARD_DAYS = 7;
export const FRESHNESS_DAYS = 7;

export const categoryCaps = {
  "bathroom-peeping": 3,
  default: 2
};

export const exclusionPatterns = [
  { id: "entertainment-review", pattern: /\breview\b/i, reason: "entertainment or review content" },
  { id: "cannes", pattern: /\bcannes\b/i, reason: "entertainment or review content" },
  { id: "film", pattern: /\bfilm\b/i, reason: "entertainment or review content" },
  { id: "movie", pattern: /\bmovie\b/i, reason: "entertainment or review content" }
];

export const restroomContextTerms = [
  "bathroom",
  "restroom",
  "stall",
  "locker room",
  "changing room",
  "public restroom",
  "public bathroom",
  "women's restroom",
  "office restroom",
  "dorm bathroom",
  "dorm restroom",
  "communal bathroom",
  "shared bathroom",
  "shower"
];

export const stallGapTerms = [
  "american bathroom stalls",
  "bathroom stall gaps",
  "restroom stall gaps",
  "tiktok bathroom stalls",
  "viral bathroom stall",
  "public bathroom gaps",
  "us bathroom stalls",
  "stall gap"
];

export const workplaceTerms = [
  "return to office",
  "workplace privacy",
  "employee experience",
  "office restroom",
  "facility upgrade",
  "workplace comfort",
  "employee wellness"
];

export const voyeurismTerms = ["voyeurism", "peeping tom", "peeping", "video voyeurism"];

export const categories = [
  {
    id: "bathroom-peeping",
    label: "Bathroom Peeping / Voyeurism Incidents",
    priority: 1,
    hook: "Turns stall gaps from an inconvenience into an immediate privacy concern.",
    terms: [
      "peeping tom",
      "voyeurism",
      "secretly recording",
      "bathroom spy",
      "bathroom peeping",
      "restroom peeping",
      "bathroom harassment",
      "restroom privacy",
      "stall gap",
      "public bathroom privacy"
    ]
  },
  {
    id: "dorm-privacy",
    label: "Dorm Bathroom Privacy + Shared Living",
    priority: 2,
    hook: "Connects shared bathrooms with portable privacy for students and parents.",
    terms: [
      "dorm bathroom",
      "dorm restroom",
      "shared bathroom",
      "communal bathroom",
      "college bathroom",
      "student privacy",
      "coed bathroom",
      "locker room privacy"
    ]
  },
  {
    id: "hidden-cameras",
    label: "Hidden Cameras in Public Spaces",
    priority: 3,
    hook: "Frames StallPlus as additional privacy protection without overclaiming surveillance prevention.",
    terms: [
      "hidden camera",
      "spy camera",
      "bathroom camera",
      "changing room camera",
      "locker room camera",
      "public restroom camera",
      "airbnb camera"
    ]
  },
  {
    id: "workplace-privacy",
    label: "Return-to-Office Workplace Privacy",
    priority: 4,
    hook: "Gives facilities and HR teams a practical employee-experience improvement.",
    terms: [
      "return to office",
      "workplace privacy",
      "employee experience",
      "office restroom",
      "facility upgrade",
      "workplace comfort",
      "employee wellness"
    ]
  },
  {
    id: "viral-stall-gaps",
    label: "Viral Social Media About US Bathroom Stalls",
    priority: 5,
    hook: "Uses high-awareness stall-gap discourse to make the problem instantly recognizable.",
    terms: [
      "american bathroom stalls",
      "bathroom stall gaps",
      "restroom stall gaps",
      "tiktok bathroom stalls",
      "viral bathroom stall",
      "public bathroom gaps",
      "us bathroom stalls"
    ]
  },
  {
    id: "womens-safety",
    label: "Women's Safety & Vulnerability Stories",
    priority: 6,
    hook: "Centers dignity, comfort, and peace of mind without panic-based messaging.",
    terms: [
      "women safety restroom",
      "women privacy bathroom",
      "bathroom safety",
      "restroom safety",
      "women vulnerable public spaces",
      "student safety bathroom"
    ]
  },
  {
    id: "privacy-culture",
    label: "Broader Privacy Culture / Screen Peeping",
    priority: 7,
    hook: "Supports thought leadership around privacy norms in public and shared spaces.",
    terms: [
      "screen peeping",
      "shoulder surfing",
      "phone privacy",
      "privacy culture",
      "public space privacy",
      "airport privacy",
      "coworking privacy"
    ]
  }
];

const normalizeText = (value) => String(value || "").replace(/\s+/g, " ").trim();

const getHaystack = (article) =>
  `${normalizeText(article.title)} ${normalizeText(article.description)}`.toLowerCase();

const countTermHits = (haystack, terms) =>
  terms.reduce((total, term) => total + (haystack.includes(term.toLowerCase()) ? 1 : 0), 0);

const parsePublishedAt = (value) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isFresh = (publishedAt, now, days = FRESHNESS_DAYS) => {
  const date = parsePublishedAt(publishedAt);
  if (!date) {
    return false;
  }

  return now.getTime() - date.getTime() <= days * DAY_MS;
};

export const getExclusion = (article) => {
  const haystack = getHaystack(article);

  for (const rule of exclusionPatterns) {
    if (rule.pattern.test(haystack)) {
      return { excluded: true, reason: rule.reason };
    }
  }

  const hasVoyeurism = voyeurismTerms.some((term) => haystack.includes(term));
  const hasRestroomContext = restroomContextTerms.some((term) => haystack.includes(term));

  if (hasVoyeurism && !hasRestroomContext) {
    return { excluded: true, reason: "voyeurism without restroom context" };
  }

  return { excluded: false, reason: null };
};

export const classifyArticle = (article) => {
  const haystack = getHaystack(article);
  const matches = categories
    .map((category) => ({
      category,
      score: countTermHits(haystack, category.terms)
    }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.category.priority - b.category.priority);

  return matches[0] || null;
};

export const passesCategoryGate = (categoryId, haystack) => {
  const restroomHits = countTermHits(haystack, restroomContextTerms);
  const stallGapHits = countTermHits(haystack, stallGapTerms);
  const workplaceHits = countTermHits(haystack, workplaceTerms);

  switch (categoryId) {
    case "bathroom-peeping":
    case "hidden-cameras":
    case "womens-safety":
      return restroomHits > 0;
    case "workplace-privacy":
      return (
        haystack.includes("office restroom") ||
        haystack.includes("workplace privacy") ||
        (restroomHits > 0 && workplaceHits > 0)
      );
    case "viral-stall-gaps":
      return stallGapHits > 0;
    default:
      return true;
  }
};

export const scoreArticle = (article, now = new Date()) => {
  const exclusion = getExclusion(article);
  if (exclusion.excluded) {
    return {
      disposition: "reject",
      confidence: 0,
      confidenceLabel: null,
      matchReasons: [exclusion.reason],
      category: null,
      categoryId: null,
      priority: null
    };
  }

  const classification = classifyArticle(article);
  if (!classification) {
    return {
      disposition: "reject",
      confidence: 0,
      confidenceLabel: null,
      matchReasons: ["no category match"],
      category: null,
      categoryId: null,
      priority: null
    };
  }

  const haystack = getHaystack(article);
  const { category, score: categoryTermScore } = classification;
  const matchReasons = [];
  let confidence = 0;

  const restroomHits = countTermHits(haystack, restroomContextTerms);
  const restroomPoints = Math.min(restroomHits * 15, 45);
  if (restroomPoints > 0) {
    confidence += restroomPoints;
    matchReasons.push(`restroom context (${restroomHits} terms)`);
  }

  const categoryPoints = Math.min(categoryTermScore * 10, 30);
  confidence += categoryPoints;
  matchReasons.push(`category terms (${categoryTermScore})`);

  const titleHaystack = normalizeText(article.title).toLowerCase();
  const titleHasPrimary = category.terms.some((term) => titleHaystack.includes(term.toLowerCase()));
  if (titleHasPrimary) {
    confidence += 10;
    matchReasons.push("primary topic in title");
  }

  if (isFresh(article.publishedAt, now)) {
    confidence += 10;
    matchReasons.push("published within 7 days");
  }

  if (categoryTermScore >= 2) {
    confidence += 10;
    matchReasons.push("multiple category terms");
  }

  const weakWorkplaceOnly =
    category.id === "workplace-privacy" &&
    haystack.includes("employee experience") &&
    restroomHits === 0 &&
    !haystack.includes("workplace privacy") &&
    !haystack.includes("office restroom");

  if (weakWorkplaceOnly) {
    confidence -= 20;
    matchReasons.push("weak workplace-only match");
  }

  confidence = Math.max(0, Math.min(100, confidence));

  const gatePassed = passesCategoryGate(category.id, haystack);
  if (!gatePassed) {
    matchReasons.push("failed category gate");
  }

  let disposition = "reject";
  let confidenceLabel = null;

  if (confidence >= PUBLISH_THRESHOLD && gatePassed) {
    disposition = "publish";
    confidenceLabel = "high";
  } else if (confidence >= PENDING_THRESHOLD) {
    disposition = "pending";
    confidenceLabel = "medium";
  }

  return {
    disposition,
    confidence,
    confidenceLabel,
    matchReasons,
    category,
    categoryId: category.id,
    priority: category.priority
  };
};

export const buildInsight = (article, category) => {
  const title = normalizeText(article.title).replace(/[.!?]+$/, "");

  switch (category.id) {
    case "bathroom-peeping":
      return `Visible stall gaps turn routine restroom use into a privacy risk. "${title}" supports messaging around dignity, sightline coverage, and practical restroom upgrades without renovation work.`;
    case "dorm-privacy":
      return `Shared dorm and campus bathrooms raise student privacy concerns. "${title}" connects to portable and installed options for administrators and parents evaluating restroom upgrades.`;
    case "hidden-cameras":
      return `Hidden camera stories raise restroom privacy expectations. "${title}" supports additional sightline protection messaging without claiming surveillance detection or guaranteed prevention.`;
    case "workplace-privacy":
      return `Office restroom conditions affect employee experience as teams return on site. "${title}" gives facilities and HR teams a concrete privacy upgrade angle tied to daily workplace comfort.`;
    case "viral-stall-gaps":
      return `Stall-gap discourse makes the U.S. restroom privacy problem easy to recognize. "${title}" supports demand for gap guards that close exposed sightlines in commercial stalls.`;
    case "womens-safety":
      return `Restroom safety stories center dignity and comfort in shared spaces. "${title}" supports privacy upgrades framed around peace of mind, not panic-based claims.`;
    default:
      return `${category.hook} "${title}" supports thought leadership around privacy norms in public and shared spaces.`;
  }
};

export const buildPendingNote = (article, category, matchReasons) => {
  const title = normalizeText(article.title).replace(/[.!?]+$/, "");
  return `Flagged for review (${matchReasons.join(", ")}). "${title}" may fit ${category.label} if restroom context is confirmed.`;
};

const articleSortKey = (article) => {
  const date = parsePublishedAt(article.publishedAt);
  return {
    confidence: article.confidence || 0,
    publishedAt: date ? date.getTime() : 0,
    priority: article.priority || 99
  };
};

export const selectPublishedArticles = (candidates, max = MAX_PUBLISHED) => {
  const sorted = [...candidates].sort((a, b) => {
    const left = articleSortKey(a);
    const right = articleSortKey(b);
    return right.confidence - left.confidence || right.publishedAt - left.publishedAt || left.priority - right.priority;
  });

  const selected = [];
  const counts = {};

  for (const article of sorted) {
    if (selected.length >= max) {
      break;
    }

    const cap = categoryCaps[article.categoryId] ?? categoryCaps.default;
    const current = counts[article.categoryId] || 0;
    if (current >= cap) {
      continue;
    }

    counts[article.categoryId] = current + 1;
    selected.push(article);
  }

  return selected.sort((a, b) => {
    const left = articleSortKey(a);
    const right = articleSortKey(b);
    return left.priority - right.priority || right.confidence - left.confidence || right.publishedAt - left.publishedAt;
  });
};

export const enrichArticle = (article, scoreResult, now = new Date()) => {
  const { category, categoryId, priority, confidence, confidenceLabel, matchReasons, disposition } = scoreResult;

  const enriched = {
    ...article,
    category: category.label,
    categoryId,
    priority,
    confidence,
    confidenceLabel,
    matchReasons,
    stallplusAngle:
      disposition === "pending"
        ? buildPendingNote(article, category, matchReasons)
        : buildInsight(article, category)
  };

  if (disposition === "pending") {
    enriched.flaggedAt = now.toISOString();
  }

  return enriched;
};

export const stillEligibleForCarry = (article, now = new Date()) => {
  if (article.reviewStatus !== "approved" && !isFresh(article.publishedAt, now, CARRY_FORWARD_DAYS)) {
    return false;
  }

  if (article.reviewStatus === "approved") {
    const date = parsePublishedAt(article.publishedAt) || parsePublishedAt(article.approvedAt);
    if (!date) {
      return true;
    }
    return now.getTime() - date.getTime() <= CARRY_FORWARD_DAYS * DAY_MS;
  }

  const exclusion = getExclusion(article);
  return !exclusion.excluded;
};

export const mergeWithCarryForward = (newArticles, existingArticles = [], now = new Date()) => {
  if (newArticles.length >= MIN_PUBLISHED_BEFORE_CARRY) {
    return { articles: newArticles, carriedForward: 0 };
  }

  const byUrl = new Map(newArticles.map((article) => [article.url.replace(/[?#].*$/, ""), article]));
  let carriedForward = 0;

  for (const article of existingArticles) {
    if (byUrl.size >= MAX_PUBLISHED) {
      break;
    }

    const key = article.url.replace(/[?#].*$/, "");
    if (byUrl.has(key)) {
      continue;
    }

    if (!stillEligibleForCarry(article, now)) {
      continue;
    }

    byUrl.set(key, { ...article, carriedForward: true });
    carriedForward += 1;
  }

  const merged = selectPublishedArticles([...byUrl.values()]);
  return { articles: merged, carriedForward };
};

export const processArticles = (rawArticles, now = new Date()) => {
  const publishCandidates = [];
  const pendingReview = [];
  let rejected = 0;

  for (const article of rawArticles) {
    const scoreResult = scoreArticle(article, now);

    if (scoreResult.disposition === "reject") {
      rejected += 1;
      continue;
    }

    const enriched = enrichArticle(article, scoreResult, now);

    if (scoreResult.disposition === "publish") {
      publishCandidates.push(enriched);
    } else {
      pendingReview.push(enriched);
    }
  }

  pendingReview.sort((a, b) => b.confidence - a.confidence || b.priority - a.priority);

  const selected = selectPublishedArticles(publishCandidates);

  return {
    publishCandidates: selected,
    pendingReview: pendingReview.slice(0, 20),
    rejected
  };
};
