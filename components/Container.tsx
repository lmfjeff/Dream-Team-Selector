"use client";
import Image from "next/image";
import PlayerList from "./PlayerList";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import Field from "./Field";
import { useState } from "react";

export default function Container() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [squad, setSquad] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  function handleDragStart(event: DragStartEvent) {
    setIsDragging(true);
  }
  function handleDragEnd(event: DragEndEvent) {
    setIsDragging(false);
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
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="flex flex-col items-center">
        {[4, 3, 2, 1].map((s) => (
          <Field
            key={s}
            src={`/soccer-field-${s}.png`}
            num={s}
            squad={squad}
            setSquad={setSquad}
            isDragging={isDragging}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </div>
      <PlayerList
        characters={characters}
        setCharacters={setCharacters}
        selected={selected}
        setSelected={setSelected}
      />
    </DndContext>
  );
}
