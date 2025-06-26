
import prisma from '../lib/db'
import { createMaterialType } from '../zod/batchMaterial.schema'

export default {
    createMaterial: async (data: createMaterialType) => {
        return prisma.batch_material.create({
            data
        })
    },

    getBatchMaterialByBatch: async (id: string) => {
        return prisma.batch_material.findMany({
            where: { batchId: id },
            include: {
                batch: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                instructor: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        })
    },

    deleteBatchMeterial: async (id: string) => {
        return prisma.batch_material.delete({
            where: { id }
        })
    },

    getBatchMaterialByInstructor: async (id: number) => {
        return prisma.batch_material.findMany({
            where: {
                instructorId: id
            },
            include: {
                batch: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                instructor: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        })
    },

    getatchMaterialById: async (id: string) => {
        return prisma.batch_material.findUnique({
            where: { id }
        })
    }
}