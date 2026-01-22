import request from "supertest";
import { describe, expect, it } from "@jest/globals";
import { createApp } from "../src/app.js";

describe("health endpoint", () => {
  it("responds with ok", async () => {
    const app = await createApp();
    const response = await request(app).get("/api/health/healthz");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});
