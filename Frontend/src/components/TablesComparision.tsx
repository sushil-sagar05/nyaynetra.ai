import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, CheckCheck, IndianRupee, ShieldAlert, Cable } from "lucide-react";
import traditionals from '../../public/Reading list-bro.png'
import New from '../../public/Online report-bro.png'
import Image from 'next/image'
function ComparisonTable() {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center text-black">
        Comparisons
      </h1>
      <section className="mt-3 px-4 sm:px-8 md:px-16 py-8">
  <div className="flex justify-center items-center w-full">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl bg-white shadow-md border-2 border-gray-500 border-dotted rounded-md p-4 sm:p-8">
      <div className="p-4">
        <Card className="h-full">
          <CardTitle className="text-center">Traditional</CardTitle>
          <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <Image
              className="h-[25vh] w-[35vh] rounded-lg object-cover"
              src={traditionals}
              alt="Document Image"
              layout="intrinsic"
            />
            <ul className="font-semibold list-disc pl-5 space-y-2">
              <li>Manual Efforts</li>
              <li>Time Consuming</li>
              <li>Error Prone</li>
              <li>Costly</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="p-4">
        <Card className="h-full">
          <CardTitle className="text-center">NyayNetra</CardTitle>
          <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <Image
              className="h-[25vh] w-[30vh] rounded-lg object-cover"
              src={New}
              alt="Document Image"
              layout="intrinsic"
            />
            <ul className="font-semibold list-disc pl-5 space-y-2">
              <li>AI Powered Insights</li>
              <li>Time Efficient</li>
              <li>Fast Document Analysis</li>
              <li>Reduced Human Bias</li>
              <li>Free or Very Low Cost</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
    </div>
  </div>
</section>

    </>
  );
}

export default ComparisonTable;


