import { describe, it, expect, vi } from "vitest";
import {fetchCharacters} from "../../../api/swapi.ts";

describe("fetchCharacters", () => {
    it("fetches list of characters", async () => {
        const mockResponse = {
            count: 2,
            next: null,
            previous: null,
            results: [
                { name: "Luke Skywalker", url: "url-1" },
                { name: "Darth Vader", url: "url-2" },
            ],
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });

        const data = await fetchCharacters(1, "");

        expect(fetch).toHaveBeenCalled();
        const callArgs = (fetch as any).mock.calls[0];
        expect(callArgs[0]).toBe("https://swapi.py4e.com/api/people/?page=1");
        expect(callArgs[1]).toHaveProperty("signal");

        expect(data.results.length).toBe(2);
        expect(data.count).toBe(2);
    });

    it("throws error on failed fetch", async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, });

        await expect(fetchCharacters(1, "")).rejects.toThrow(/Failed to fetch characters/);
    });
});
