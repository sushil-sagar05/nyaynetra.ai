'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import {AxiosError} from 'axios'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { registerSchema } from "@/Schemas/register.schema"
import photo from '../../../../public/Sign up-bro.png'
import Image from 'next/image'
import { useUser } from "@/context/UserContext"
import Link from "next/link"
interface ErrorResponse {
  message: string;
}
function Page() {
const router = useRouter();
const [username,setUsername] = useState('')
const [isSubmitting,setIsSubmiting] = useState(false)
const {setUser} =useUser();
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
   const response =  await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/register`,data)
   if(response.status===201){
    setUser(response.data.data.user)
    toast(response.data.message)
    router.replace(`/dashboard/${username}`)
    setIsSubmiting(false)
   }
  } catch (error) {
    console.error("Error in signup of User ",error)
    const axiosError = error as AxiosError<ErrorResponse>;
    const errorMessage= axiosError.response?.data.message;
    toast(errorMessage)
    setIsSubmiting(false)
  }

}

  return (
    <div className="bg-white">
    <Link href='/' className="font-bold text-3xl text-black m-4">👁Nyaynetra</Link>
    <div className="flex justify-center items-center min-h-screen bg-white text-black">
      <div className=" sm:p-8   rounded-lg shadow-md ">
              <div className="grid  grid-cols-12 ">
        <div className="left w-[100vw]  col-span-6 md:w-[30vw] p-4  ">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight ">Join the Future of Legal Innovation – <span className="text-orange-500">Sign Up Now!</span> </h3>
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
        <Input
          placeholder="username"
          {...field}
          onChange={(e) => {
            field.onChange(e);
            setUsername(e.target.value);
          }}
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
        className=" bg-orange-500 text-white">
          {
            isSubmitting?<>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
            </>:("Register")
          }
        </Button>
        <p className="text-center ml-4">
  Already a member?{" "}
  <Link href="/login" className="text-blue-500 hover:underline">
    Sign In
  </Link>
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
  </div>
  )
}

export default Page