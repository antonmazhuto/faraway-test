import type { ICharacter } from "../../types/character.ts";
import { loadCharacter, saveCharacter } from "../localStorage.ts";
import {LOCAL_STORAGE_PREFIX} from "../../constant.ts";


export const persistenceAdapter = {
  save: (id: string, character: ICharacter) => {
    try {
      saveCharacter(id, character);
    } catch (err) {
      console.error(`Failed to save character ${id} to localStorage:`, err);
    }
  },

  load: (id: string): ICharacter | null => {
    try {
      return loadCharacter(id);
    } catch (err) {
      console.error(`Failed to load character ${id} from localStorage:`, err);
      return null;
    }
  },

  loadAll: (): Record<string, ICharacter> => {
    if (typeof window === 'undefined') {
      return {};
    }

    const result: Record<string, ICharacter> = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(LOCAL_STORAGE_PREFIX)) {
          const id = key.replace(LOCAL_STORAGE_PREFIX, "");
          const value = localStorage.getItem(key);
          if (value) {
            try {
              result[id] = JSON.parse(value) as ICharacter;
            } catch (parseErr) {
              console.warn(`Failed to parse character ${id}, removing corrupted data:`, parseErr);
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to load all characters from localStorage:", err);
    }
    return result;
  },
};
