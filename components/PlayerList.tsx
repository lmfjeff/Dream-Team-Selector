"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function PlayerList() {
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
    async function fetchCharacters() {
      const resp = await axios.get(
        "https://gateway.marvel.com:443/v1/public/characters",
        {
          params: {
            apikey: process.env.NEXT_PUBLIC_MARVEL_PUBLIC_KEY,
          },
        }
      );
      const charactersData = resp.data.data;
      const { totals, results } = charactersData;
      setCharacters(results);
    }
    if (characters.length === 0) fetchCharacters();
  }, []);
  return (
    <div className="w-[400px] bg-gray-500">
      <div>player list</div>
      <div className="flex flex-wrap">
        {characters.map((c: any) => (
          <>
            {c.thumbnail.path.includes("image_not_available") ? (
              <div key={c.id} className="border rounded-full size-[100px] flex justify-center items-center">
                <div className="text-sm text-center">{c.name}</div>
              </div>
            ) : (
              <img
                key={c.id}
                src={`${c.thumbnail.path}.${c.thumbnail.extension}`}
                className="rounded-full size-[100px]"
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
}
