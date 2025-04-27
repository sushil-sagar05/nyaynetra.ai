'use client'
import { useUser } from '../../../context/UserContext'; 
import { useCallback, useEffect, useState } from 'react';
import photo from '../../../../public/Upload-pana.png';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import { Loader2, Upload,X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form"
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from "next/navigation"
import traditionals from '../../../../public/Questions-rafiki.png'
import New from '../../../../public/Mention-bro.png'
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
     
      const {_id} = response.data.data
      if(response.status===200)
      {
      router.push(`/analysis/${_id}`)
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
      <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl pl-6 p-4 text-black" >Upload Your Legal Files and Let Us Help You Make <span className='text-orange-500'>Informed Decisions</span></h1>
      <h3 className="scroll-m-20 text-xl font-md tracking-tight pt-1 text-black pl-6">Focuses on empowerment and helping users make better legal decisions. </h3>
      {
        user?"":<h3 className="scroll-m-20 text-xl font-bold tracking-tight pt-1 text-red-600 pl-6">You are uploading as a guest...<Button   
        onClick={()=>router.push('/register')}        
          className=' bg-orange-500 text-white m-2'>Sign In</Button>
      </h3>

      }
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
        <div className='  '>
             <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl text-center text-black">
        Comparisons
      </h1>
            <section className="mt-3 px-4 sm:px-8 md:px-16 py-8">
  <div className="flex justify-center items-center w-full">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl bg-white shadow-md border-2 border-gray-500 border-dotted rounded-md p-4 sm:p-8">
      <div className="p-4">
        <Card className="h-full bg-[#f8f7f5] text-black">
          <CardTitle className="text-center">Guest User</CardTitle>
          <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <Image
              className="h-[25vh] w-[35vh] rounded-lg object-cover"
              src={traditionals}
              alt="Document Image"
              layout="intrinsic"
            />
            <ul className="font-semibold list-disc pl-5 space-y-2">
              <li> AI Responses: Receives basic, generic legal advice with no personalization.</li>
              <li>Rate Limits: Restricted to a limited number of queries per day.</li>
              <li>Save & Track: Cannot save or track past queries or responses.</li>
            </ul>
          </CardContent>
          <CardFooter>
          <Button   
            onClick={()=>router.push('/register')}        
              className=' bg-[#1338BE] text-white'>Sign In</Button>
          </CardFooter>
        </Card>
      </div>
      <div className="p-4">
        <Card className="h-full bg-[#f8f7f5] text-black">
          <CardTitle className="text-center">Register User</CardTitle>
          <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <Image
              className="h-[25vh] w-[30vh] rounded-lg object-cover"
              src={New}
              alt="Document Image"
              layout="intrinsic"
            />
            <ul className="font-semibold list-disc pl-5 space-y-2">
              <li>AI Responses: Receives personalized, in-depth legal advice tailored to their profile.</li>
              <li>Rate Limits: Can ask unlimited questions and get follow-up answers.</li>
              <li>Save & Track: Can save and revisit all past interactions with the AI</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
    </div>
  </div>
</section>
        
        </div>
        )}
      </div>
  );
};

export default ClientComponent;


