import request from "supertest";
import app from "../../src/index";

xdescribe("Users API", () => {
	it("GET /users should require authentication", async () => {
		const res = await request(app).get("/users");
		expect([401, 403]).toContain(res.statusCode);
	});
});
