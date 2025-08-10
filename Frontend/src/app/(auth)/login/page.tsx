'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { AxiosError } from 'axios'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, Eye, EyeOff, ArrowRight, Shield, Sparkles, Users, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import { loginSchema } from "@/Schemas/login.schema"
import { useUser } from "@/context/UserContext"
import Link from "next/link"

interface ErrorResponse {
  message: string;
}

function Page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { setUser } = useUser()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/login`, data)
      const { username } = response.data.data.user
      if (response.status === 201) {
        setUser(response.data.data.user)
        toast.success(response.data.message)
        router.push(`/dashboard/${username}`)
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error in login of User ", error)
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage || "Login failed. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <div className="w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link href='/' className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl">👁</span>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Nyaynetra
            </span>
          </Link>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 min-h-0">
        <div className="w-full max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center h-full">
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <Card className="border-0 shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                <CardHeader className="space-y-3 pb-4">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      Welcome Back
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Log in to unlock your legal insights
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Badge variant="secondary" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI-Powered
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Secure
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        name="identifier"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">
                              Email or Username
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your email or username" 
                                {...field}
                                className="h-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500/20 transition-colors"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password"
                                  {...field}
                                  className="h-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500/20 transition-colors pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full h-10 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>

                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  <div className="text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      New to Nyaynetra?{" "}
                      <Link 
                        href="/register" 
                        className="font-semibold text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                      >
                        Create an account
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-400/10 dark:to-red-400/10 rounded-3xl transform rotate-2"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 rounded-3xl transform -rotate-2"></div>
                
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 lg:p-12">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                        AI-Powered Legal Document Analysis
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Transform complex legal documents into clear, actionable insights with our advanced AI technology.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Smart Analysis</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          AI extracts key insights and risks
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Secure Platform</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Bank-level security for documents
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Trusted by Experts</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Used by legal professionals
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Fast Results</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Insights in minutes, not hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-center">
                        <div className="text-xl font-bold text-orange-500">10K+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Documents</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-500">99.9%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-500">24/7</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Available</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
