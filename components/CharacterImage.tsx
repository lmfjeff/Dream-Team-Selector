import { cn } from "@/utils/tw";
import { useDraggable } from "@dnd-kit/core";

export default function CharacterImage({
  character,
  selected,
  setSelected,
}: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: character.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style}>
      <img
        src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
        className={cn("shadow-lg rounded-full size-[100px] cursor-pointer", {
          "outline outline-green-500 outline-2": selected?.id === character.id,
        })}
        onClick={() => setSelected(character)}
      />
      <div
        className="bg-yellow-500 w-[90px] line-clamp-1 text-center text-xs cursor-grab rounded-md"
        {...listeners}
        {...attributes}
      >
        {character.name}
      </div>
    </div>
  );
}
