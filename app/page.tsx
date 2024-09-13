import Container from "@/components/Container";
import PlayerList from "@/components/PlayerList";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-blue-200 w-full max-w-[400px] md:max-w-[800px] p-1 flex justify-between">
        <Link href={'/'}>Dream Team Selector</Link>
        <div className="text-[8px]">
          <div>Click Image Or Drag Name</div>
          <div>To Build 5-a-side Soccer Team</div>
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row justify-center items-center md:items-start">
        <Suspense>
          <Container />
        </Suspense>
      </div>
    </div>
  );
}
