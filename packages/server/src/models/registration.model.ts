import { prisma } from "../index";

export namespace RegistrationModel {
    export const create = async (data: any) => {
        return await prisma.registration.create({ data });
    };

    export const createWithDetails = async (data: { eventId: string; userId: string }) => {
        return await prisma.registration.create({
            data,
            include: {
                event: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    };

    export const deleteMany = async (filter: any) => {
        return await prisma.registration.deleteMany({ where: filter });
    };

    export const deleteById = async (id: string) => {
        return await prisma.registration.delete({ where: { id } });
    };

    export const deleteByCompositeKey = async (eventId: string, userId: string) => {
        return await prisma.registration.delete({
            where: {
                eventId_userId: {
                    eventId,
                    userId,
                },
            },
        });
    };
}