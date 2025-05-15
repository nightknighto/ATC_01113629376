import { prisma } from "../index";

export namespace UserModel {
    export const findByEmail = async (email: string) => {
        return await prisma.user.findUnique({ where: { email } });
    };

    export const findById = async (id: string) => {
        return await prisma.user.findUnique({ where: { id } });
    };

    export const create = async (data: { name: string; email: string; password: string }) => {
        return await prisma.user.create({
            data,
        });
    };

    export const getAllWithCounts = async () => {
        return await prisma.user.findMany();
    };
    export const findByIdWithDetails = async (id: string) => {
        return await prisma.user.findUnique({
            where: { id },
            include: {
                events: true
            }
        });
    };
    export const update = async (id: string, data: { name: string; email: string; password?: string }) => {
        return await prisma.user.update({
            where: { id },
            data,
        });
    };
    export const deleteByIdWithCascade = async (id: string) => {
        // Delete related tickets and events if needed, then the user
        // Adjust according to your cascade requirements
        const deleted = await prisma.user.delete({ where: { id } });
        return !!deleted;
    };
}