import { OASDocument } from "../../src/services/openapi.service";

describe("openapi.service", () => {
	it("should export a valid OpenAPI document", () => {
		expect(OASDocument).toBeDefined();
		expect(OASDocument).toHaveProperty("openapi");
		expect(OASDocument).toHaveProperty("info");
		expect(OASDocument).toHaveProperty("paths");
		expect(OASDocument).toHaveProperty("components");
		expect(OASDocument.components).toHaveProperty("securitySchemes");
		expect(OASDocument.components?.securitySchemes).toHaveProperty(
			"BearerAuth",
		);
	});

	it("should have BearerAuth security scheme", () => {
		expect(OASDocument.components?.securitySchemes?.BearerAuth).toMatchObject({
			type: "http",
			scheme: "bearer",
			bearerFormat: "JWT",
		});
	});
});
