"use client";
import Image from "next/image";
import PlayerList from "./PlayerList";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Field from "./Field";
import { useState } from "react";

export default function Container() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [squad, setSquad] = useState<any[]>([]);
  function handleDragEnd(event: DragEndEvent) {
    if (event?.over?.id) {
      setSquad((v) => [
        ...v,
        {
          characterId: event.active.id,
          fieldId: event?.over?.id,
          character: characters.find((v) => v.id === event.active.id),
        },
      ]);
    }
  }
  // 1 gk, 2 df, 3 mf, 4 at
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col items-center">
        {[4, 3, 2, 1].map((s) => (
          <Field key={s} src={`/soccer-field-${s}.png`} num={s} squad={squad} />
        ))}
      </div>
      <PlayerList characters={characters} setCharacters={setCharacters} />
    </DndContext>
  );
}
