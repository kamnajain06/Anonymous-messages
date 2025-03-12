import { z } from 'zod';

export const verifySchema = z.object({
    verifiedCode: z.string().length(6, { message: "Invalid code" }),
})