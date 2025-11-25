import type { ICharacter } from "../../types/character.ts";
import { create } from "zustand";
import { saveCharacter, loadCharacter } from '../../utils/localStorage';

interface CharacterStore {
    editedCharacters: Record<string, ICharacter>;
    setCharacter: (id: string, character: ICharacter) => void;
    getCharacter: (id: string) => ICharacter | undefined;
}

export const useCharacterStore = create<CharacterStore>((set, get) => {
    const initialEdited: Record<string, ICharacter> = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("character_")) {
            const id = key.replace("character_", "");
            const value = localStorage.getItem(key);
            if (value) initialEdited[id] = JSON.parse(value);
        }
    }

    return {
        editedCharacters: initialEdited,
        setCharacter: (id, character) => {
            set(state => ({
                editedCharacters: { ...state.editedCharacters, [id]: character }
            }));
            saveCharacter(id, character);
        },
        getCharacter: (id) => {
            return get().editedCharacters[id] || loadCharacter(id) || undefined;
        }
    };
});
