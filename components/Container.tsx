"use client";
import Image from "next/image";
import PlayerList from "./PlayerList";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import Field from "./Field";
import { useEffect, useMemo, useState } from "react";
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
  const [toast, setToast] = useState("");
  const fields = [
    { num: 4, limit: 2, name: "ST" },
    { num: 3, limit: 2, name: "MD" },
    { num: 2, limit: 2, name: "DF" },
    { num: 1, limit: 1, name: "GK" },
  ];
  const isFullTeam = useMemo(() => squad.length === 5, [squad]);

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

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        setToast("");
      }, 3000);
    }
  }, [toast]);

  function shareOnFacebook() {
    if (!isFullTeam) {
      alert("Please Form a Team of 5 before sharing");
      return;
    }
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

  function shareByLink() {
    if (!isFullTeam) {
      alert("Please Form a Team of 5 before sharing");
      return;
    }
    const formationString = [
      ...squad.map((s) => s.characterId),
      ...squad.map((s) => s.fieldId),
    ].join(",");
    const shareLink = window.location.origin + "/?formation=" + formationString;
    navigator.clipboard.writeText(shareLink);
    setToast("copied!");
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
      {toast && (
        <div className="absolute top-[50px] left-1/2 bg-blue-500 text-lg text-white rounded-lg w-[100px] text-center">
          {toast}
        </div>
      )}
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
        <div className="w-full text-center flex gap-4 border">
          <div>Share: </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            width="50px"
            height="50px"
            className={cn("size-[25px] fill-gray-500 cursor-not-allowed", {
              "fill-blue-500 cursor-pointer": isFullTeam,
            })}
            onClick={() => shareOnFacebook()}
          >
            <path d="M 40 0 C 34.535156 0 30.078125 4.398438 30 9.84375 C 30 9.894531 30 9.949219 30 10 C 30 13.6875 31.996094 16.890625 34.96875 18.625 C 36.445313 19.488281 38.167969 20 40 20 C 45.515625 20 50 15.515625 50 10 C 50 4.484375 45.515625 0 40 0 Z M 28.0625 10.84375 L 17.84375 15.96875 C 20.222656 18.03125 21.785156 21 21.96875 24.34375 L 32.3125 19.15625 C 29.898438 17.128906 28.300781 14.175781 28.0625 10.84375 Z M 10 15 C 4.484375 15 0 19.484375 0 25 C 0 30.515625 4.484375 35 10 35 C 12.050781 35 13.941406 34.375 15.53125 33.3125 C 18.214844 31.519531 20 28.472656 20 25 C 20 21.410156 18.089844 18.265625 15.25 16.5 C 13.71875 15.546875 11.929688 15 10 15 Z M 21.96875 25.65625 C 21.785156 28.996094 20.25 31.996094 17.875 34.0625 L 28.0625 39.15625 C 28.300781 35.824219 29.871094 32.875 32.28125 30.84375 Z M 40 30 C 37.9375 30 36.03125 30.644531 34.4375 31.71875 C 31.769531 33.515625 30 36.542969 30 40 C 30 40.015625 30 40.015625 30 40.03125 C 29.957031 40.035156 29.917969 40.058594 29.875 40.0625 L 30 40.125 C 30.066406 45.582031 34.527344 50 40 50 C 45.515625 50 50 45.515625 50 40 C 50 34.484375 45.515625 30 40 30 Z" />
          </svg>
          <svg
            width="800px"
            height="800px"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("size-[25px] fill-gray-500 cursor-not-allowed", {
              "fill-blue-500 cursor-pointer": isFullTeam,
            })}
            onClick={() => shareByLink()}
          >
            <path d="M7.05025 1.53553C8.03344 0.552348 9.36692 0 10.7574 0C13.6528 0 16 2.34721 16 5.24264C16 6.63308 15.4477 7.96656 14.4645 8.94975L12.4142 11L11 9.58579L13.0503 7.53553C13.6584 6.92742 14 6.10264 14 5.24264C14 3.45178 12.5482 2 10.7574 2C9.89736 2 9.07258 2.34163 8.46447 2.94975L6.41421 5L5 3.58579L7.05025 1.53553Z" />
            <path d="M7.53553 13.0503L9.58579 11L11 12.4142L8.94975 14.4645C7.96656 15.4477 6.63308 16 5.24264 16C2.34721 16 0 13.6528 0 10.7574C0 9.36693 0.552347 8.03344 1.53553 7.05025L3.58579 5L5 6.41421L2.94975 8.46447C2.34163 9.07258 2 9.89736 2 10.7574C2 12.5482 3.45178 14 5.24264 14C6.10264 14 6.92742 13.6584 7.53553 13.0503Z" />
            <path d="M5.70711 11.7071L11.7071 5.70711L10.2929 4.29289L4.29289 10.2929L5.70711 11.7071Z" />
          </svg>
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
