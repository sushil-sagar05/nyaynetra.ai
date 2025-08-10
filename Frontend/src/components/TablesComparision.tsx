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
import { ArrowRight, Clock, Users, DollarSign, Shield, Zap } from 'lucide-react';

function ComparisonTable() {
  const { user } = useUser();
  const router = useRouter();
  
  const handleBtnClick = (route: string) => {
    router.push(route)
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Traditional vs Modern Approach
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            See how NyayNetra transforms the legal document analysis process
          </p>
        </div>
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
              VS
            </div>
          </div>
          <Card className="relative overflow-hidden border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                OLD WAY
              </span>
            </div>          
            <CardTitle className="text-center text-orange-600 font-bold text-2xl pt-6 pb-4">
              Traditional Method
            </CardTitle>          
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Image
                    className="h-48 w-64 rounded-xl object-cover shadow-md"
                    src={traditionals}
                    alt="Traditional Legal Process"
                    width={256}
                    height={192}
                  />
                  <div className="absolute inset-0 bg-orange-500/20 rounded-xl"></div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-4">
                  Current Challenges:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <Clock className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Justice delayed for months or years, leaving lives in limbo
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <Users className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Overburdened courts and staff, leading to burnout and backlog
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <DollarSign className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      High legal costs force people to give up before they begin
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <Shield className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Human errors and outdated systems can ruin innocent lives
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold rounded-full">
                NEW WAY
              </span>
            </div>
            <CardTitle className="text-center bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent font-bold text-2xl pt-6 pb-4">
              NyayNetra Solution
            </CardTitle>
            
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Image
                    className="h-48 w-64 rounded-xl object-cover shadow-md"
                    src={New}
                    alt="NyayNetra AI Solution"
                    width={256}
                    height={192}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl"></div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-4">
                  Our Advantages:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Instant Analysis:</strong> Delivers results in seconds, not months
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Accessible:</strong> Makes legal help available to everyone
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Cost-Effective:</strong> Breaks financial barriers to justice
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>AI-Powered:</strong> Reduces human errors with advanced technology
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="text-center">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Experience the Future?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Join thousands of legal professionals who have already transformed their workflow
            </p>
          </div>
          
          <Button
            onClick={() => handleBtnClick('upload')}
            size="lg"
            className='bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'
          >
            {user ? "Upload Document" : "Try NyayNetra Now"}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-500" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>No Setup Required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComparisonTable;
