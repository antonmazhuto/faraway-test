import type { ICharacter } from "../../types/character.ts";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import { fetchCharacters } from "../../api/swapi.ts";

interface ICharactersResponse {
  results: ICharacter[];
  count: number;
  next: string | null;
  previous: string | null;
}

export const useCharactersQuery = (page: number, search: string) => {
  return useQuery<ICharactersResponse, Error>({
    queryKey: ["characters", page, search],
    queryFn: () => fetchCharacters(page, search),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};
