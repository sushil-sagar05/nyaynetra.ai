
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
import { Button } from "./ui/button";
import { url } from "inspector";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import api from "@/lib/api";
  interface AppSidebarProps {
    activeTab: string
    setActiveTab: (tab: string) => void
  
  }
    const items = [
      {
        title: "Account Settings",
        url: "#",
      },
      {
        title: "Prefrences",
        url: "#",
      },
      {
        title: "Privacy",
        url: "#",
      },{
        title:"Help",
        url:"#"
      }
    ]
function Setting_sidebar({ activeTab, setActiveTab}: AppSidebarProps) {
  const { setUser } = useUser();
    const isMobile = useIsMobile();
    const router =useRouter()
    const handleLogout =async()=>{
      try {
        const response = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/logout`,{})
        if(response.status===200){
          toast.success(response.data.message)
          setUser(null)
          router.push('/login')
        }
      } catch (error:any) {
        toast.error(error.response.data.message)
      }
   
    }
  return (
    <div className="outer h-full">
    <Sidebar collapsible={isMobile ? "offcanvas" : "none"}  className=" rounded-md ">
      <SidebarContent > 
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl ">Settings</SidebarGroupLabel>
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
                      <span className="capitalize">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
        onClick={()=>handleLogout()}
        className="bg-orange-500">Logout</Button>
      </SidebarFooter>
    </Sidebar>
  </div>
  )
}

export default Setting_sidebar