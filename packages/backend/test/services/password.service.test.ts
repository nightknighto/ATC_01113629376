import { PasswordService } from "../../src/services/password.service";

describe("PasswordService", () => {
	const password = "SuperSecret123!";
	let hash: string;

	it("should hash a password", async () => {
		hash = await PasswordService.hashPassword(password);
		expect(typeof hash).toBe("string");
		expect(hash).not.toBe(password);
	});

	it("should compare a correct password and hash", async () => {
		const result = await PasswordService.comparePassword(password, hash);
		expect(result).toBe(true);
	});

	it("should not match an incorrect password", async () => {
		const result = await PasswordService.comparePassword("WrongPassword", hash);
		expect(result).toBe(false);
	});
});
