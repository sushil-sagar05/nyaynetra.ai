import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, CheckCheck, IndianRupee, ShieldAlert, Cable } from "lucide-react";

function ComparisonTable() {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center text-black">
        Comparisons
      </h1>
      <section className="h-full sm:flex justify-center items-center mt-8">
        <div className="flex justify-center items-center w-full sm:w-[80vw] mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 w-full">
            <div className="min-h-[25vh] flex flex-col justify-between bg-white text-black p-6 rounded-lg shadow-lg">
              <CardTitle className="text-center text-xl sm:text-2xl font-semibold">
                Features
              </CardTitle>
              <CardHeader className="text-center flex gap-2 items-center">
                Time Taken <Clock />
              </CardHeader>
              <CardHeader className="text-center flex gap-2 items-center">
                Accuracy <CheckCheck />
              </CardHeader>
              <CardHeader className="text-center flex gap-2 items-center">
                Cost <IndianRupee />
              </CardHeader>
              <CardHeader className="text-center flex gap-2 items-center">
                Accessibility <Cable />
              </CardHeader>
              <CardHeader className="text-center flex gap-2 items-center">
                Security <ShieldAlert />
              </CardHeader>
            </div>
            <div className="min-h-[25vh] flex flex-col justify-between bg-white text-black p-6 rounded-lg shadow-lg">
              <CardTitle className="text-center text-xl sm:text-2xl font-semibold">
                Traditional Legal Review
              </CardTitle>
              <CardHeader className="text-center">Days</CardHeader>
              <CardHeader className="text-center">Depends on User</CardHeader>
              <CardHeader className="text-center">High</CardHeader>
              <CardHeader className="text-center">Manual Access</CardHeader>
              <CardHeader className="text-center">Low/Depends on Storage</CardHeader>
            </div>
            <div className="min-h-[25vh] flex flex-col justify-between bg-white text-black p-6 rounded-lg shadow-lg">
              <CardTitle className="text-center text-xl sm:text-2xl font-semibold">
                Nyaynetra
              </CardTitle>
              <CardHeader className="text-center">Seconds</CardHeader>
              <CardHeader className="text-center">AI powered consistent</CardHeader>
              <CardHeader className="text-center">Free/Low</CardHeader>
              <CardHeader className="text-center">Upload from anywhere</CardHeader>
              <CardHeader className="text-center">Encrypted, Cloud Secure</CardHeader>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ComparisonTable;


