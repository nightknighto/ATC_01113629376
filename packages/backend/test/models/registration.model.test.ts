import { EventModel } from "../../src/models/event.model";
import { RegistrationModel } from "../../src/models/registration.model";
import { UserModel } from "../../src/models/user.model";
import { prisma } from "../../src/prisma";

describe("RegistrationModel", () => {
	let userId: string;
	let eventId: string;
	let registrationId: string;

	beforeAll(async () => {
		await prisma.registration.deleteMany({});
		await prisma.event.deleteMany({});
		await prisma.user.deleteMany({});
		const user = await UserModel.create({
			name: "Reg User",
			email: "reguser@example.com",
			password: "pw",
		});
		userId = user.id;
		const event = await EventModel.createWithOrganizer({
			name: "Reg Event",
			description: "desc",
			category: "cat",
			date: new Date(),
			venue: "venue",
			price: 0,
			image: "",
			organizerId: userId,
		});
		eventId = event.id;
	});

	afterAll(async () => {
		await prisma.registration.deleteMany({});
		await prisma.event.deleteMany({});
		await prisma.user.deleteMany({});
		await prisma.$disconnect();
	});

	it("should create a registration", async () => {
		const reg = await RegistrationModel.createWithDetails({ eventId, userId });
		expect(reg).toHaveProperty("id");
		expect(reg.user.id).toBe(userId);
		registrationId = reg.id;
	});

	it("should delete registration by id", async () => {
		const deleted = await RegistrationModel.deleteById(registrationId);
		expect(deleted).toHaveProperty("id", registrationId);
		// Should be gone
		const regs = await prisma.registration.findMany({
			where: { id: registrationId },
		});
		expect(regs.length).toBe(0);
	});

	it("should create and delete by composite key", async () => {
		const reg = await RegistrationModel.createWithDetails({ eventId, userId });
		expect(reg).toHaveProperty("id");
		await RegistrationModel.deleteByCompositeKey(eventId, userId);
		const regs = await prisma.registration.findMany({
			where: { eventId, userId },
		});
		expect(regs.length).toBe(0);
	});
});
