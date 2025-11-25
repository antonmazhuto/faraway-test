import type { ICharacter } from "../types/character.ts";

const BASE_URL = "https://swapi.py4e.com/api";
const DEFAULT_TIMEOUT = 5000; // 5 seconds

interface FetchCharactersResponse {
  results: ICharacter[];
  count: number;
  next: string | null;
  previous: string | null;
}

async function safeFetch<T>(
  url: string,
  errorMessage: string,
  timeout: number = DEFAULT_TIMEOUT
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`${errorMessage} (status: ${response.status})`);
    }

    try {
      return await response.json();
    } catch {
      throw new Error(`${errorMessage}: invalid JSON`);
    }
  } catch (networkError) {
    clearTimeout(timeoutId);
    if (networkError instanceof Error && networkError.name === 'AbortError') {
      throw new Error(`${errorMessage}: request timeout (${timeout}ms)`);
    }
    console.error("Fetch error:", networkError);
    throw networkError;
  }
}

export const fetchCharacters = async (
  page = 1,
  search = "",
): Promise<{
  results: ICharacter[];
  count: number;
  next: string | null;
  previous: string | null;
}> => {
  const url = `${BASE_URL}/people/?page=${page}${
    search ? `&search=${encodeURIComponent(search)}` : ""
  }`;

  return safeFetch<FetchCharactersResponse>(url, "Failed to fetch characters");
};

export const fetchCharacter = async (id: string): Promise<ICharacter> => {
  const url = `${BASE_URL}/people/${id}`;
  return safeFetch<ICharacter>(url, `Failed to fetch character with id ${id}`);
};
