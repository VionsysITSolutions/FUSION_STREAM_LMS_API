import { z } from 'zod';

export const createCertificateBodySchema = z.object({
    batchId: z
        .string({
            required_error: 'Batch ID is required',
            invalid_type_error: 'Batch ID must be a string'
        })
});

export const updateCertificateBodySchema = z.object({
    url: z.string({
        required_error: 'First name is required',
        invalid_type_error: 'First name must be a string'
    }).url('Please provide a valid URL'),
    certificateNumber: z.string({
        required_error: 'First name is required',
        invalid_type_error: 'First name must be a string'
    })
})