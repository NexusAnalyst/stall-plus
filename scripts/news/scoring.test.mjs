import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  scoreArticle,
  getExclusion,
  classifyArticle,
  processArticles,
  mergeWithCarryForward,
  selectPublishedArticles
} from "./scoring.mjs";

const ferrisHomePeeping = {
  title: "Ferris Peeping Tom arrest made after alleged voyeurism involving juveniles",
  description:
    "Police arrested a man accused of being a Peeping Tom. He is accused of looking into a home to observe victims and unlawfully entered a home in Ferris.",
  url: "https://example.com/ferris",
  publishedAt: "2026-05-15T16:16:13Z"
};

const parallelTalesReview = {
  title:
    "Parallel Tales Review: Asghar Farhadi adaptation turns A Short Film About Love into a long film about nothing",
  description:
    "Cannes: Isabelle Huppert plays a novelist who spies on her neighbors for inspiration in a movie about voyeurism.",
  url: "https://example.com/parallel-tales",
  publishedAt: "2026-05-14T19:04:00Z"
};

const naplesBathroomVoyeurism = {
  title: "Man charged with video voyeurism after filming in bathroom at Pride event",
  description:
    "A Florida man was arrested on video voyeurism charges after authorities say he filmed people inside a public restroom during the event.",
  url: "https://example.com/naples",
  publishedAt: "2026-05-14T14:18:14Z"
};

const shepHykenEmployeeExperience = {
  title: "Are Happy Customers or Employees More Valuable?",
  description:
    "Do happy employees make happy customers? A focus on the employee experience will improve the customer experience.",
  url: "https://example.com/hyken",
  publishedAt: "2026-05-14T12:00:00Z"
};

const stallGapTikTok = {
  title: "TikTok bathroom stalls video highlights American restroom stall gaps",
  description:
    "A viral bathroom stall gaps clip on TikTok shows why American bathroom stalls leave visible public bathroom gaps.",
  url: "https://example.com/tiktok-stalls",
  publishedAt: "2026-05-13T10:00:00Z"
};

describe("getExclusion", () => {
  it("rejects entertainment reviews", () => {
    const result = getExclusion(parallelTalesReview);
    assert.equal(result.excluded, true);
  });

  it("rejects voyeurism without restroom context", () => {
    const result = getExclusion(ferrisHomePeeping);
    assert.equal(result.excluded, true);
  });
});

describe("scoreArticle", () => {
  it("rejects Ferris home peeping story", () => {
    const result = scoreArticle(ferrisHomePeeping, new Date("2026-05-16T12:00:00Z"));
    assert.equal(result.disposition, "reject");
  });

  it("rejects Parallel Tales Cannes review", () => {
    const result = scoreArticle(parallelTalesReview, new Date("2026-05-16T12:00:00Z"));
    assert.equal(result.disposition, "reject");
  });

  it("publishes Naples Pride bathroom voyeurism story", () => {
    const result = scoreArticle(naplesBathroomVoyeurism, new Date("2026-05-16T12:00:00Z"));
    assert.equal(result.disposition, "publish");
    assert.equal(result.categoryId, "bathroom-peeping");
    assert.ok(result.confidence >= 70);
  });

  it("pending or rejects weak employee experience post", () => {
    const result = scoreArticle(shepHykenEmployeeExperience, new Date("2026-05-16T12:00:00Z"));
    assert.notEqual(result.disposition, "publish");
  });

  it("publishes stall-gap TikTok story under viral-stall-gaps", () => {
    const result = scoreArticle(stallGapTikTok, new Date("2026-05-16T12:00:00Z"));
    assert.equal(result.disposition, "publish");
    assert.equal(result.categoryId, "viral-stall-gaps");
  });
});

describe("classifyArticle", () => {
  it("assigns viral-stall-gaps for TikTok stall gap story", () => {
    const result = classifyArticle(stallGapTikTok);
    assert.equal(result.category.id, "viral-stall-gaps");
  });
});

describe("selectPublishedArticles", () => {
  it("caps bathroom-peeping at three articles", () => {
    const candidates = Array.from({ length: 5 }, (_, index) => ({
      url: `https://example.com/peeping-${index}`,
      categoryId: "bathroom-peeping",
      priority: 1,
      confidence: 90 - index,
      publishedAt: "2026-05-15T12:00:00Z"
    }));

    const selected = selectPublishedArticles(candidates);
    assert.equal(selected.filter((item) => item.categoryId === "bathroom-peeping").length, 3);
  });
});

describe("processArticles", () => {
  it("splits publish and pending buckets", () => {
    const { publishCandidates, pendingReview, rejected } = processArticles(
      [naplesBathroomVoyeurism, ferrisHomePeeping, parallelTalesReview, shepHykenEmployeeExperience],
      new Date("2026-05-16T12:00:00Z")
    );

    assert.ok(publishCandidates.length >= 1);
    assert.ok(rejected >= 2);
    assert.ok(pendingReview.length + publishCandidates.length <= 2);
  });
});

describe("mergeWithCarryForward", () => {
  it("carries forward recent articles when new feed is thin", () => {
    const existing = [
      {
        title: "Prior bathroom privacy story",
        description: "Public restroom privacy upgrade in an office building.",
        url: "https://example.com/prior",
        categoryId: "workplace-privacy",
        priority: 4,
        confidence: 75,
        publishedAt: "2026-05-14T12:00:00Z",
        reviewStatus: "approved"
      }
    ];

    const { articles, carriedForward } = mergeWithCarryForward(
      [naplesBathroomVoyeurism].map((article) => ({
        ...article,
        categoryId: "bathroom-peeping",
        priority: 1,
        confidence: 85
      })),
      existing,
      new Date("2026-05-16T12:00:00Z")
    );

    assert.equal(carriedForward, 1);
    assert.equal(articles.length, 2);
  });
});
