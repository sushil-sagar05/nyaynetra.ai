import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import traditionals from '../../public/Reading list-bro.png';
import New from '../../public/Online report-bro.png';
import Image from 'next/image';
import { Button } from "./ui/button";
import { useUser } from "@/context/UserContext";
import { useRouter } from 'next/navigation';

function ComparisonTable() {
     const { user} = useUser();
     const router = useRouter();
     const handleBtnClick = (route:string)=>{
          router.push(route)
        }
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl text-center mb-6">
        Comparisons
      </h1>
      <section className="mt-3  sm:px-8 md:px-12 py-8">
        <div className="flex justify-center items-center w-full">
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl bg-off-white shadow-md border-2 border-dotted border-gray-500 rounded-md ">
            <div className="hidden md:block absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-1 border-l-2 border-dotted border-[#4A4A4A]"></div>
            <div className="p-2">
              <Card className="h-full border border-orange-400">
                <CardTitle className="text-center text-orange-500 font-bold text-xl mt-4">Traditional</CardTitle>
                <CardContent className="flex flex-col sm:flex-row items-center gap-4">
                  <Image
                    className="h-[25vh] w-[35vh] rounded-lg object-cover"
                    src={traditionals}
                    alt="Traditional Image"
                    layout="intrinsic"
                  />
                  <ul className="font-semibold list-disc pl-5 space-y-2 ">
                    <li>Justice delayed for months or years, leaving lives in limbo</li>
                    <li>Overburdened courts and staff, leading to burnout and backlog</li>
                    <li>Inaccessible for the poor — justice often becomes a privilege</li>
                    <li>Human errors and outdated systems can ruin innocent lives</li>
                    <li>High legal costs force people to give up before they even begin</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="p-2">
              <Card className="h-full border border-purple-500">
                <CardTitle className="text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-400 font-bold text-xl mt-4">
                  NyayNetra
                </CardTitle>
                <CardContent className="flex flex-col sm:flex-row items-center gap-4">
                  <Image
                    className="h-[25vh] w-[30vh] rounded-lg object-cover"
                    src={New}
                    alt="NyayNetra Image"
                    layout="intrinsic"
                  />
                  <ul className="font-semibold list-disc pl-5 space-y-2 ">
                    <li>✅ Delivers faster outcomes, giving people their lives back sooner</li>
                    <li>✅ Lightens the load on the system, enabling smoother justice for all</li>
                    <li>✅ Makes legal help accessible to everyone, not just the wealthy</li>
                    <li>✅ AI-powered accuracy reduces the chances of life-altering mistakes</li>
                    <li>✅ Breaks cost barriers — empowering people to fight for their rights</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
  <div className="CTA mt-12  lg:w-[18vw] lg:h-[8vh]  ">
                <Button
                onClick={()=>handleBtnClick('upload')}
                className='mb-4 lg:h-full lg:w-full mr-4 bg-gradient-to-r from-purple-600 to-blue-500 cursor-pointer '>{
                  user?("Upload Document"):("Try Nyaynetra now")
                  
                }</Button>
            

            </div>
      </section>
    </>
  );
}

export default ComparisonTable;
