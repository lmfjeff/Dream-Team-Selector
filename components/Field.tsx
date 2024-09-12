import Image from "next/image";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/utils/tw";

export default function Field({ src, num, squad, setSquad, isDragging, selected, setSelected }: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: num,
  });

  return (
    <div className="relative border-collapse">
      <Image src={src} alt="" width={400} height={400} ref={setNodeRef} />
      <div
        className={cn("absolute top-0 left-0 bottom-0 right-0 flex", {
          "border border-red-500": isDragging || !!selected,
          "bg-[#00800080]": isOver,
        })}
        onClick={() => {
          if (selected) {
            setSquad((v: any) => [
              ...v,
              {
                characterId: selected.id,
                fieldId: num,
                character: selected,
              },
            ]);
            setSelected(null)
          }
        }}
      >
        {squad
          .filter((sq: any) => sq.fieldId === num)
          .map((sq: any) => (
            <div key={sq.characterId}>
              {sq.character.thumbnail.path.includes("image_not_available") ? (
                <div className="border rounded-full size-[100px] flex justify-center items-center">
                  <div className="text-sm text-center">{sq.character.name}</div>
                </div>
              ) : (
                <img
                  src={`${sq.character.thumbnail.path}.${sq.character.thumbnail.extension}`}
                  className="border rounded-full size-[100px]"
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
