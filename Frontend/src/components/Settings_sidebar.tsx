
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
    const isMobile = useIsMobile();
  return (
    <div className="outer h-full  w-[20vw] bg-white  ">
    <Sidebar collapsible={isMobile ? "offcanvas" : "none"}  className=" rounded-md bg-white text-black ">
      <SidebarContent > 
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl text-black">Settings</SidebarGroupLabel>
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
        <Button className="bg-blue-500">Logout</Button>
      </SidebarFooter>
    </Sidebar>
  </div>
  )
}

export default Setting_sidebar