import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {useCharactersQuery} from "../useCharactersQuery.ts";


const wrapper = ({ children }: any) => (
    <QueryClientProvider client={new QueryClient()}>
        {children}
    </QueryClientProvider>
);

describe("useCharactersQuery", () => {
    it("returns data", async () => {
        const mockResponse = {
            count: 1,
            next: null,
            previous: null,
            results: [{ name: "Luke Skywalker", url: "1" }],
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });

        const { result } = renderHook(
            () => useCharactersQuery(1, ""),
            { wrapper }
        );

        expect(result.current.isLoading).toBe(true);

        await waitFor(() =>
            expect(result.current.data?.results.length).toBe(1)
        );
    });
});
