import { cn } from "@/utils/tw";
import { useDraggable } from "@dnd-kit/core";

export default function CharacterImage({
  disabled,
  character,
  selected,
  setSelected,
}: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: character.id,
    disabled,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style}>
      <img
        src={`${character.thumbnail.path.replace("http", "https")}.${
          character.thumbnail.extension
        }`}
        className={cn("shadow-lg rounded-full size-[80px] cursor-pointer", {
          "outline outline-green-500 outline-2": selected?.id === character.id,
          "opacity-50": disabled,
        })}
        onClick={() => {
          if (!disabled) {
            if (selected?.id === character.id) {
              setSelected(null);
            } else {
              setSelected(character);
            }
          }
        }}
      />
      <div
        className="bg-yellow-500 w-[70px] h-[30px] text-[10px] cursor-grab rounded-md flex justify-center items-center text-center"
        {...listeners}
        {...attributes}
      >
        <div className="line-clamp-2">{character.name}</div>
      </div>
    </div>
  );
}
