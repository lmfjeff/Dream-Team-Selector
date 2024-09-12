import Container from "@/components/Container";
import PlayerList from "@/components/PlayerList";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-blue-200 w-full max-w-[400px] md:max-w-[800px] p-1 flex justify-between">
        <div>Dream Team Selector</div>
        <div className="text-[8px]">
          <div>Click on Hero images OR</div>
          <div>Drag N Drop Name to build your dream team</div>
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row justify-center items-center md:items-start">
        <Container />
      </div>
    </div>
  );
}
