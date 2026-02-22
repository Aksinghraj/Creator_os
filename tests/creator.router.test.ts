import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";

const dbMocks = vi.hoisted(() => ({
  createArtifact: vi.fn(async () => 1),
  listArtifacts: vi.fn(async () => []),
  deleteArtifact: vi.fn(async () => {}),
  countArtifacts: vi.fn(async () => ({ hook_analysis: 1 })),
}));

vi.mock("../server/_core/llm", () => ({
  invokeLLM: vi.fn(async () => ({
    id: "test",
    created: Date.now(),
    model: "mock",
    choices: [
      {
        index: 0,
        finish_reason: "stop",
        message: {
          role: "assistant",
          content: JSON.stringify({
            score: 7,
            type: "Curiosity",
            breakdown: {
              curiosity: 8,
              clarity: 7,
              emotionalTrigger: 6,
              specificity: 6,
              scrollStoppingPower: 7,
            },
            mainWeakness: "Needs clearer benefit",
            improvedHooks: ["A", "B", "C", "D", "E"],
            viralityConfidence: "Medium",
            strengths: ["Bright colors"],
            improvements: ["Bolder text"],
            ctrScore: 8,
            colorScore: 8,
            textScore: 7,
            faceScore: 7,
            overallScore: 8,
          }),
        },
      },
    ],
  })),
}));

vi.mock("../server/db", () => dbMocks);

function createCtx(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "mock",
      email: "mock@example.com",
      name: "Mock User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as TrpcContext["res"],
  };
}

describe("creator router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("analyzes hook and persists artifact", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.creator.hookAnalyze({ hook: "Test hook" });

    expect(result).toHaveProperty("score");
    expect(dbMocks.createArtifact).toHaveBeenCalled();
  });

  it("returns stats", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.creator.stats();
    expect(result.hook_analysis).toBe(1);
    expect(dbMocks.countArtifacts).toHaveBeenCalled();
  });
});
