import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile";
import { AlignLeft,WrapText,FileWarning,MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import React from "react";
import api from "@/lib/api";
import { AxiosError } from "axios";
interface AppSidebarProps {
  documentId: string | string[] | undefined 
  activeTab: string
  setActiveTab: (tab: string) => void
}
interface ErrorResponse {
  message: string;
}
  const items = [
    {
      title: "Summary",
      url: "#",
      icon: AlignLeft,
    },
    {
      title: "Key clause",
      url: "#",
      icon: WrapText,
    },
    {
      title: "Risk flag",
      url: "#",
      icon: FileWarning,
    },
    {
      title: "chat",
      url: "#",
      icon: MessageCircle,
    }
  ]
  export function AppSidebar({ activeTab, setActiveTab,documentId}: AppSidebarProps) {
    const [isSaved, setisSaved] = useState(false)
    const isMobile = useIsMobile();
    const currentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
      const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault()
        if (!documentId) {
          console.error("No document ID found.")
          return
        }
        try {
          const response = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/${documentId}/save-document`,{})
          toast(response.data.data)
          setisSaved(true)
        } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (axiosError?.response?.status === 400) {
                  toast.error("Guest is not allowed to save document")
                  return
                }
                const errorMessage = axiosError.response?.data.message
                toast.error(errorMessage || "Save failed")
        }
      }

  return (
    <div className="outer h-full ">
    <Sidebar collapsible={isMobile ? "offcanvas" : "none"}  className=" rounded-md  ">
      <SidebarContent > 
        <SidebarGroup>
          <SidebarGroupLabel className="text-2x">Agreement.pdf</SidebarGroupLabel>
          <SidebarGroupLabel>Analyzed</SidebarGroupLabel>
          <SidebarGroupContent>
          <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => setActiveTab(item.title)}
                      className={`flex items-center gap-2 w-full text-left ${
                        activeTab === item.title ? "font-bold " : ""
                      }`}
                    >
                      {item.icon && <item.icon />}
                      <span className="capitalize">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-8">
        <Button
        disabled={isSaved}
        className="cursor-pointer
        "
        onClick={(e)=>handleSubmit(e)}
        >{isSaved?"Document Saved":"Save Document"}</Button>
        <p>Upload Date: {currentDate}</p>
        <p>File Size: 1.54MB</p>
      </SidebarFooter>
    </Sidebar>
  </div>
  
  

  )
}
