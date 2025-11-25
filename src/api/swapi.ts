import type {ICharacter} from "../types/character.ts";

const BASE_URL = 'https://swapi.py4e.com/api';

export const fetchCharacters = async (page = 1, search = ""): Promise<{results: ICharacter[], count: number, next: string | null, previous: string | null}> => {
    const url = `${BASE_URL}/people/?page=${page}${
        search ? `&search=${encodeURIComponent(search)}` : ""
    }`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch characters.");
    const data = await response.json();

    return {
        results: data.results,
        count: data.count,
        next: data.next,
        previous: data.previous
    }
};

export const fetchCharacter = async (id: string): Promise<ICharacter> => {
    const response = await fetch(`${BASE_URL}/people/${id}`);
    if (!response.ok) throw new Error("Failed to fetch character.");
    return response.json();
}
