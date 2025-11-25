import type { ICharacter } from "../types/character";

export const saveCharacter = (id: string, character: ICharacter) => {
  localStorage.setItem(`character_${id}`, JSON.stringify(character));
};

export const loadCharacter = (id: string): ICharacter | null => {
  const item = localStorage.getItem(`character_${id}`);
  return item ? JSON.parse(item) : null;
};
