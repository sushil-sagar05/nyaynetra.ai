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

const features = [
  {
    icon: <Zap size={48} className="text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-700" />,
    title: "Lightning Fast Processing",
    subtitle: "Results in seconds, not hours",
    description: "Our advanced AI engine swiftly analyzes complex legal documents, helping you save precious time and accelerate decision-making processes.",
  },
  {
    icon: <BarChart size={48} className="text-green-600 transition-all duration-300 group-hover:scale-110 group-hover:text-green-700" />,
    title: "Precise Insights",
    subtitle: "Pinpoint what matters most",
    description: "Deliver accurate risk flags, uncover hidden clauses, and identify compliance issues with confidence — never miss critical details again.",
  },
  {
    icon: <ShieldCheck size={48} className="text-purple-600 transition-all duration-300 group-hover:scale-110 group-hover:text-purple-700" />,
    title: "Enterprise Security",
    subtitle: "Your data stays protected",
    description: "End-to-end encryption ensures your sensitive legal documents remain private while our AI provides comprehensive analysis and insights.",
  },
];

function FeaturesSection() {
  return (
    <section className="px-4 py-16 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Why Choose Our Platform
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover how our AI-powered legal document analysis transforms your workflow with cutting-edge technology
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {features.map((feature, idx) => (
          <div
            key={`feature-${idx}`}
            className="group relative"
          >
            <Card className="h-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="pt-8 pb-4">
                <div className="flex justify-center items-center mb-6">
                  <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl group-hover:bg-gray-100 dark:group-hover:bg-slate-700 transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
              </CardContent>
              <CardHeader className="text-center px-6 pb-8">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </CardTitle>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-orange-500 text-sm font-medium rounded-full">
                    {feature.subtitle}
                  </span>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;
