import { useDraggable } from "@dnd-kit/core";

export default function CharacterImage({ character }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: character.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {character.thumbnail.path.includes("image_not_available") ? (
        <div className="border rounded-full size-[100px] flex justify-center items-center">
          <div className="text-sm text-center">{character.name}</div>
        </div>
      ) : (
        <img
          src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
          className="border rounded-full size-[100px]"
        />
      )}
    </div>
  );
}
