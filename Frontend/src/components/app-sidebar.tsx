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

export function AppSidebar({ activeTab, setActiveTab }:any) {
    const isMobile = useIsMobile();
  return (
    <div className="outer h-full  w-[20vw]  ">
    <Sidebar collapsible={isMobile ? "offcanvas" : "none"}  className=" rounded-md bg-white text-black ">
      <SidebarContent > 
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl text-black">Agreement.pdf</SidebarGroupLabel>
          <SidebarGroupLabel className="text-black">Analyzed</SidebarGroupLabel>
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
        <p>Upload: 24 April , 2024</p>
        <p>File Size: 1.54MB</p>
      </SidebarFooter>
    </Sidebar>
  </div>
  
  

  )
}
