"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Loading from "./Loading";
import { useDebouncedCallback } from "use-debounce";
import CharacterImage from "./CharacterImage";

export default function PlayerList({
  squad,
  characters,
  setCharacters,
  selected,
  setSelected,
}: any) {
  const [paginationData, setPaginationData] = useState<any>({});
  const [fetching, setFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const totalPage = useMemo(
    () => Math.ceil(paginationData.total / paginationData.limit),
    [paginationData]
  );
  const currentPage = useMemo(
    () => paginationData.offset / paginationData.limit + 1,
    [paginationData]
  );
  const isFirstPage = useMemo(() => currentPage === 1, [currentPage]);
  const isLastPage = useMemo(
    () => currentPage === totalPage,
    [currentPage, totalPage]
  );

  const debounced = useDebouncedCallback((value) => {
    setSearchInput(value);
    setPage(1);
  }, 1000);

  async function fetchCharacters(searchInput: string, page: number) {
    setFetching(true);
    const resp = await axios.get(
      "https://gateway.marvel.com:443/v1/public/characters",
      {
        params: {
          apikey: process.env.NEXT_PUBLIC_MARVEL_PUBLIC_KEY,
          ...(searchInput ? { nameStartsWith: searchInput } : {}),
          ...(paginationData.limit
            ? { offset: (page - 1) * paginationData.limit }
            : {}),
        },
      }
    );
    setFetching(false);

    const charactersData = resp.data.data;
    const { total, offset, limit, count, results } = charactersData;
    setPaginationData({ total, offset, limit, count });
    setCharacters(results);
  }

  useEffect(() => {
    fetchCharacters(searchInput, page);
  }, [searchInput, page]);

  return (
    <div className="w-full max-w-[400px] bg-gray-500">
      <div className="flex justify-between">
        <input
          placeholder="search..."
          onChange={(e) => debounced(e.target.value)}
        />
        {characters.length > 0 && !fetching && (
          <div className="flex gap-2">
            {!isFirstPage && (
              <button onClick={() => setPage((v) => v - 1)}>◀</button>
            )}
            <div>
              Page {currentPage} / {totalPage}
            </div>
            {!isLastPage && (
              <button onClick={() => setPage((v) => v + 1)}>▶</button>
            )}
          </div>
        )}
      </div>
      {fetching ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-wrap">
          {characters.map((c: any) => {
            const disabled = squad
              .map((s: any) => s.characterId)
              .includes(c.id);
            return (
              <CharacterImage
                disabled={disabled}
                key={c.id}
                character={c}
                selected={selected}
                setSelected={setSelected}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
