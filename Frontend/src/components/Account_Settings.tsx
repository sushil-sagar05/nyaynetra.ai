'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Check, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  Save,
  UserCheck
} from 'lucide-react';

interface ErrorResponse {
  message: string;
}

function Account_Settings() {
  const { user, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {
      username: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    };

    let isValid = true;
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
        isValid = false;
      }
      
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters';
        isValid = false;
      }
      
      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = 'Passwords do not match';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }
    const hasProfileChanges = formData.username !== user?.username || formData.email !== user?.email;
    const hasPasswordChange = formData.newPassword.trim() !== '';

    if (!hasProfileChanges && !hasPasswordChange) {
      toast.info('No changes to save');
      setIsEditing(false);
      return;
    }
    setPendingChanges({ hasProfileChanges, hasPasswordChange });
    setShowPasswordConfirm(true);
  };

  const confirmAndSave = async () => {
    try {
      const updateData: any = {};
      
      if (pendingChanges?.hasProfileChanges) {
        updateData.username = formData.username;
        updateData.email = formData.email;
      }
      
      if (pendingChanges?.hasPasswordChange) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      updateData.confirmPassword = confirmPassword;

      const response = await api.put(`${process.env.NEXT_PUBLIC_Backend_Url}/user/update-profile`, updateData);
      
      if (response.status === 200) {
        if (pendingChanges?.hasProfileChanges) {
          setUser(prev => prev ? {
            ...prev,
            username: formData.username,
            email: formData.email
          } : null);
        }
        
        toast.success('Profile updated successfully');
        setIsEditing(false);
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }));
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to update profile');
    } finally {
      setShowPasswordConfirm(false);
      setConfirmPassword('');
      setPendingChanges(null);
    }
  };

  const cancelConfirmation = () => {
    setShowPasswordConfirm(false);
    setConfirmPassword('');
    setPendingChanges(null);
  };

  const cancelEdit = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setErrors({
      username: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center py-8">
            <div className="text-gray-400 text-2xl mb-4">👤</div>
            <p className="text-gray-600 dark:text-gray-400">Loading user information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Welcome, {user.username}!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your account information and preferences
                </p>
              </div>
              <div className="ml-auto">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  <UserCheck className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>Username: {user.username}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span>Email: {user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Member since: {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Profile Information
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update your personal information and account settings
                </p>
              </div>
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={cancelEdit}
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    disabled={!isEditing}
                    className={`pl-10 ${errors.username ? 'border-red-500' : ''} ${
                      !isEditing ? 'bg-gray-50 dark:bg-gray-800' : ''
                    }`}
                    placeholder="Enter your username"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.username}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''} ${
                      !isEditing ? 'bg-gray-50 dark:bg-gray-800' : ''
                    }`}
                    placeholder="Enter your email"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
            {isEditing && (
              <>
                <Separator />
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Change Password
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Leave blank if you don&apos;t want to change your password
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.currentPassword}
                          onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                          className={`pl-10 pr-10 ${errors.currentPassword ? 'border-red-500' : ''}`}
                          placeholder="Enter current password"
                        />
                        <Shield className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {errors.currentPassword}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={(e) => handleInputChange('newPassword', e.target.value)}
                          className={`pl-10 pr-10 ${errors.newPassword ? 'border-red-500' : ''}`}
                          placeholder="Enter new password"
                        />
                        <Shield className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      </div>
                      {errors.newPassword && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {errors.newPassword}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmNewPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmNewPassword}
                          onChange={(e) => handleInputChange('confirmNewPassword', e.target.value)}
                          className={`pl-10 pr-10 ${errors.confirmNewPassword ? 'border-red-500' : ''}`}
                          placeholder="Confirm new password"
                        />
                        <Shield className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmNewPassword && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {errors.confirmNewPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                    Security Notice
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Your current password is required to confirm any changes to your account. 
                    We use industry-standard encryption to protect your data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {showPasswordConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-600" />
                Confirm Your Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please enter your current password to confirm these changes.
              </p>
              <Input
                type="password"
                placeholder="Enter current password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full"
                onKeyDown={(e) => e.key === 'Enter' && confirmAndSave()}
              />
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={cancelConfirmation}>
                  Cancel
                </Button>
                <Button onClick={confirmAndSave} className="bg-blue-600 hover:bg-blue-700">
                  <Check className="w-4 h-4 mr-2" />
                  Confirm Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default Account_Settings;
