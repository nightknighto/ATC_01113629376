import { prisma } from "../index";

export namespace RegistrationModel {
    export const create = async (data: any) => {
        return prisma.registration.create({ data });
    };

    export const deleteMany = async (filter: any) => {
        return prisma.registration.deleteMany({ where: filter });
    };

    export const deleteById = async (id: string) => {
        return prisma.registration.delete({ where: { id } });
    };
}