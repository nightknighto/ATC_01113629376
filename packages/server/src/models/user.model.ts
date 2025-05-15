import { prisma } from "../index";

export namespace UserModel {
    export const findByEmail = async (email: string) => {
        return prisma.user.findUnique({ where: { email } });
    };

    export const findById = async (id: string) => {
        return prisma.user.findUnique({ where: { id } });
    };

    export const create = async (data: { name: string; email: string; password: string }) => {
        return prisma.user.create({
            data,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    };

    export const getAllWithCounts = async () => {
        return prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        events: true,
                    }
                }
            }
        });
    };
    export const findByIdWithDetails = async (id: string) => {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                events: true,
            }
        });
    };
    export const update = async (id: string, data: { name: string; email: string; password?: string }) => {
        return prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    };
    export const deleteByIdWithCascade = async (id: string) => {
        // Delete related tickets and events if needed, then the user
        // Adjust according to your cascade requirements
        const deleted = await prisma.user.delete({ where: { id } });
        return !!deleted;
    };
}