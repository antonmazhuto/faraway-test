import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useCharacterStore } from "../useCharacterStore";
import * as persistence from "../../../utils/persistence/characterPersistence";
import type { ICharacter } from "../../../types/character.ts";

const mockCharacter: ICharacter = {
  name: "Luke Skywalker",
  height: "172",
  mass: "77",
  hair_color: "blond",
  skin_color: "fair",
  eye_color: "blue",
  birth_year: "19BBY",
  gender: "male",
  homeworld: "https://swapi.py4e.com/api/planets/1/",
  films: [],
  species: [],
  vehicles: [],
  starships: [],
  created: "2014-12-09T13:50:51.644000Z",
  edited: "2014-12-20T21:17:56.891000Z",
  url: "https://swapi.py4e.com/api/people/1/",
};

describe("useCharacterStore", () => {
  beforeEach(() => {
    useCharacterStore.setState({ editedCharacters: {} });
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("init", () => {
    it("loads persisted characters on init", () => {
      const loadedCharacters = {
        "1": mockCharacter,
        "2": { ...mockCharacter, name: "Darth Vader" },
      };

      vi.spyOn(persistence.persistenceAdapter, "loadAll").mockReturnValue(
        loadedCharacters
      );

      useCharacterStore.getState().init();

      const state = useCharacterStore.getState();
      expect(state.editedCharacters).toEqual(loadedCharacters);
    });

    it("handles empty persistence on init", () => {
      vi.spyOn(persistence.persistenceAdapter, "loadAll").mockReturnValue({});

      useCharacterStore.getState().init();

      const state = useCharacterStore.getState();
      expect(state.editedCharacters).toEqual({});
    });
  });

  describe("setCharacter", () => {
    it("updates edited characters in state", () => {
      useCharacterStore.getState().setCharacter("1", mockCharacter);

      const state = useCharacterStore.getState();
      expect(state.editedCharacters["1"]).toEqual(mockCharacter);
    });

    it("calls persistenceAdapter.save", () => {
      const saveSpy = vi.spyOn(persistence.persistenceAdapter, "save");

      useCharacterStore.getState().setCharacter("1", mockCharacter);

      expect(saveSpy).toHaveBeenCalledWith("1", mockCharacter);
    });


    it("overwrites existing character", () => {
      const updated = { ...mockCharacter, name: "Updated Name" };

      useCharacterStore.getState().setCharacter("1", mockCharacter);
      useCharacterStore.getState().setCharacter("1", updated);

      const state = useCharacterStore.getState();
      expect(state.editedCharacters["1"].name).toBe("Updated Name");
    });
  });

  describe("getCharacter", () => {
    it("returns edited character from state", () => {
      useCharacterStore.getState().setCharacter("1", mockCharacter);

      const char = useCharacterStore.getState().getCharacter("1");

      expect(char).toEqual(mockCharacter);
    });
  });
});

