import type { ICharacter } from "../types/character";
import { LOCAL_STORAGE_PREFIX } from "../constant.ts";

export const saveCharacter = (id: string, character: ICharacter) => {
  localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${id}`, JSON.stringify(character));
};

export const loadCharacter = (id: string): ICharacter | null => {
  const item = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${id}`);
  return item ? JSON.parse(item) : null;
};
