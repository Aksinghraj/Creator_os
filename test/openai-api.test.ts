import { describe, it, expect } from "vitest";

describe("OpenAI API Integration", () => {
  it("should validate OpenAI API key is set", () => {
    const apiKey = process.env.OPENAI_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toBeTruthy();
    expect(apiKey).toMatch(/^sk-/);
  });

  it("should have valid API key format", () => {
    const apiKey = process.env.OPENAI_API_KEY;
    // OpenAI keys start with 'sk-' and are at least 20 characters
    expect(apiKey).toMatch(/^sk-.{20,}$/);
  });
});
