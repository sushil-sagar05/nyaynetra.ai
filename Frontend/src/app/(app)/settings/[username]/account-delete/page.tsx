'use client';

import Image from 'next/image';
import account_delete from '../../../../../../public/account-delete.png'; 
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AccountDeletePage() {
  const router = useRouter();
  return (
    <section className="w-full min-h-[75vh] p-8 md:p-16 bg-[#f8f7f5] ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full rounded-lg overflow-hidden">
        <div className="flex flex-col justify-center  p-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            You’re about to close the door. <span className='text-orange-500'>Take a moment before you do</span>.
          </h2>
          <h3 className="text-xl md:text-2xl font-semibold">
            We’ll keep your data safe for the next 7 days in case you decide to return.
          </h3>
          <h4 className='mt-3 text-orange-500 text-lg'>You can reactivate your account by logging in again...</h4>
          <Button
                onClick={()=>router.push('/login')}
                className='m-4 w-36  bg-orange-500  text-lg hover:bg-orange-700 cursor-pointer border-1 border-black'>
                  LogIn Again
                </Button>
        </div>
        <div className=" relative h-64 md:h-auto">
          <Image
            src={account_delete}
            alt="Account Deletion Illustration"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
            priority
          />
        </div>
      </div>
    </section>
  );
}
