import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import  { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation"
import { useUser } from "@/context/UserContext";
import api from "@/lib/api";
interface ErrorResponse {
    message: string;
  }

export default function PasswordConfirmationDialog() {
  const { user } = useUser();  
    const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const confirmAndSave = async () => {
    setShowError(false);
    if (confirmPassword.length < 6) {
      setShowError(true);
      return;
    }
  
    setIsLoading(true);

       try {
         const response = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/delete-account`,
             {
                 currPassword:confirmPassword
             },
            )
            console.log(response.data)
           if(response.status===200){
             setConfirmPassword(confirmPassword)
             toast(response.data.message)
             router.push(`/settings/${user?.username}/account-delete`);
           }
           setConfirmPassword("");
       } catch (error) {
         const axiosError = error as AxiosError<ErrorResponse>;
            const errorMessage= axiosError.response?.data.message;
            toast(errorMessage)
       }
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 1500));
    setIsLoading(false);
    setConfirmPassword("");
  };

  const cancelConfirmation = () => {
    setConfirmPassword("");
    setShowError(false);
    setIsLoading(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer">
          Delete Account
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold">
            Confirm Deletion
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            This action cannot be undone. Please enter your password to proceed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoFocus
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
          {showError && (
          <p className="text-sm text-red-500 mt-1">
          Invalid password. Please try again.
          </p>
          )}
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel
            onClick={cancelConfirmation}
            className="cursor-pointer"
            disabled={isLoading}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmAndSave}
            disabled={isLoading}
            className={`cursor-pointer transition-all ${
              isLoading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {isLoading ? "Processing..." : "Yes, Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
