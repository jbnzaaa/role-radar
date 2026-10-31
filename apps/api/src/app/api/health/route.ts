import { connection } from "next/server";

import { PROMPT_VERSION } from "@/lib/gemini/prompts";

// Public: no session token required (ARCHITECTURE.md §7).
export async function GET() {
  // Opt out of prerendering so GEMINI_MODEL is read at request time, not at build time.
  await connection();
  return Response.json({
    ok: true,
    promptVersion: PROMPT_VERSION,
    model: process.env.GEMINI_MODEL ?? null,
  });
}
