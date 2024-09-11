import PlayerList from "@/components/PlayerList";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row justify-center">
      <div className="flex flex-col items-center">
        <Image src="/soccer-field-4.png" alt="" width={400} height={400} />
        <Image src="/soccer-field-3.png" alt="" width={400} height={400} />
        <Image src="/soccer-field-2.png" alt="" width={400} height={400} />
        <Image src="/soccer-field-1.png" alt="" width={400} height={400} />
      </div>
      <PlayerList />
    </div>
  );
}
