import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";
import { z } from "zod";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  creator: router({
    hookAnalyze: protectedProcedure
      .input(z.object({ hook: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const completion = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are a world-class short-form content strategist. Respond ONLY as compact JSON.",
            },
            {
              role: "user",
              content: `Analyze this hook for viral potential and return JSON with keys score (number), type (string), breakdown (curiosity, clarity, emotionalTrigger, specificity, scrollStoppingPower numbers), mainWeakness (string), improvedHooks (array of 5 strings), viralityConfidence (Low|Medium|High).
Hook: "${input.hook}"`,
            },
          ],
          response_format: { type: "json_object" },
        });

        const result = parseJsonContent(completion, "hook analysis");

        await db.createArtifact({
          userId: ctx.user.id,
          kind: "hook_analysis",
          title: `Hook score ${result.score ?? ""}`.trim(),
          inputText: input.hook,
          resultJson: JSON.stringify(result),
        });

        return result;
      }),

    contentIdeas: protectedProcedure
      .input(z.object({ topic: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const completion = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are a viral content strategist. Respond with a JSON array of ideas only.",
            },
            {
              role: "user",
              content: `Generate 5 content ideas for the topic "${input.topic}". Each item must include title, description, format, difficulty (Easy|Medium|Hard). Return JSON array only.`,
            },
          ],
          response_format: { type: "json_object" },
        });

        const parsed = parseJsonArray(completion, "content ideas");

        await db.createArtifact({
          userId: ctx.user.id,
          kind: "content_idea",
          title: input.topic,
          inputText: input.topic,
          resultJson: JSON.stringify(parsed),
        });

        return parsed;
      }),

    script: protectedProcedure
      .input(
        z.object({
          hook: z.string().min(1),
          platform: z.string().default("Video"),
          duration: z.string().default("60s"),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const completion = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You write concise video scripts. Return only JSON array of segments.",
            },
            {
              role: "user",
              content: `Create a script for ${input.platform} (${input.duration}) starting with hook "${input.hook}". Return JSON array of segments with time and text fields only.`,
            },
          ],
          response_format: { type: "json_object" },
        });

        const parsed = parseJsonArray(completion, "script");

        await db.createArtifact({
          userId: ctx.user.id,
          kind: "script",
          title: `${input.platform} script`,
          inputText: input.hook,
          resultJson: JSON.stringify(parsed),
        });

        return parsed;
      }),

    repurpose: protectedProcedure
      .input(z.object({ content: z.string().min(1), platforms: z.array(z.string()).min(1) }))
      .mutation(async ({ ctx, input }) => {
        const completion = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You repurpose content. Return JSON array with platform and content.",
            },
            {
              role: "user",
              content: `Adapt this content for platforms ${input.platforms.join(", ")}: "${input.content}". Return JSON array items {platform, content}.`,
            },
          ],
          response_format: { type: "json_object" },
        });

        const parsed = parseJsonArray(completion, "repurposed content");

        await db.createArtifact({
          userId: ctx.user.id,
          kind: "repurpose",
          title: "Repurposed content",
          inputText: input.content,
          resultJson: JSON.stringify(parsed),
        });

        return parsed;
      }),

    monetization: protectedProcedure
      .input(
        z.object({
          subscribers: z.number().int().min(0),
          monthlyViews: z.number().int().min(0),
          engagementRate: z.number().min(0),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const completion = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are a revenue modeler. Return a JSON object with monetization metrics only.",
            },
            {
              role: "user",
              content: `Calculate monetization for subscribers=${input.subscribers}, monthlyViews=${input.monthlyViews}, engagementRate=${input.engagementRate}%. Return JSON with subscribers, monthlyViews, engagementRate, adRevenue, sponsorshipPotential, affiliateRevenue, totalMonthly, annualProjection (numbers).`,
            },
          ],
          response_format: { type: "json_object" },
        });

        const parsed = parseJsonObject(completion, "monetization");

        await db.createArtifact({
          userId: ctx.user.id,
          kind: "monetization",
          title: "Monetization model",
          inputText: JSON.stringify(input),
          resultJson: JSON.stringify(parsed),
        });

        return parsed;
      }),

    sponsorship: protectedProcedure
      .input(
        z.object({
          channelName: z.string().min(1),
          subscribers: z.number().int().min(0),
          niche: z.string().min(1),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const completion = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You craft sponsorship pitches. Return JSON object with title and sections array.",
            },
            {
              role: "user",
              content: `Create a sponsorship pitch for channel ${input.channelName} with ${input.subscribers} subscribers in niche ${input.niche}. Return JSON {title, sections:[{title, content}]}.`,
            },
          ],
          response_format: { type: "json_object" },
        });

        const parsed = parseJsonObject(completion, "sponsorship pitch");

        await db.createArtifact({
          userId: ctx.user.id,
          kind: "sponsorship",
          title: parsed?.title ?? "Sponsorship pitch",
          inputText: JSON.stringify(input),
          resultJson: JSON.stringify(parsed),
        });

        return parsed;
      }),

    thumbnail: protectedProcedure
      .input(z.object({ description: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const completion = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are a thumbnail CTR analyst. Return ONLY JSON with ctrScore, colorScore, textScore, faceScore, overallScore (0-10 numbers), strengths (array of strings), improvements (array of strings).",
            },
            {
              role: "user",
              content: `Analyze this thumbnail description: ${input.description}. Return JSON as specified.`,
            },
          ],
          response_format: { type: "json_object" },
        });

        const parsed = parseJsonObject(completion, "thumbnail analysis");

        await db.createArtifact({
          userId: ctx.user.id,
          kind: "thumbnail",
          title: "Thumbnail analysis",
          inputText: input.description,
          resultJson: JSON.stringify(parsed),
        });

        return parsed;
      }),

    artifacts: protectedProcedure
      .input(z.object({ kind: z.enum(["hook_analysis", "content_idea", "script", "repurpose", "monetization", "sponsorship", "thumbnail"]).optional() }))
      .query(async ({ ctx, input }) => {
        const rows = await db.listArtifacts(ctx.user.id, input.kind);
        return rows.map((row) => ({
          ...row,
          result: safeParseJSON(row.resultJson),
        }));
      }),

    deleteArtifact: protectedProcedure
      .input(z.object({ id: z.number().int().min(1) }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteArtifact(ctx.user.id, input.id);
        return { success: true } as const;
      }),

    stats: protectedProcedure.query(async ({ ctx }) => {
      const counts = await db.countArtifacts(ctx.user.id);
      return counts;
    }),
  }),
});

export type AppRouter = typeof appRouter;

function getChoiceContent(choice: { message: { content: unknown } }) {
  const content = choice.message.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    const textPart = content.find((part) => typeof part === "string" || (part as any)?.type === "text");
    if (typeof textPart === "string") return textPart;
    if (textPart && typeof (textPart as any).text === "string") return (textPart as any).text;
  }
  return "";
}

function parseJsonContent(result: Awaited<ReturnType<typeof invokeLLM>>, label: string) {
  const raw = getChoiceContent(result.choices[0]);
  const parsed = safeParseJSON(raw);
  if (!parsed) {
    throw new Error(`Failed to parse ${label} JSON response`);
  }
  return parsed;
}

function parseJsonArray(result: Awaited<ReturnType<typeof invokeLLM>>, label: string) {
  const parsed = parseJsonContent(result, label);
  if (!Array.isArray(parsed)) {
    throw new Error(`${label} response was not an array`);
  }
  return parsed;
}

function parseJsonObject(result: Awaited<ReturnType<typeof invokeLLM>>, label: string) {
  const parsed = parseJsonContent(result, label);
  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
    throw new Error(`${label} response was not an object`);
  }
  return parsed as Record<string, unknown>;
}

function safeParseJSON(text: unknown) {
  if (typeof text !== "string") return text;
  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn("Failed to parse JSON payload", error);
    return null;
  }
}
