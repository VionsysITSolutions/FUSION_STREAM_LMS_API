import { NextFunction, Request, Response } from 'express';
import responseMessage from '../constants/responseMessage';
import certificateService from '../service/certificate.service';
import catchAsync from '../util/catchAsync';
import httpError from '../util/httpError';
import quicker from '../util/quicker';
import { createCertificateBodySchema, updateCertificateBodySchema } from '../zod/certificate.schema';
import httpResponse from '../util/httpResponse';

export default {

    createCertificate: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = createCertificateBodySchema.safeParse(req.body)
        const studentId = req.user?.id

        if (!studentId) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }
        const alreadyExistCertificate = await certificateService.getCertificateByStudentAndId(studentId, result.data.batchId)

        if (alreadyExistCertificate) {
            return httpResponse(req, res, 200, responseMessage.SUCCESS);
        }

        const certificate = await certificateService.saveCertificate({ ...result.data, studentId });
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { certificate });
    }),

    updateCertificate: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = updateCertificateBodySchema.safeParse(req.body)
        const studentId = req.user?.id
        const certificateId = req.params.id


        if (!studentId) {
            return httpError(next, new Error('student is required'), req, 400);
        }

        if (!result.success || !certificateId) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const { url, certificateNumber } = result.data

        const certificate = await certificateService.updateCertificate(certificateId, studentId, { url, certificateNumber })

        if (!certificate) {
            return httpError(next, new Error('certificate is not available'), req, 400);
        }

        return httpResponse(req, res, 200, responseMessage.SUCCESS, certificate);
    }),

    getStudentCertificate: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const studentId = req.user?.id

        if (!studentId) {
            return httpError(next, new Error('student is required'), req, 400);
        }

        const allCertificates = await certificateService.getCertificatesByStudent(studentId)

        if (!allCertificates) {
            return httpError(next, new Error('certifications are not available for this student'), req, 400);
        }
        return httpResponse(req, res, 200, responseMessage.SUCCESS, allCertificates);
    }),

    verifyCertificate: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.id) {
            return httpError(next, new Error('certificate Id is required'), req, 400);
        }

        const certificate = await certificateService.getCertificateById(`CERT-${req.params?.id}`);

        if (!certificate) {
            return httpError(next, new Error('Certificate not found'), req, 404);
        }

        return httpResponse(req, res, 200, 'certification verify succesfully', certificate);
    }),

    getCertificateById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const studentId = req.user?.id
        const certificateId = req.params?.id

        if (!studentId) {
            return httpError(next, new Error('student id is required'), req, 400);
        }

        const allCertificates = await certificateService.getCertificateByStudentAndId(studentId, certificateId)

        if (!allCertificates) {
            return httpError(next, new Error('certifications are not available for this student'), req, 400);
        }
        return httpResponse(req, res, 200, responseMessage.SUCCESS, allCertificates);
    }),
}