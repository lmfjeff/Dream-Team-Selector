import Image from "next/image";
import { useDroppable } from "@dnd-kit/core";

export default function Field({ src, num, squad }: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: num,
  });
  const style = {
    border: isOver ? "1px solid red" : undefined,
  };

  return (
    <div className="relative">
      <Image
        src={src}
        alt=""
        width={400}
        height={400}
        ref={setNodeRef}
        style={style}
      />
      <div className="absolute top-0 left-0 flex">
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
