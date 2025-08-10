import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import api from "@/lib/api";
import { AxiosError } from "axios";
import { User, Settings, Shield, HelpCircle, LogOut } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface AppSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

interface ErrorResponse {
  message: string;
}

const items = [
  {
    title: "Account Settings",
    icon: <User className="w-4 h-4" />,
    url: "#",
  },
  {
    title: "Preferences",
    icon: <Settings className="w-4 h-4" />,
    url: "#",
  },
  {
    title: "Privacy",
    icon: <Shield className="w-4 h-4" />,
    url: "#",
  },
  {
    title: "Help",
    icon: <HelpCircle className="w-4 h-4" />,
    url: "#"
  }
]

function Setting_sidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const { setUser, user } = useUser();
  const isMobile = useIsMobile();
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/logout`, {})
      if (response.status === 200) {
        toast.success(response.data.message)
        setUser(null)
        router.push('/login')
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage || "Logout failed")
    }
  }

  return (
    <Card className="h-full border-0 shadow-lg w-full">
      <CardContent className="p-0 w-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your account
          </p>
        </div>
        
        <div className="p-4 w-full">
          <div className="space-y-2 w-full">
            {items.map((item) => (
              <button
                key={item.title}
                onClick={() => setActiveTab(item.title)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 rounded-lg ${
                  activeTab === item.title
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className={`${
                  activeTab === item.title ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
                }`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default Setting_sidebar;
