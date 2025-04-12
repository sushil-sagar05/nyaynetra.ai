import {z} from 'zod'
export const passwordUpdateSchema = z.object({
    oldPassword:z.string().min(6),
    newPassword:z.string().min(6)
});
export type PasswordUpdate = z.infer<typeof passwordUpdateSchema>;