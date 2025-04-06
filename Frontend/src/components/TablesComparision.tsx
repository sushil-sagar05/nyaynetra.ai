import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Clock,CheckCheck,IndianRupee,ShieldAlert,Cable } from "lucide-react";
function ComparisonTable ()  {
  return (
      <>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center text-black">
        Comparisions
      </h1>
    <section className='h-full flex justify-center items-center '>
      <div className="flex justify-center items-center h-[50vh] w-[75vw] mt-8 ">
      <div className='grid  h-full w-full    sm:grid-cols-6 gap-4 mt-8 '>
        <div className="sm:col-span-1 min-h-[20vh] ">
            <Card className="h-full bg-white text-black">
            <CardTitle className="text-center">
                Features
            </CardTitle>
            <CardHeader className="text-center"><span className="flex gap-2">Time Taken <Clock/></span></CardHeader>
            <CardHeader className="text-center"><span className="flex gap-2">Accuracy <CheckCheck/></span></CardHeader>
            <CardHeader className="text-center"><span className="flex gap-2">Cost <IndianRupee/></span></CardHeader>
            <CardHeader className="text-center"><span className="flex gap-2">Accessiblity <Cable/></span></CardHeader>
            <CardHeader className="text-center"><span className="flex gap-2">Security <ShieldAlert/></span></CardHeader>

            </Card>
        </div>
        <div className="sm:col-span-2 min-h-[20vh]  ">
        <Card className="h-full bg-white text-black">
            <CardTitle className="text-center">
                Traditional Legal Review
            </CardTitle>
            <CardHeader className="text-center">Days</CardHeader>
            <CardHeader className="text-center">Depends on User</CardHeader>
            <CardHeader className="text-center">High</CardHeader>
            <CardHeader className="text-center">Manual Access</CardHeader>
            <CardHeader className="text-center">Low/Depends on Storage</CardHeader>

            </Card>
        </div>
        <div className="sm:col-span-2 min-h-[20vh] ">
        <Card className="h-full bg-white text-black">
            <CardTitle className="text-center">
                Nyaynetra
            </CardTitle>
            <CardHeader className="text-center">Seconds</CardHeader>
            <CardHeader className="text-center">Ai powered consistent</CardHeader>
            <CardHeader className="text-center">free/low</CardHeader>
            <CardHeader className="text-center">Upload from anywhere</CardHeader>
            <CardHeader className="text-center">encrypted,cloud secure</CardHeader>

            </Card>
        </div>
      </div>
      </div>
    </section>
    </> 
  )
}

export default ComparisonTable;

