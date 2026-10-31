import { APP_NAME } from "@roleradar/core";
import { describe, expect, it } from "vitest";

// Smoke test: Vitest runs and resolves the shared workspace package.
describe("api test setup", () => {
  it("imports from @roleradar/core", () => {
    expect(APP_NAME).toBe("RoleRadar");
  });
});
