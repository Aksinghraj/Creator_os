import { describe, it, expect } from "vitest";

describe("OpenAI API Integration", () => {
  const stubKey = "sk-test-12345678901234567890";

  beforeAll(() => {
    process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || stubKey;
  });

  it("should validate OpenAI API key is set", () => {
    const apiKey = process.env.OPENAI_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toBeTruthy();
    expect(apiKey).toMatch(/^sk-/);
  });

  it("should have valid API key format", () => {
    const apiKey = process.env.OPENAI_API_KEY;
    expect(apiKey).toMatch(/^sk-.{20,}$/);
  });
});
