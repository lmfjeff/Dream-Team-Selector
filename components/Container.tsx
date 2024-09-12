"use client";
import Image from "next/image";
import PlayerList from "./PlayerList";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import Field from "./Field";
import { useEffect, useState } from "react";
import { countBy, maxBy } from "ramda";
import { cn } from "@/utils/tw";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Loading from "./Loading";

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

  const searchParams = useSearchParams();
  const formation = searchParams.get("formation");
  const formedSquad = formation
    ?.split(",")
    .slice(0, 5)
    .map((v) => Number(v));
  const position: any = formation
    ?.split(",")
    .slice(5, 10)
    .map((v) => Number(v));

  async function fetchSquadCharacters(squadList: any[]) {
    const squ = [];
    let i = 0;
    for (const char of squadList) {
      const resp = await axios.get(
        "https://gateway.marvel.com:443/v1/public/characters/" + char,
        {
          params: {
            apikey: process.env.NEXT_PUBLIC_MARVEL_PUBLIC_KEY,
          },
        }
      );
      const charactersData = resp.data.data;
      const { results } = charactersData;
      squ.push({
        character: results[0],
        characterId: results[0].id,
        fieldId: position[i],
      });
      i++;
    }
    setSquad(squ);
  }
  useEffect(() => {
    if (formation && formedSquad) {
      fetchSquadCharacters(formedSquad);
    }
  }, []);

  function shareOnFacebook() {
    const origin = window.location.origin.includes("localhost")
      ? "https://dream-team-selector.vercel.app"
      : window.location.origin;

    const formationString = [
      ...squad.map((s) => s.characterId),
      ...squad.map((s) => s.fieldId),
    ].join(",");
    const facebookIntentURL = "https://www.facebook.com/sharer/sharer.php";
    const contentQuery = `?u=${encodeURIComponent(
      origin + "/?formation=" + formationString
    )}`;
    const shareURL = facebookIntentURL + contentQuery;
    window.open(shareURL, "_blank");
  }
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
  if (formation && squad.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <div>Loading Formation</div>
        <Loading />
      </div>
    );
  }
  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="flex flex-col items-center">
        {fields.map((f) => (
          <Field
            readonly={!!formation}
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
        <div
          className={cn("bg-gray-500 cursor-not-allowed w-full text-center text-lg", {
            "bg-pink-200 cursor-pointer": squad.length === 5,
          })}
          onClick={() => {
            if (squad.length === 5) shareOnFacebook();
          }}
        >
          share
        </div>
      </div>
      {!formation && (
        <PlayerList
          squad={squad}
          characters={characters}
          setCharacters={setCharacters}
          selected={selected}
          setSelected={setSelected}
        />
      )}
    </DndContext>
  );
}
