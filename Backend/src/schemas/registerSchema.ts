import {z} from 'zod'
export const registerSchema = z.object({
    fullname:z.object({
        firstname:z.string().min(3,"Firstname must be 3 character long"),
        lastname:z.string()

    }),
    username:z.string().min(2,"Username must be atleast 2 characters").max(20,"Username must be no more 20 characters").regex(/^[a-zA-z0-9_]+$/,"Username must not contain special character"),
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"Password must be 6 digit long"})
})
export type RegisterRequest = z.infer<typeof registerSchema>;