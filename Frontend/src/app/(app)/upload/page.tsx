'use client'
import { useUser } from '../../../context/UserContext'; 
import { useCallback, useEffect, useState } from 'react';
import photo from '../../../../public/Upload-pana.png';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import { Loader2, Upload,X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form"
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from "next/navigation"
interface UploadFormData {
  file:FileList;
  public:boolean;
};
const ClientComponent = () => {
  const { user } = useUser();  
  const [isClient, setIsClient] = useState(false);
  const [SelectedFile, setSelectedFile] = useState<File|null>(null)
  const [isSubmitting, setisSubmitting] = useState(false)
  const {register,handleSubmit,setValue }=useForm<UploadFormData>();
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
    return <div>Loading...</div>; 
  }
    const onSubmit=async(data:UploadFormData)=>{
      if (!SelectedFile) {
        toast('Please select a file to upload.');
        return;
      }
      
      setisSubmitting(true);
      const formData = new FormData();
      formData.append('document', SelectedFile);
    try {
      const token = localStorage.getItem('token')
      const route = user?'/document/upload':'/document/guest/upload'
     const response = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Url}${route}`,formData,{
        headers:{
          ...(user  ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'multipart/form-data',
        },
      })
     
      const {filename} = response.data.data
      if(response.status===200)
      {
      router.push(`/analysis/${filename}`)
      toast.success(response.data.message);
      setisSubmitting(false)

    }
    } catch (error:any) {
      console.error('Error uploading file:', error);
      toast.error(error.response.data.error)
    }finally {
      setisSubmitting(false);
      setSelectedFile(null)
    }

    }

  return (
    <div className='h-full w-[100vw] bg-white'>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pl-6 p-4 text-black" >Upload Your Legal Files and Let Us Help You Make Informed Decisions</h1>
      <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-1 text-black pl-6">Focuses on empowerment and helping users make better legal decisions. </h3>
        <div className='grid grid-cols-12 sm:p-1 p-4 justify-center items-center '>
        <div className='col-span-11 sm:col-span-7  min-h-[40vh]  flex justify-center items-center '>
          <div className="inner  border-2 rounded-lg border-blue-500 border-dashed flex justify-center items-center">
            <>
           {
           <form onSubmit={handleSubmit(onSubmit)}
           >
            <Card className=' h-full w-full flex items-center justify-center bg-[#ff725e]'>
              <CardHeader className=' text-center w-full'>Upload Document</CardHeader>
              <CardContent className='space-y-4 '>
              <div className=' cursor-pointer text-center  bg-[#ff725e]'{...getRootProps()}>
              <Upload className=' w-full' color='#1338BE' size={75}/>
              <Input className='border-white  bg-blue-500  '{...getInputProps()}>
              </Input>
              {
              isDragActive ? (
               <p>Drop the files here ...</p>
                ) : SelectedFile ? (
                <>
            <div className='bg-white rounded-md h-[4vh] text-black'>
            <p className='flex justify-around'>Filename: {SelectedFile.name} <X
            onClick={()=>setSelectedFile(null)}
            /></p>
            </div>
            </>
          ) : (
           <p>Drag 'n' drop file here, or click to select files</p>
         )
          }

              </div>
              <div className="flex items-center justify-center space-x-2">
            <Button disabled={isSubmitting}
               className='mb-1  mr-4 bg-[#1338BE] text-white'>
                 {
            isSubmitting?<>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
            </>:("Upload Document")
          }
               </Button>
          </div>

              </CardContent>
            </Card>
           </form>
           }
            </>
          
          </div>
        </div>
        <div className="hidden sm:block col-span-5 min-h-[50vh]   ">
        <Image
          src={photo}
          alt="Upload Illustration"
          className="rounded-lg"
          width={500}
          height={300}
          objectFit="cover"
        />
        </div>

        </div>
       {user ===null && (
        <div className='h-[55vh] w-full  '>
            <h2 className='ml-6 font-bold text-black'>Comparisions</h2>
          <div className="inner ">
            <div className="cards grid grid-cols-12   p-3 ">
            <div className='col-span-3  min-h-[50vh]  flex justify-center items-center  '>
              <Card className='h-full w-full bg-white text-black'>
                <CardTitle className='text-center'>Guest</CardTitle>
                <CardContent className='text-sm space-y-2' >
                  <p >1. AI Responses: Receives basic, generic legal advice with no personalization.</p>
                  <p>2. Rate Limits: Restricted to a limited number of queries per day.</p>
                  <p>3. Save & Track: Cannot save or track past queries or responses.</p>
                  <p>4. Access to Resources: Can only access simple legal templates and basic information.</p>
                  <p>5. Download & Export: Cannot download or export generated legal content.</p>
                </CardContent>
              </Card>
            </div>
            <div className='col-span-3  min-h-[50vh]  flex justify-center items-center '>
            <Card className='h-full w-full bg-white text-black'>
                <CardTitle className='text-center'>Authenticated</CardTitle>
                <CardContent className='text-sm space-y-2'>
                  <p>1. AI Responses: Receives personalized, in-depth legal advice tailored to their profile.</p>
                  <p>2. Rate Limits: Can ask unlimited questions and get follow-up answers.</p>
                  <p>3. Save & Track: Can save and revisit all past interactions with the AI.</p>
                  <p>4. Access to Resources: Can access advanced, tailored legal documents and resources.</p>
                  <p>5. Download & Export: Can download and export customized legal documents and reports.</p>
                </CardContent>
              </Card>
            </div>
            </div>
          </div>
        
        </div>
        )}
      </div>
  );
};

export default ClientComponent;


