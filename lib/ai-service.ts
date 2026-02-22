/**
 * AI Service - Handles all OpenAI API calls for Creator OS
 * This service provides methods for:
 * - Hook analysis and scoring
 * - Content ideation
 * - Script generation
 * - Thumbnail analysis recommendations
 * - Content repurposing
 * - Monetization modeling
 * - Sponsorship pitch generation
 */

// NOTE: Client-side calls are intentionally stubbed to avoid exposing API keys.
// Frontend now uses tRPC backend for AI. These helpers return deterministic
// mock data for tests and offline usage.

interface HookAnalysisResult {
  score: number;
  type: string;
  breakdown: {
    curiosity: number;
    clarity: number;
    emotionalTrigger: number;
    specificity: number;
    scrollStoppingPower: number;
  };
  mainWeakness: string;
  improvedHooks: string[];
  viralityConfidence: "Low" | "Medium" | "High";
}

interface ContentIdea {
  title: string;
  description: string;
  format: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface ScriptSegment {
  time: string;
  text: string;
}

interface ThumbnailAnalysis {
  ctrScore: number;
  colorScore: number;
  textScore: number;
  faceScore: number;
  overallScore: number;
  strengths: string[];
  improvements: string[];
}

interface RepurposedContent {
  platform: string;
  content: string;
}

interface MonetizationData {
  subscribers: number;
  monthlyViews: number;
  engagementRate: number;
  adRevenue: number;
  sponsorshipPotential: number;
  affiliateRevenue: number;
  totalMonthly: number;
  annualProjection: number;
}

interface SponsorshipPitch {
  title: string;
  sections: {
    title: string;
    content: string;
  }[];
}

function sample<T>(value: T): T {
  return value;
}

export const AIService = {
  /**
   * Analyze a hook for viral potential
   */
  async analyzeHook(hook: string): Promise<HookAnalysisResult> {
    const baseScore = Math.min(10, Math.max(1, 7));
    return sample({
      score: baseScore,
      type: "Curiosity",
      breakdown: {
        curiosity: baseScore,
        clarity: baseScore - 1,
        emotionalTrigger: baseScore - 2,
        specificity: baseScore - 1,
        scrollStoppingPower: baseScore,
      },
      mainWeakness: "Could be more specific and benefit-driven.",
      improvedHooks: [
        `${hook} — but reveal a surprising stat in 5 seconds`,
        `What happened when we tried ${hook}?`,
        `${hook}? Here’s the unexpected result`,
        `Nobody tells you this about ${hook}`,
        `${hook} (do this before it’s too late)`,
      ],
      viralityConfidence: "Medium",
    });
  },

  /**
   * Generate content ideas for a topic
   */
  async generateContentIdeas(topic: string): Promise<ContentIdea[]> {
    return sample([
      {
        title: `${topic}: the 5-minute fix`,
        description: "Quick, actionable win that hooks busy viewers",
        format: "Tutorial",
        difficulty: "Easy",
      },
      {
        title: `I tried ${topic} for 7 days—results surprised me`,
        description: "Story arc with tension and payoff",
        format: "Story",
        difficulty: "Medium",
      },
    ]);
  },

  /**
   * Generate a video script
   */
  async generateScript(
    hook: string,
    platform: string,
    duration: string
  ): Promise<ScriptSegment[]> {
    return sample([
      { time: "0:00-0:05", text: hook },
      { time: "0:05-0:20", text: "Main point with vivid example" },
      { time: "0:20-0:40", text: "Story beat + tension" },
      { time: "0:40-0:55", text: "Takeaway + CTA" },
    ]);
  },

  /**
   * Analyze thumbnail and provide recommendations
   */
  async analyzeThumbnail(imageDescription: string): Promise<ThumbnailAnalysis> {
    return sample({
      ctrScore: 8,
      colorScore: 9,
      textScore: 7,
      faceScore: 8,
      overallScore: 8,
      strengths: [
        "High contrast colors that stand out",
        "Readable text at small sizes",
        "Strong facial expression",
      ],
      improvements: [
        "Tighter crop on subject",
        "Add subtle border for feeds",
        "Test bolder headline color",
      ],
    });
  },

  /**
   * Repurpose content for different platforms
   */
  async repurposeContent(content: string, platforms: string[]): Promise<RepurposedContent[]> {
    return sample(
      platforms.map((platform) => ({
        platform,
        content: `${platform}: ${content} (adapted)`,
      })),
    );
  },

  /**
   * Calculate monetization potential
   */
  async calculateMonetization(
    subscribers: number,
    monthlyViews: number,
    engagementRate: number
  ): Promise<MonetizationData> {
    const adRevenue = (monthlyViews / 1000) * 4;
    const sponsorshipPotential = subscribers * 0.02;
    const affiliateRevenue = monthlyViews * 0.001;
    const totalMonthly = Math.round(adRevenue + sponsorshipPotential + affiliateRevenue);
    return sample({
      subscribers,
      monthlyViews,
      engagementRate,
      adRevenue,
      sponsorshipPotential,
      affiliateRevenue,
      totalMonthly,
      annualProjection: totalMonthly * 12,
    });
  },

  /**
   * Generate sponsorship pitch
   */
  async generateSponsorshipPitch(
    channelName: string,
    subscribers: number,
    niche: string
  ): Promise<SponsorshipPitch> {
    return sample({
      title: `${channelName} Sponsorship Pitch`,
      sections: [
        { title: "About Us", content: `${channelName} creates leading ${niche} content.` },
        { title: "Audience", content: "Highly engaged viewers across major platforms." },
        { title: "Opportunities", content: "Integrations, shoutouts, dedicated videos." },
      ],
    });
  },
};
