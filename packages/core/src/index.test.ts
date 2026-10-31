import { describe, expect, it } from "vitest";

import { APP_NAME } from "./index";

describe("@roleradar/core", () => {
  it("exports the app name", () => {
    expect(APP_NAME).toBe("RoleRadar");
  });
});
