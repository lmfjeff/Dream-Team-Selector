import Image from "next/image";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/utils/tw";

export default function Field({
  readonly,
  src,
  num,
  limit,
  name,
  squad,
  handleAddSquad,
  setSquad,
  isDragging,
  selected,
  setSelected,
}: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: num,
  });

  return (
    <div className="relative border-collapse">
      {readonly && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-10"></div>
      )}
      <Image src={src} alt="" width={400} height={400} ref={setNodeRef} />
      <div className="absolute top-1/2 left-[15px] transform -translate-y-1/2 bg-red-500 p-1 text-white rounded-lg">
        {name}
      </div>
      <div
        className={cn(
          "absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center gap-2",
          {
            "border border-red-500": isDragging || !!selected,
            "bg-[#00800080]": isOver,
            "cursor-pointer hover:bg-[#00800080]": !!selected,
          }
        )}
        onClick={() => {
          if (selected) {
            handleAddSquad(selected.id, num, selected);
            setSelected(null);
          }
        }}
      >
        {squad
          .filter((sq: any) => sq.fieldId === num)
          .map((sq: any) => (
            <div key={sq.characterId} className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={`${sq.character.thumbnail.path.replace(
                    "http",
                    "https"
                  )}.${sq.character.thumbnail.extension}`}
                  className={cn(
                    "shadow-lg rounded-full size-[50px] cursor-pointer relative"
                  )}
                />
                <div
                  className={cn(
                    "absolute left-0 right-0 top-0 bottom-0 justify-center items-center flex",
                    "opacity-0 hover:opacity-100 cursor-pointer"
                  )}
                  onClick={() =>
                    setSquad((o: any) =>
                      o.filter(
                        (v: any) =>
                          v.fieldId !== sq.fieldId ||
                          v.characterId !== sq.characterId
                      )
                    )
                  }
                >
                  <div className="text-xl">❌</div>
                </div>
              </div>
              <div className="bg-yellow-500 w-[60px] line-clamp-1 text-center text-[8px] cursor-grab rounded-md">
                {sq.character.name}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
