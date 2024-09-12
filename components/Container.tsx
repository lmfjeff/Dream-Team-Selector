"use client";
import Image from "next/image";
import PlayerList from "./PlayerList";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import Field from "./Field";
import { useState } from "react";
import { countBy, maxBy } from "ramda";

export default function Container() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [squad, setSquad] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const fields = [
    { num: 4, limit: 2, name: "ST" },
    { num: 3, limit: 2, name: "MD" },
    { num: 2, limit: 2, name: "DF" },
    { num: 1, limit: 1, name: "GK" },
  ];
  function handleAddSquad(characterId: any, fieldId: any, character: any) {
    const numOfPlayerInField = squad.filter(
      (s) => s.fieldId === fieldId
    ).length;
    const countOfPlayerInFields = countBy((v) => v.fieldId, squad);
    const someFieldAlready2 =
      Object.values(countOfPlayerInFields).filter((v) => v === 2).length > 0;
    const alreadyChosen =
      squad.findIndex((s) => s.characterId === characterId) > -1;

    if (alreadyChosen) {
      alert("Duplicate");
    } else if (
      numOfPlayerInField >= (fields.find((f) => f.num === fieldId)?.limit || 0)
    ) {
      alert("Limit exceeded, please remove existing player first");
    } else if (someFieldAlready2 && numOfPlayerInField > 0) {
      alert("Each position need to have at least 1 player");
    } else {
      setSquad((v) => [
        ...v,
        {
          characterId,
          fieldId,
          character,
        },
      ]);
      setSelected(null);
    }
  }
  function handleDragStart(event: DragStartEvent) {
    setIsDragging(true);
  }
  function handleDragEnd(event: DragEndEvent) {
    setIsDragging(false);
    if (event?.over?.id) {
      handleAddSquad(
        event.active.id,
        event?.over?.id,
        characters.find((v) => v.id === event.active.id)
      );
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="flex flex-col items-center">
        {fields.map((f) => (
          <Field
            key={f.num}
            src={`/soccer-field-${f.num}.png`}
            num={f.num}
            limit={f.limit}
            name={f.name}
            squad={squad}
            handleAddSquad={handleAddSquad}
            setSquad={setSquad}
            isDragging={isDragging}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </div>
      <PlayerList
        squad={squad}
        characters={characters}
        setCharacters={setCharacters}
        selected={selected}
        setSelected={setSelected}
      />
    </DndContext>
  );
}
