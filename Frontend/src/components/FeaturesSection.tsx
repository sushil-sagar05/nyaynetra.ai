'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Zap, ShieldCheck, BarChart } from 'lucide-react';

function FeaturesSection() {
  return (
    <section className="p-4">
      <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl text-center">
        Features
      </h1>
      <div className="grid sm:grid-cols-12 gap-16 mt-8">
        <div className="sm:col-span-4 p-[2px] rounded-lg bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-600 hover:p-2">
          <Card className="rounded-lg flex flex-col justify-center h-full">
            <CardContent className="flex justify-center items-center py-6">
              <Zap color="#FF8C42" size={100} />
            </CardContent>
            <CardHeader className="text-center space-y-2">
              <CardTitle>Fast Processing</CardTitle>
              <h2 className="font-bold text-[#FF8C42]">
                Get results in seconds, not hours.
              </h2>
              <CardDescription>
                Our AI engine swiftly analyzes complex legal documents, helping you save precious time and speed up decision-making.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="sm:col-span-4 p-[2px] rounded-lg bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-600 hover:p-2">
          <Card className="rounded-lg flex flex-col justify-center h-full">
            <CardContent className="flex justify-center items-center py-6">
              <BarChart color="#FF8C42" size={100} />
            </CardContent>
            <CardHeader className="text-center space-y-2">
              <CardTitle>Accurate Insights</CardTitle>
              <h2 className="font-bold text-[#FF8C42]">
                Pinpoint the details that matter.
              </h2>
              <CardDescription>
                We deliver precise risk flags, hidden clauses, and compliance issues — so you can act confidently without missing anything important.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="sm:col-span-4 p-[2px] rounded-lg bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-600 hover:p-2 ">
          <Card className="rounded-lg flex flex-col justify-center h-full">
            <CardContent className="flex justify-center items-center py-6">
              <ShieldCheck color="#FF8C42" size={100} />
            </CardContent>
            <CardHeader className="text-center space-y-2">
              <CardTitle>Private and Secure</CardTitle>
              <h2 className="font-bold text-[#FF8C42]">
                Your data stays yours, always.
              </h2>
              <CardDescription>
                End-to-end analysis highlights key risk indicators, hidden clauses, and compliance gaps — empowering you to make confident decisions without exposing sensitive data.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
