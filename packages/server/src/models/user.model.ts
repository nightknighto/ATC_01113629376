import { prisma } from "../index";

export namespace UserModel {
    export const findByEmail = async (email: string) => {
        return prisma.user.findUnique({ where: { email } });
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

    export const findById = async (id: string) => {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
    };
}