import { SafeParseReturnType } from 'zod';

export default {
    zodError: (result: SafeParseReturnType<unknown, unknown>) => {
        const error = result?.error?.issues[0]?.message ?? 'Validation error';
        return error;
    }
};
