import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { persistenceAdapter } from "../characterPersistence";
import { LOCAL_STORAGE_PREFIX } from "../../../constant.ts";
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

describe("persistenceAdapter", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("save", () => {
    it("saves character to localStorage", () => {
      persistenceAdapter.save("1", mockCharacter);

      const stored = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}1`);
      expect(stored).toBeDefined();
      expect(JSON.parse(stored!)).toEqual(mockCharacter);
    });
  });

  describe("load", () => {
    it("loads character from localStorage", () => {
      localStorage.setItem(
        `${LOCAL_STORAGE_PREFIX}1`,
        JSON.stringify(mockCharacter)
      );

      const loaded = persistenceAdapter.load("1");

      expect(loaded).toEqual(mockCharacter);
    });

    it("returns null if character not found", () => {
      const loaded = persistenceAdapter.load("999");

      expect(loaded).toBeNull();
    });

    it("handles invalid JSON", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}1`, "{invalid json}");

      const loaded = persistenceAdapter.load("1");

      expect(loaded).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("loadAll", () => {
    it("loads all characters from localStorage", () => {
      localStorage.setItem(
        `${LOCAL_STORAGE_PREFIX}1`,
        JSON.stringify(mockCharacter)
      );
      localStorage.setItem(
        `${LOCAL_STORAGE_PREFIX}2`,
        JSON.stringify({ ...mockCharacter, name: "Darth Vader" })
      );
      localStorage.setItem("other_key", "other_value");

      const loaded = persistenceAdapter.loadAll();

      expect(Object.keys(loaded)).toHaveLength(2);
      expect(loaded["1"]).toEqual(mockCharacter);
      expect(loaded["2"].name).toBe("Darth Vader");
    });

    it("returns empty object if no characters found", () => {
      const loaded = persistenceAdapter.loadAll();

      expect(loaded).toEqual({});
    });
  });
});

