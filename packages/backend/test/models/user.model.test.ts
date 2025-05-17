import { UserModel } from "../../src/models/user.model";
import { prisma } from "../../src/prisma";

describe("UserModel", () => {
	let userId: string;
	const dummyUser = {
		name: "Test User",
		email: "testuser@example.com",
		password: "hashedpassword",
	};

	beforeAll(async () => {
		await prisma.registration.deleteMany({});
		await prisma.event.deleteMany({});
		await prisma.user.deleteMany({});
	});

	afterAll(async () => {
		await prisma.registration.deleteMany({});
		await prisma.event.deleteMany({});
		await prisma.user.deleteMany({});
		await prisma.$disconnect();
	});

	it("should create a user", async () => {
		const user = await UserModel.create(dummyUser);
		expect(user).toHaveProperty("id");
		expect(user.email).toBe(dummyUser.email);
		userId = user.id;
	});

	it("should find user by email", async () => {
		const user = await UserModel.findByEmail(dummyUser.email);
		expect(user).not.toBeNull();
		expect(user!.email).toBe(dummyUser.email);
	});

	it("should find user by id", async () => {
		const user = await UserModel.findById(userId);
		expect(user).not.toBeNull();
		expect(user!.id).toBe(userId);
	});

	it("should update a user", async () => {
		const updated = await UserModel.update(userId, {
			...dummyUser,
			name: "Updated Name",
		});
		expect(updated.name).toBe("Updated Name");
	});

	it("should get all users", async () => {
		const users = await UserModel.getAllWithCounts();
		expect(Array.isArray(users)).toBe(true);
		expect(users.length).toBeGreaterThan(0);
	});

	it("should find user with details", async () => {
		const user = await UserModel.findByIdWithDetails(userId);
		expect(user).not.toBeNull();
		expect(user!.id).toBe(userId);
	});

	it("should delete user by id", async () => {
		const deleted = await UserModel.deleteByIdWithCascade(userId);
		expect(deleted).toBe(true);
		const user = await UserModel.findById(userId);
		expect(user).toBeNull();
	});
});
