import { prisma } from "../index";

export namespace EventModel {
    export const findAllWithDetails = async () => {
        return await prisma.event.findMany({
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: { registrations: true },
                },
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
                registrations: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
    };

    export const createWithOrganizer = async (data: { title: string; description: string; date: Date; location: string; organizerId: string }) => {
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

    export const updateWithOrganizer = async (id: string, data: { title?: string; description?: string; date?: Date; location?: string }) => {
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
}