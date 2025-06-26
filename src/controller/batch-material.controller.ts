import { NextFunction, Request, Response } from 'express';
import catchAsync from '../util/catchAsync';
import { createBatchMaterialSchema, deleteBatchMaterialId } from '../zod/batchMaterial.schema';
import quicker from '../util/quicker';
import httpError from '../util/httpError';
import httpResponse from '../util/httpResponse';
import responseMessage from '../constants/responseMessage';
import batchMaterialService from '../service/batch-material.service';

export default {

    addMaterial: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const instructorId = req.user?.id
        const result = createBatchMaterialSchema.safeParse({ ...req.body, instructorId })

        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const material = await batchMaterialService.createMaterial(result.data)
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { material });
    }),

    deleteMaterial: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const idResult = deleteBatchMaterialId.safeParse(req.params.id)
        if (!idResult.success) {
            return httpError(next, new Error(quicker.zodError(idResult)), req, 400);
        }

        const materialExist = await batchMaterialService.getatchMaterialById(idResult.data)
        if (!materialExist) {
            return httpError(next, new Error('batchMaterial not found or alreday deleted'), req, 400);
        }

        await batchMaterialService.deleteBatchMeterial(idResult.data)
        return httpResponse(req, res, 200, responseMessage.SUCCESS);
    }),

    getMaterialByBatch: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const idResult = deleteBatchMaterialId.safeParse(req.params.id)
        if (!idResult.success) {
            return httpError(next, new Error(quicker.zodError(idResult)), req, 400);
        }
        const batchMaterial = await batchMaterialService.getBatchMaterialByBatch(idResult.data)
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { batchMaterial });
    }),

    getMaterialByInstructor: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const idResult = deleteBatchMaterialId.safeParse(req.params.id)
        if (!idResult.success) {
            return httpError(next, new Error(quicker.zodError(idResult)), req, 400);
        }
        const batchMaterial = await batchMaterialService.getBatchMaterialByInstructor(Number(idResult.data))
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { batchMaterial });
    })
}