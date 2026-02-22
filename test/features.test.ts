import { describe, it, expect, beforeAll } from "vitest";
import { AIService } from "@/lib/ai-service";

describe("Creator OS Features", () => {
  describe("AI Service Initialization", () => {
    it("should have all AI methods available", () => {
      expect(AIService.analyzeHook).toBeDefined();
      expect(AIService.generateContentIdeas).toBeDefined();
      expect(AIService.generateScript).toBeDefined();
      expect(AIService.analyzeThumbnail).toBeDefined();
      expect(AIService.repurposeContent).toBeDefined();
      expect(AIService.calculateMonetization).toBeDefined();
      expect(AIService.generateSponsorshipPitch).toBeDefined();
    });

    it("should have all methods as functions", () => {
      expect(typeof AIService.analyzeHook).toBe("function");
      expect(typeof AIService.generateContentIdeas).toBe("function");
      expect(typeof AIService.generateScript).toBe("function");
      expect(typeof AIService.analyzeThumbnail).toBe("function");
      expect(typeof AIService.repurposeContent).toBe("function");
      expect(typeof AIService.calculateMonetization).toBe("function");
      expect(typeof AIService.generateSponsorshipPitch).toBe("function");
    });
  });

  describe("Hook Analyzer", () => {
    it("should return a valid hook analysis structure", async () => {
      const result = await AIService.analyzeHook("This is a test hook");

      expect(result).toHaveProperty("score");
      expect(result).toHaveProperty("type");
      expect(result).toHaveProperty("breakdown");
      expect(result).toHaveProperty("mainWeakness");
      expect(result).toHaveProperty("improvedHooks");
      expect(result).toHaveProperty("viralityConfidence");
    });

    it("should return score between 1-10", async () => {
      const result = await AIService.analyzeHook("Test hook");
      expect(result.score).toBeGreaterThanOrEqual(1);
      expect(result.score).toBeLessThanOrEqual(10);
    });

    it("should return valid hook type", async () => {
      const result = await AIService.analyzeHook("Test hook");
      const validTypes = ["Curiosity", "Authority", "Story", "Controversy", "Direct Benefit"];
      expect(validTypes).toContain(result.type);
    });

    it("should return 5 improved hooks", async () => {
      const result = await AIService.analyzeHook("Test hook");
      expect(result.improvedHooks).toHaveLength(5);
      expect(result.improvedHooks.every((h: string) => typeof h === "string")).toBe(true);
    });

    it("should return valid virality confidence", async () => {
      const result = await AIService.analyzeHook("Test hook");
      expect(["Low", "Medium", "High"]).toContain(result.viralityConfidence);
    });
  });

  describe("Content Ideation", () => {
    it("should return array of content ideas", async () => {
      const result = await AIService.generateContentIdeas("fitness");
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return valid content idea structure", async () => {
      const result = await AIService.generateContentIdeas("fitness");
      const idea = result[0];

      expect(idea).toHaveProperty("title");
      expect(idea).toHaveProperty("description");
      expect(idea).toHaveProperty("format");
      expect(idea).toHaveProperty("difficulty");
    });

    it("should return valid difficulty levels", async () => {
      const result = await AIService.generateContentIdeas("fitness");
      const validDifficulties = ["Easy", "Medium", "Hard"];
      result.forEach((idea) => {
        expect(validDifficulties).toContain(idea.difficulty);
      });
    });
  });

  describe("Script Writer", () => {
    it("should return array of script segments", async () => {
      const result = await AIService.generateScript("Test hook", "TikTok", "60s");
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return valid script segment structure", async () => {
      const result = await AIService.generateScript("Test hook", "TikTok", "60s");
      const segment = result[0];

      expect(segment).toHaveProperty("time");
      expect(segment).toHaveProperty("text");
      expect(typeof segment.time).toBe("string");
      expect(typeof segment.text).toBe("string");
    });
  });

  describe("Thumbnail Analyzer", () => {
    it("should return valid thumbnail analysis", async () => {
      const result = await AIService.analyzeThumbnail("Red background with white text");

      expect(result).toHaveProperty("ctrScore");
      expect(result).toHaveProperty("colorScore");
      expect(result).toHaveProperty("textScore");
      expect(result).toHaveProperty("faceScore");
      expect(result).toHaveProperty("overallScore");
      expect(result).toHaveProperty("strengths");
      expect(result).toHaveProperty("improvements");
    });

    it("should return scores between 0-10", async () => {
      const result = await AIService.analyzeThumbnail("Red background with white text");

      expect(result.ctrScore).toBeGreaterThanOrEqual(0);
      expect(result.ctrScore).toBeLessThanOrEqual(10);
      expect(result.colorScore).toBeGreaterThanOrEqual(0);
      expect(result.colorScore).toBeLessThanOrEqual(10);
      expect(result.textScore).toBeGreaterThanOrEqual(0);
      expect(result.textScore).toBeLessThanOrEqual(10);
      expect(result.faceScore).toBeGreaterThanOrEqual(0);
      expect(result.faceScore).toBeLessThanOrEqual(10);
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(10);
    });

    it("should return arrays of strengths and improvements", async () => {
      const result = await AIService.analyzeThumbnail("Red background with white text");

      expect(Array.isArray(result.strengths)).toBe(true);
      expect(Array.isArray(result.improvements)).toBe(true);
      expect(result.strengths.length).toBeGreaterThan(0);
      expect(result.improvements.length).toBeGreaterThan(0);
    });
  });

  describe("Content Repurposing", () => {
    it("should return repurposed content for multiple platforms", async () => {
      const result = await AIService.repurposeContent("Test content", ["Twitter", "LinkedIn"]);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return valid repurposed content structure", async () => {
      const result = await AIService.repurposeContent("Test content", ["Twitter"]);
      const item = result[0];

      expect(item).toHaveProperty("platform");
      expect(item).toHaveProperty("content");
      expect(typeof item.platform).toBe("string");
      expect(typeof item.content).toBe("string");
    });
  });

  describe("Monetization Calculator", () => {
    it("should return valid monetization data", async () => {
      const result = await AIService.calculateMonetization(100000, 1000000, 5);

      expect(result).toHaveProperty("subscribers");
      expect(result).toHaveProperty("monthlyViews");
      expect(result).toHaveProperty("engagementRate");
      expect(result).toHaveProperty("adRevenue");
      expect(result).toHaveProperty("sponsorshipPotential");
      expect(result).toHaveProperty("affiliateRevenue");
      expect(result).toHaveProperty("totalMonthly");
      expect(result).toHaveProperty("annualProjection");
    });

    it("should return positive revenue values", async () => {
      const result = await AIService.calculateMonetization(100000, 1000000, 5);

      expect(result.adRevenue).toBeGreaterThanOrEqual(0);
      expect(result.sponsorshipPotential).toBeGreaterThanOrEqual(0);
      expect(result.affiliateRevenue).toBeGreaterThanOrEqual(0);
      expect(result.totalMonthly).toBeGreaterThanOrEqual(0);
      expect(result.annualProjection).toBeGreaterThanOrEqual(0);
    });

    it("should calculate annual projection as 12x monthly", async () => {
      const result = await AIService.calculateMonetization(100000, 1000000, 5);
      expect(result.annualProjection).toBe(result.totalMonthly * 12);
    });
  });

  describe("Sponsorship Pitch Generator", () => {
    it("should return valid sponsorship pitch", async () => {
      const result = await AIService.generateSponsorshipPitch("Tech Daily", 100000, "technology");

      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("sections");
      expect(Array.isArray(result.sections)).toBe(true);
    });

    it("should return valid pitch section structure", async () => {
      const result = await AIService.generateSponsorshipPitch("Tech Daily", 100000, "technology");
      const section = result.sections[0];

      expect(section).toHaveProperty("title");
      expect(section).toHaveProperty("content");
      expect(typeof section.title).toBe("string");
      expect(typeof section.content).toBe("string");
    });

    it("should include channel name in title", async () => {
      const result = await AIService.generateSponsorshipPitch("Tech Daily", 100000, "technology");
      expect(result.title).toContain("Tech Daily");
    });
  });
});
