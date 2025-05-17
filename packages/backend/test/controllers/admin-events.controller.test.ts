import request from "supertest";
import app from "../../src/index";

describe("Admin Events API", () => {
	it("GET /admin/events should require admin authentication", async () => {
		const res = await request(app).get("/admin/events");
		expect([401, 403]).toContain(res.statusCode);
	});
});
