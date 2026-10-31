import { afterEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

// Handlers are called directly, outside a Next request scope.
vi.mock("next/server", () => ({ connection: () => Promise.resolve() }));

describe("GET /api/health", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns ok, prompt version and model", async () => {
    vi.stubEnv("GEMINI_MODEL", "test-model");
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      ok: true,
      promptVersion: "analyze-v1",
      model: "test-model",
    });
  });

  it("returns model null when GEMINI_MODEL is unset", async () => {
    vi.stubEnv("GEMINI_MODEL", undefined);
    expect((await (await GET()).json()).model).toBeNull();
  });
});
