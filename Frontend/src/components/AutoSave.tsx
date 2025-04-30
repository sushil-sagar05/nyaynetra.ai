import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Switch } from "./ui/switch";
import api from "@/lib/api";
import{AxiosError} from "axios";
import { toast } from "sonner";
interface ErrorResponse {
  message: string;
}
function AutoSave() {
  const [isAutoSave, setIsAutoSave] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsAutoSave(checked); 

    try {
    const response = await api.patch(
        `${process.env.NEXT_PUBLIC_Backend_Url}/settings/update-settings`,
        {
            autoSave: checked, 
        }
    );
    if(response.status===200){
       toast(response.data.message) 
    }
    } catch (error) {
      console.error("Failed to update AutoSave:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage= axiosError.response?.data.message;
        toast(errorMessage)

    }
  };

  return (
    <div>
      <Card className="h-full flex justify-center mt-2 ">
        <CardContent className="flex gap-8 items-center">
          <div className="flex gap-4 items-center w-full">
            <p className="font-bold">Auto Save</p>
            <Switch
              checked={isAutoSave}
              onCheckedChange={handleToggle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AutoSave;
