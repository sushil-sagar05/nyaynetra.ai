'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Pencil, User } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from './ui/input';
import { useTheme } from 'next-themes';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import Account_Delete from './Account_Delete';
import AutoSave from './AutoSave';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AxiosError } from "axios";
interface ErrorResponse {
  message: string;
}
function Account_Settings() {
  const inputUsernameRef = useRef<HTMLInputElement>(null);
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const { user } = useUser();

  const [username, setUsername] = useState('');
  const [email, setemail] = useState(user?.email);
  const [tempUsername, setTempUsername] = useState('');
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPassword, setTempPassword] = useState('');
  const [editingField, setEditingField] = useState<"username" | "email" | "password" | null>(null);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [pendingField, setPendingField] = useState<"username" | "email" | "password" | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
      setTempUsername(user.username);
    }
  }, [user]);
  const { setUser } = useUser();
      const router =useRouter()
  const handleEdit = (field: typeof editingField) => {
    setEditingField(field);
    setTimeout(() => {
      if (field === 'username') inputUsernameRef.current?.focus();
      if (field === 'email') inputEmailRef.current?.focus();
      if (field === 'password') inputPasswordRef.current?.focus();
    }, 0);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempUsername(username);
    setTempEmail(email);
    setTempPassword('');
  };

  const handleSaveWithConfirmation = (field: typeof editingField) => {
    setPendingField(field);
    setShowPasswordConfirm(true);
  };

  const confirmAndSave = async () => {
    if (confirmPassword.length < 1) return;

    try {
      let response;

      if (pendingField === 'username') {
        response = await api.patch(`${process.env.NEXT_PUBLIC_Backend_Url}/user/update-username`, {
          newUsername: tempUsername,
          currPassword: confirmPassword,
        });
        if (response.status === 200) {
          setUsername(tempUsername);
          toast(response.data.message);
        }
      }

      if (pendingField === 'email') {
        response = await api.patch(`${process.env.NEXT_PUBLIC_Backend_Url}/user/update-email`, {
          newemail: tempEmail,
          currPassword: confirmPassword,
        });
        if (response.status === 200) {
          setemail(tempEmail);
          toast(response.data.message);
        }
      }

      if (pendingField === 'password') {
        response = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/update-password`, {
          newPassword: tempPassword,
          oldPassword: confirmPassword,
        });
        if (response.status === 200) {
          toast(response.data.message);
        }
      }

      setEditingField(null);
      setShowPasswordConfirm(false);
      setConfirmPassword('');
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage= axiosError.response?.data.message;
      toast(errorMessage)
     
    }
  };
  const handleLogout =async()=>{
    try {
      const response = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/logout`,{})
      if(response.status===200){
        toast.success(response.data.message)
        setUser(null)
        router.push('/login')
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    }
 
  }
  const cancelConfirmation = () => {
    setShowPasswordConfirm(false);
    setConfirmPassword('');
  };

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex gap-4 items-center">
                      <User size={40} className="border-2 rounded-full" />
                      <div>
                        <p className="font-bold">{username}</p>
                        <p className="text-sm ">{email}</p>
                      </div>
                    </div>
                    <ChevronRight />
                  </CardContent>
                </Card>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 mt-4">
                <Card className="p-4 border-dotted border-2">
                  {editingField === 'username' ? (
                    <div className="space-y-2">
                      <Input
                        ref={inputUsernameRef}
                        value={tempUsername}
                        onChange={(e) => setTempUsername(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                        <Button onClick={() => handleSaveWithConfirmation("username")}>Save</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="font-bold">{username}</p>
                      <Pencil size={16} className="cursor-pointer" onClick={() => handleEdit("username")} />
                    </div>
                  )}
                </Card>
                <Card className="p-4 border-dotted border-2">
                  {editingField === 'email' ? (
                    <div className="space-y-2">
                      <Input
                        ref={inputEmailRef}
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                        <Button onClick={() => handleSaveWithConfirmation("email")}>Save</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p>{email}</p>
                      <Pencil size={16} className="cursor-pointer" onClick={() => handleEdit("email")} />
                    </div>
                  )}
                </Card>
                <Card className="p-4 border-dotted border-2">
                  {editingField === 'password' ? (
                    <div className="space-y-2">
                      <Input
                        ref={inputPasswordRef}
                        type="password"
                        placeholder="New password"
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                        <Button onClick={() => handleSaveWithConfirmation("password")}>Save</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p>••••••••</p>
                      <Pencil size={16} className="cursor-pointer" onClick={() => handleEdit("password")} />
                    </div>
                  )}
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mt-6">
            <h3 className="text-xl font-semibold tracking-tight">Appearance</h3>
            <div className="mt-4 space-y-4">
              <Card>
                <CardContent className="flex justify-between items-center p-4">
                  <p className="font-bold">English (en)</p>
                  <ChevronRight />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex justify-between items-center p-4">
                  <p className="font-bold">Dark Mode</p>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </CardContent>
              </Card>

              <AutoSave />
            </div>
            <Button
              onClick={()=>handleLogout()}
                 className="bg-orange-500 mt-4 sm:hidden">Logout</Button>
            <div className="mt-6">
              <Account_Delete />
            </div>
          </div>
        </div>
      </div>
      {showPasswordConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="font-bold text-lg mb-4">Confirm your password</h2>
            <Input
              type="password"
              placeholder="Enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={cancelConfirmation}>Cancel</Button>
              <Button className="bg-orange-500" onClick={confirmAndSave}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account_Settings;
