'use client';

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ChevronRight, Pencil, User } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from './ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axios from 'axios';
import { toast, useSonner } from "sonner"
import Account_Delete from './Account_Delete'
import AutoSave from './AutoSave';
function Account_Settings() {
  const inputUsernameRef = useRef<HTMLInputElement>(null);
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState('sagar');
  const [email, setemail] = useState('sagar@sagar.com');
  const [password, setPassword] = useState('password123');
  const [tempUsername, setTempUsername] = useState(username);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPassword, setTempPassword] = useState('');
  const [editingField, setEditingField] = useState<"username" | "email" | "password" | null>(null);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [pendingField, setPendingField] = useState<"username" | "email" | "password" | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');

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


  

  const confirmAndSave = async() => {
    if (confirmPassword.length < 1) return;

   try {
    const token = localStorage.getItem('token');
    if(pendingField==='username'){
       const response = await axios.patch(`${process.env.NEXT_PUBLIC_Backend_Url}/user/update-username`,
        {
            newUsername:tempUsername,
            currPassword:confirmPassword
        },
           { headers: {
              Authorization: `Bearer ${token}`,
            }}
       )
      if(response.status===200){
        setUsername(tempUsername)
        toast(response.data.message)
      }
    }
    if(pendingField==='email'){
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_Backend_Url}/user/update-email`,
            {
                newemail:tempEmail,
                currPassword:confirmPassword
            },
               { headers: {
                  Authorization: `Bearer ${token}`,
                }}
           )
          if(response.status===200){
            setemail(tempEmail)
            toast(response.data.message)
          }
    }
    if(pendingField==='password'){
        const response = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/update-password`,
            {
                newPassword:tempPassword,
                oldPassword:confirmPassword
            },
               { headers: {
                  Authorization: `Bearer ${token}`,
                }}
           )
          if(response.status===200){
            setPassword(tempPassword)
            toast(response.data.message)
          }
    }
    setEditingField(null);
    setShowPasswordConfirm(false);
    setConfirmPassword('');
   } catch (error) {
    
   }


  };

  const cancelConfirmation = () => {
    setShowPasswordConfirm(false);
    setConfirmPassword('');
  };



  return (
    <div className="card p-8 w-[75vw]">
      <div className="inner p-6 h-full w-[35vw]">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <Card className="bg-white text-black">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex gap-4 items-center">
                    <User size={40} className="border-2 rounded-full" />
                    <div>
                      <p className="font-bold">{username}</p>
                      <p className="text-sm text-muted">{email}</p>
                    </div>
                  </div>
                  <ChevronRight />
                </CardContent>
              </Card>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 mt-4">
              <Card className="p-4 bg-white border-dotted border-2 border-black text-black">
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
              <Card className="p-4 bg-white border-dotted border-2 border-black text-black">
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
                    <p className="">{email}</p>
                    <Pencil size={16} className="cursor-pointer" onClick={() => handleEdit("email")} />
                  </div>
                )}
              </Card>
              <Card className="p-4 bg-white border-dotted border-2 border-black text-black">
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
                    <p className="">••••••••</p>
                    <Pencil size={16} className="cursor-pointer" onClick={() => handleEdit("password")} />
                  </div>
                )}
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <h3 className="text-xl font-semibold tracking-tight pt-4">Appearance</h3>
        <div className="card1  mt-2 ">
                    <Card className='h-full  flex justify-center bg-white text-black '>
                    <CardContent className='flex gap-8' >
                     <div className='w-full flex gap-8 '>
                       <span >
                        <p className='font-bold'>English (en)</p>
                       </span>
                       </div>
                      <div>
                      <ChevronRight/>
                      </div>
                    </CardContent>
                    </Card>
                </div>
                <div className="card1 mt-2 ">
                    <Card className='h-full  flex justify-center bg-white text-black '>
                    <CardContent className='flex gap-8' >
                     <div className='w-full flex gap-8 '>
                       <span >
                        <p className='font-bold'>Dark Mode</p>
                       </span>
                       </div>
                      <div>
                      <Switch></Switch>
                      </div>
                    </CardContent>
                    </Card>
                    <AutoSave/>
                </div>
        <div className="mt-6">
          <Account_Delete />
        </div>
      </div>
      {showPasswordConfirm && (
        <div className="fixed inset-0 z-10 bg-opacity-100 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-[28vw] border-2 border-rounded border-black space-y-4">
            <h2 className="font-bold text-lg">Confirm your password</h2>
            <Input
              type="password"
              placeholder="Enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button 
              className=' cursor-pointer'
              variant="outline" onClick={cancelConfirmation}>Cancel</Button>
              <Button
              className='bg-blue-500 cursor-pointer'
              onClick={confirmAndSave}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account_Settings;
