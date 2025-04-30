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
interface AppSidebarProps {
  documentId: string | string[] | undefined 
  activeTab: string
  setActiveTab: (tab: string) => void

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
      console.log("Docid",documentId)
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
        <p>Upload: 24 April , 2024</p>
        <p>File Size: 1.54MB</p>
      </SidebarFooter>
    </Sidebar>
  </div>
  
  

  )
}
