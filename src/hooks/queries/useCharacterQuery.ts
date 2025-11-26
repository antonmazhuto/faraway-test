import { useQuery } from "@tanstack/react-query";
import type { ICharacter } from "../../types/character.ts";
import { fetchCharacter } from "../../api/swapi.ts";

export const useCharacterQuery = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery<ICharacter, Error>({
    queryKey: ["character", id],
    queryFn: () => fetchCharacter(id),
    enabled: options?.enabled,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 60 minutes
  });
};
