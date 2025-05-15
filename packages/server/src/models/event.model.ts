import { prisma } from "../index";

export namespace EventModel {
    export const findAll = async () => {
        return prisma.event.findMany();
    };

    export const findById = async (id: string) => {
        return prisma.event.findUnique({ where: { id } });
    };

    export const create = async (data: any) => {
        return prisma.event.create({ data });
    };

    export const update = async (id: string, data: any) => {
        return prisma.event.update({ where: { id }, data });
    };

    export const deleteById = async (id: string) => {
        return prisma.event.delete({ where: { id } });
    };
}