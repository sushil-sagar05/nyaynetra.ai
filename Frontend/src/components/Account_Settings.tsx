'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Pencil, User, Mail, Lock, Globe, Moon, Save, LogOut, Settings } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from './ui/input';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import Account_Delete from './Account_Delete';
import AutoSave from './AutoSave';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AxiosError } from "axios";
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { DialogHeader } from './ui/dialog';

interface ErrorResponse {
  message: string;
}

function Account_Settings() {
  const inputUsernameRef = useRef<HTMLInputElement>(null);
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const { user, setUser } = useUser();

  const [username, setUsername] = useState('');
  const [email, setemail] = useState(user?.email);
  const [tempUsername, setTempUsername] = useState('');
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPassword, setTempPassword] = useState('');
  const [editingField, setEditingField] = useState<"username" | "email" | "password" | null>(null);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [pendingField, setPendingField] = useState<"username" | "email" | "password" | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter()

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
      setTempUsername(user.username);
    }
  }, [user]);

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
          toast.success(response.data.message);
        }
      }

      if (pendingField === 'email') {
        response = await api.patch(`${process.env.NEXT_PUBLIC_Backend_Url}/user/update-email`, {
          newemail: tempEmail,
          currPassword: confirmPassword,
        });
        if (response.status === 200) {
          setemail(tempEmail);
          toast.success(response.data.message);
        }
      }

      if (pendingField === 'password') {
        response = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/update-password`, {
          newPassword: tempPassword,
          oldPassword: confirmPassword,
        });
        if (response.status === 200) {
          toast.success(response.data.message);
        }
      }

      setEditingField(null);
      setShowPasswordConfirm(false);
      setConfirmPassword('');
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage || "Update failed")
    }
  };

  const handleLogout = async () => {
    try {
      const response = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/logout`, {})
      if (response.status === 200) {
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
    <div className="space-y-8">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {username}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{email}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 dark:text-green-400">Active Account</span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <label className="font-medium text-gray-900 dark:text-white">Username</label>
                </div>
                {!editingField && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit("username")}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              
              {editingField === 'username' ? (
                <div className="space-y-4">
                  <Input
                    ref={inputUsernameRef}
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    className="text-lg"
                    placeholder="Enter new username"
                  />
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleSaveWithConfirmation("username")} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">{username}</p>
              )}
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <label className="font-medium text-gray-900 dark:text-white">Email Address</label>
                </div>
                {!editingField && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit("email")}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              
              {editingField === 'email' ? (
                <div className="space-y-4">
                  <Input
                    ref={inputEmailRef}
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="text-lg"
                    placeholder="Enter new email"
                  />
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleSaveWithConfirmation("email")} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-lg text-gray-700 dark:text-gray-300">{email}</p>
              )}
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-500" />
                  <label className="font-medium text-gray-900 dark:text-white">Password</label>
                </div>
                {!editingField && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit("password")}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Change
                  </Button>
                )}
              </div>
              
              {editingField === 'password' ? (
                <div className="space-y-4">
                  <Input
                    ref={inputPasswordRef}
                    type="password"
                    placeholder="Enter new password"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="text-lg"
                  />
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleSaveWithConfirmation("password")} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-lg text-gray-700 dark:text-gray-300">••••••••••••</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Language</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred language</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span>English (US)</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark/light theme</p>
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
            <AutoSave />
          </div>
        </CardContent>
      </Card>
      <div className="lg:hidden">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
      <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
        <Account_Delete />
      </div>
{showPasswordConfirm && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
    <Dialog open={showPasswordConfirm} onOpenChange={setShowPasswordConfirm}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Your Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please enter your current password to confirm this change.
          </p>
          <Input
            type="password"
            placeholder="Enter current password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={cancelConfirmation}>
              Cancel
            </Button>
            <Button onClick={confirmAndSave} className="bg-blue-600 hover:bg-blue-700">
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
)}

    </div>
  );
}

export default Account_Settings;
