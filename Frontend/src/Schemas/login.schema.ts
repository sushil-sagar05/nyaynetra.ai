import {z} from 'zod';


export const loginSchema = z.object({
    identifier:z.string().min(3, "Username or Email is required"),
    password:z.string().min(6,"Password must be 6 character long")
});
export type LoginRequest = z.infer<typeof loginSchema>;