import type { ICharacter } from "../../types/character.ts";
import { create } from "zustand";
import { persistenceAdapter } from "../../utils/persistence/characterPersistence.ts";

interface CharacterStore {
  editedCharacters: Record<string, ICharacter>;
  setCharacter: (id: string, character: ICharacter) => void;
  getCharacter: (id: string) => ICharacter | undefined;
  init: () => void;
}

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  editedCharacters: {},

  init: () => {
    const loaded = persistenceAdapter.loadAll();
    set({ editedCharacters: loaded });
  },

  setCharacter: (id, character) => {
    set((state) => ({
      editedCharacters: { ...state.editedCharacters, [id]: character },
    }));
    persistenceAdapter.save(id, character);
  },

  getCharacter: (id) => {
    return (
      get().editedCharacters[id] || persistenceAdapter.load(id) || undefined
    );
  },
}));
