import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Switch } from "./ui/switch";
import axios from "axios";
import { toast } from "sonner";

function AutoSave() {
  const [isAutoSave, setIsAutoSave] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsAutoSave(checked); 

    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_Backend_Url}/settings/update-settings`,
        {
            autoSave: checked, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );
    if(response.status===200){
       toast(response.data.message) 
    }

      console.log("AutoSave updated:", response.data);
    } catch (error) {
      console.error("Failed to update AutoSave:", error);
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
