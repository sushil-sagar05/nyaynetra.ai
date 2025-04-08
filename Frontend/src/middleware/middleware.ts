import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
export function middleware(request:NextRequest){
    const path = request.nextUrl.pathname
    const isPrivatePath = path ==='/upload'
   const token = request.cookies.get("token")?.value || ''
   if(isPrivatePath && !token){
    return NextResponse.redirect(new URL('/login',request.url))
   }
}
export const config = {
    matcher:[
        
        '/upload'
    ]
}