'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Toaster } from "@/components/ui/sonner"
import { useRouter } from "next/navigation"
import axios,{AxiosError} from 'axios'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast, useSonner } from "sonner"
import { loginSchema } from "@/Schemas/login.schema"
import photo from '../../../../public/Mobile login-bro.png'
import Image from 'next/image'
import { useUser } from "@/context/UserContext"
interface ErrorResponse {
  message: string;
}
function page() {
const router = useRouter();
const [identifier,setIdentifier] = useState('')
const [isSubmitting,setIsSubmiting] = useState(false)
const {user,setUser} = useUser()
//zod implementation 
const form = useForm<z.infer<typeof loginSchema>>({
  resolver:zodResolver(loginSchema),
  defaultValues:{
    identifier:'',
    password:''
  }
})
const onSubmit = async(data:z.infer<typeof loginSchema>)=>{
  setIsSubmiting(true)
  try {
   const response =  await axios.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/login`,data)
   console.log(response.data)
   const {username} = response.data.data.user
   console.log(username)
   if(response.status===201){
    setUser(response.data.data.user)
    localStorage.setItem('token',response.data.data.accessToken)
    toast(response.data.message)
    router.push(`/dashboard/${username}`)
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
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight ">Welcome Back! Log in to Unlock Your Legal Insights.
        </h3>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 h-full  p-4"
          >
        <FormField
          name="identifier"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input placeholder="email or username" {...field}
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
            </>:("login")
          }
        </Button>
        <p className="text-center ml-4">
  New Here?{" "}
  <a href="/register" className="text-blue-500 hover:underline">
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