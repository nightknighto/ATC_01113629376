import { prisma } from "../prisma";

export namespace EventModel {
    export const findAllWithDetails = async (options?: { skip?: number; take?: number; search?: string }) => {
        return await prisma.event.findMany({
            skip: options?.skip,
            take: options?.take,
            where: options?.search
                ? { name: { contains: options.search, mode: 'insensitive' } }
                : undefined,
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: { registrations: true }
                }
            },
        });
    };

    export const findByIdWithDetails = async (id: string) => {
        return await prisma.event.findUnique({
            where: { id },
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: { registrations: true }
                }
            },
        });
    };

    export const createWithOrganizer = async (data: { name: string; description: string; category: string; date: Date; venue: string; price: number; image: string; organizerId: string }) => {
        return await prisma.event.create({
            data,
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    };

    export const updateWithOrganizer = async (id: string, data: { name?: string; description?: string; category?: string; date?: Date; venue?: string; price?: number; image?: string }) => {
        return await prisma.event.update({
            where: { id },
            data,
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    };

    export const deleteById = async (id: string) => {
        return await prisma.event.delete({ where: { id } });
    };

    export const countAll = async (search?: string) => {
        return await prisma.event.count({
            where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined
        });
    };
}