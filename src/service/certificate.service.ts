
import prisma from '../lib/db';
import { saveCertificateBody } from '../types/types';

// when studnet is enrolled in batch cratecertificate with noUrl
// and in the certificate show certifacte with no url and messgae as complte final submission so get this certification
// when teh final is test is submitted create certificate in next server actions and chek if teh marks more than 85% then save certificate url in the db

export default {
    saveCertificate: async (payload: saveCertificateBody) => {
        return await prisma.certificate.create({
            data: payload
        })
    },

    updateCertificate: async (certificateId: string, studentId: number, payload: { url: string, certificateNumber: string }) => {
        return await prisma.certificate.update({
            where: { id: certificateId, studentId },
            data: payload
        })
    },

    getCertificateById: async (id: string) => {
        return await prisma.certificate.findUnique({
            where: { certificateNumber: id },
            omit: {
                url: true
            },
            include: {
                student: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                batch: {
                    include: {
                        course: true
                    }
                }
            }
        })
    },

    getCertificatesByStudent: async (studentId: number) => {
        return await prisma.certificate.findMany({
            where: { studentId },
            include: {
                batch: {
                    include: {
                        course: true
                    }
                }
            }
        })
    },

    getCertificateByStudentAndId: async (studentId: number, batchId: string) => {
        return await prisma.certificate.findFirst({
            where: { studentId, batchId },
            include: {
                student: {
                    select: {
                        firstName: true, lastName: true,
                    }
                },
                batch: {
                    include: {
                        course: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            }
        })
    }
}