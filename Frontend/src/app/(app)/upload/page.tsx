'use client'
import { useUser } from '../../../context/UserContext'; 
import { useCallback, useEffect, useState } from 'react';
import photo from '../../../../public/Upload-pana.png';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, X, FileText, Shield, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form"
import { toast } from 'sonner';
import { useRouter } from "next/navigation"
import traditionals from '../../../../public/Questions-rafiki.png'
import New from '../../../../public/Mention-bro.png'
import api from '@/lib/api';
import { AxiosError } from 'axios';
import guestApi from '@/lib/guestapi';

interface UploadFormData {
  file: FileList;
  public: boolean;
}

interface ErrorResponse {
  message: string;
}

const ClientComponent = () => {
  const { user } = useUser();  
  const [isClient, setIsClient] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit } = useForm<UploadFormData>();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); 
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
    },
  });

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    ); 
  }

  const onSubmit = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('document', selectedFile);
    
    try {
      const route = user ? '/document/upload' : '/document/guest/upload';
      const apiInstance = user ? api : guestApi;
      const response = await apiInstance.post(route, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    
      const { _id } = response.data.data;
      if (response.status === 200) {
        router.push(`/analysis/${_id}`);
        toast.success(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage || 'Upload failed');
    } finally {
      setIsSubmitting(false);
      setSelectedFile(null);
    }
  };

  return (
    <main className='min-h-screen w-full bg-gray-50 dark:bg-gray-900'>
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Upload Your Legal Files and Let Us Help You Make{' '}
              <span className='bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent'>
                Informed Decisions
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              AI-powered legal document analysis that empowers better decision-making
            </p>
          </div>
          {!user && (
            <div className="mt-8 max-w-4xl mx-auto">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                  <span className="text-amber-700 dark:text-amber-300 font-medium">
                    ⚠️ You are uploading as a guest
                  </span>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Button
                      onClick={() => router.push('/register')}        
                      size="sm"
                      className='bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600'
                    >
                      Sign Up for Full Features
                    </Button>
                    <a
                      href="#comparisons"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
                    >
                      See Feature Comparison
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16'>
          <div className='order-2 lg:order-1'>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Upload Document
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Maximum file size: 10MB • Supports PDF, DOC, DOCX, Images
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <Card className='border-2 border-dashed border-blue-300 hover:border-blue-400 transition-all duration-300 bg-white dark:bg-gray-800'>
                  <CardContent className='p-6'>
                    <div 
                      className={`p-8 rounded-xl transition-all duration-300 cursor-pointer ${
                        isDragActive 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-400' 
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600'
                      }`}
                      {...getRootProps()}
                    >
                      <Input {...getInputProps()} className="hidden" />
                      
                      <div className="text-center">
                        <Upload 
                          className={`mx-auto mb-4 ${
                            isDragActive ? 'text-blue-500' : 'text-gray-400'
                          }`} 
                          size={48}
                        />
                        
                        {isDragActive ? (
                          <p className="text-lg font-medium text-blue-600">
                            Drop the file here...
                          </p>
                        ) : selectedFile ? (
                          <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span 
                            className="font-medium text-green-700 dark:text-green-300 text-sm flex-1 min-w-0 truncate"
                            title={selectedFile.name}
                          >
                         {selectedFile.name}
                          </span>
                       <button
                       type="button"
                       onClick={(e) => {
                       e.stopPropagation();
                       setSelectedFile(null);
                       }}
                       className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0 p-1"
                      >
                       <X className="w-4 h-4" />
                      </button>
                      </div>
                    </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                              Drag & drop your file here, or{' '}
                              <span className="text-blue-600 font-medium">browse</span>
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              PDF, DOC, DOCX, PNG, JPG files supported
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="mt-6">
                  <Button 
                    type="submit"
                    disabled={isSubmitting || !selectedFile}
                    size="lg"
                    className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50'
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                        Analyzing Document...
                      </>
                    ) : (
                      <>
                        Upload & Analyze
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <Clock className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Instant Analysis
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <Shield className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    100% Secure
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <FileText className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    AI-Powered
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
                <Image
                  src={photo}
                  alt="Upload Illustration"
                  className="w-full h-auto max-w-md mx-auto"
                  width={400}
                  height={300}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
        {!user && (
          <div id="comparisons" className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Guest vs Registered User
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                See what you unlock with a free account
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="relative overflow-hidden border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                    LIMITED
                  </span>
                </div>
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-orange-600">
                    Guest User
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="flex justify-center">
                    <Image
                      className="h-40 w-auto rounded-xl object-contain"
                      src={traditionals}
                      alt="Guest Features"
                      width={200}
                      height={160}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <span className="text-orange-500 mt-1 text-lg">•</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Basic AI analysis with limited features
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <span className="text-orange-500 mt-1 text-lg">•</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Cannot save or track document analysis
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <span className="text-orange-500 mt-1 text-lg">•</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Limited daily uploads and processing
                      </span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button
                    onClick={() => router.push('/register')}
                    className='w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600'
                  >
                    Upgrade to Full Access
                  </Button>
                </CardFooter>
              </Card>
              <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold rounded-full">
                    PREMIUM
                  </span>
                </div>
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    Registered User
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="flex justify-center">
                    <Image
                      className="h-40 w-auto rounded-xl object-contain"
                      src={New}
                      alt="Premium Features"
                      width={200}
                      height={160}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Advanced AI:</strong> Personalized, in-depth legal analysis
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Save & Track:</strong> Access all past document analyses
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Unlimited:</strong> No restrictions on uploads or features
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ClientComponent;
