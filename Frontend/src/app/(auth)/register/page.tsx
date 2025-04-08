'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState,useContext } from "react"
import { Toaster } from "@/components/ui/sonner"
import { useRouter } from "next/navigation"
import axios,{AxiosError} from 'axios'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast, useSonner } from "sonner"
import { registerSchema } from "@/Schemas/register.schema"
import photo from '../../../../public/Sign up-bro.png'
import Image from 'next/image'
import { useUser } from "@/context/UserContext"
interface ErrorResponse {
  message: string;
}
function page() {
const router = useRouter();
const [username,setUsername] = useState('')
// const [email,setEmail] = useState('')
// const [firstname,setFirstname] = useState('')
// const [password,setPassword] = useState('')
const [isSubmitting,setIsSubmiting] = useState(false)
const {user,setUser} =useUser();
//zod implementation 
const form = useForm<z.infer<typeof registerSchema>>({
  resolver:zodResolver(registerSchema),
  defaultValues:{
    username:'',
    fullname:{
      firstname:'',
      lastname:''
    },
    email:'',
    password:''
  }
})
const onSubmit = async(data:z.infer<typeof registerSchema>)=>{
  setIsSubmiting(true)
  try {
   const response =  await axios.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/register`,data)
   if(response.status===201){
    setUser(response.data.user)
    toast(response.data.message)
    router.replace(`/${username}/dashboard`)
    setIsSubmiting(false)
   }
  } catch (error) {
    console.error("Error in signup of User ",error)
    const axiosError = error as AxiosError<ErrorResponse>;
    let errorMessage= axiosError.response?.data.message;
    toast(errorMessage)
    setIsSubmiting(false)
  }

}

  return (
    <div className="flex justify-center items-center min-h-screen bg-white text-black">
      <div className="sm:w-[85vw]  sm:h-[85vh] sm:p-8   rounded-lg shadow-md ">
              <div className="grid sm:h-[60vh] grid-cols-12 ">
        <div className="left w-[100vw]  col-span-6 md:w-[30vw] p-4  ">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight ">Join the Future of Legal Innovation – Sign Up Now! </h3>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 h-full  p-4"
          >
            <FormField
          name="fullname.firstname"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firstname</FormLabel>
              <FormControl>
                <Input placeholder="Firstname" {...field}
                className="border-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
             <FormField
          name="fullname.lastname"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lastname</FormLabel>
              <FormControl>
                <Input placeholder="Lastname" {...field}
                className="border-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field}
                className="border-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field}
                className="border-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                type="password"
                placeholder="password" {...field}
                className="border-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       <div className="flex ">
       <Button type="submit" disabled={isSubmitting}
        className=" bg-[#1338BE] text-white">
          {
            isSubmitting?<>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
            </>:("Register")
          }
        </Button>
        <p className="text-center ml-4">
  Already a member?{" "}
  <a href="/login" className="text-blue-500 hover:underline">
    Sign In
  </a>
</p>
       </div>
          </form>
        </Form>
        </div>
        <div className="right hidden sm:block h-full col-span-5  ">
        <Image
         className="h-full w-full rounded-lg"
        src={photo}
        alt=""
         layout="responsive"
        />
        </div>
      </div>
      </div>

    </div>
  )
}

export default page