import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import traditionals from '../../public/Reading list-bro.png'
import New from '../../public/Online report-bro.png'
import Image from 'next/image'
function ComparisonTable() {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl text-center ">
        Comparisons
      </h1>
      <section className="mt-3 px-4 sm:px-8 md:px-12 py-8">
  <div className="flex justify-center items-center w-full">
  <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl bg-off-white shadow-md border-2 border-gray-500 border-dotted rounded-md p-4">
  <div className="hidden md:block absolute top-6 bottom-6  left-1/2 -translate-x-1/2 w-1 border-l-2 border-dotted border-orange-500"></div>
  <div className="p-2">
    <Card className="h-full  ">
      <CardTitle className="text-center">Traditional</CardTitle>
      <CardContent className="flex flex-col sm:flex-row items-center gap-4">
        <Image
          className="h-[25vh] w-[35vh] rounded-lg object-cover"
          src={traditionals}
          alt="Document Image"
          layout="intrinsic"
        />
    <ul className="font-semibold list-disc pl-5 space-y-2">
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
    <Card className="h-full  ">
      <CardTitle className="text-center">NyayNetra</CardTitle>
      <CardContent className="flex flex-col sm:flex-row items-center gap-4">
        <Image
          className="h-[25vh] w-[30vh] rounded-lg object-cover"
          src={New}
          alt="Document Image"
          layout="intrinsic"
        />
       <ul className="font-semibold list-disc pl-5 space-y-2">
  <li>Delivers faster outcomes, giving people their lives back sooner</li>
  <li>Lightens the load on the system, enabling smoother justice for all</li>
  <li>Makes legal help accessible to everyone, not just the wealthy</li>
  <li>AI-powered accuracy reduces the chances of life-altering mistakes</li>
  <li>Breaks cost barriers — empowering people to fight for their rights</li>
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


