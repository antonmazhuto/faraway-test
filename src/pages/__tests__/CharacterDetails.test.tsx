import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import CharacterDetail from "../CharacterDetail";
import { useCharacterStore } from "../../hooks/stores/useCharacterStore";
import { useCharacterQuery } from "../../hooks/queries/useCharacterQuery";

const character = {
    name: "Luke Skywalker",
    height: "172",
    mass: "77",
    hair_color: "Blond",
    skin_color: "Fair",
    eye_color: "Blue",
    birth_year: "19BBY",
    gender: "Male",
    homeworld: "Tatooine",
    species: [],
    films: [],
    vehicles: [],
    starships: [],
    created: new Date().toISOString(),
    edited: new Date().toISOString(),
    url: "/1/",
};

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<any>("react-router-dom");
    return {
        ...actual,
        useParams: vi.fn(() => ({ id: "1" })),
        useNavigate: vi.fn(() => mockNavigate),
    };
});

vi.mock("../../hooks/queries/useCharacterQuery");
vi.mock("../../hooks/stores/useCharacterStore");

describe("CharacterDetail", () => {
    const queryClient = new QueryClient();

    beforeEach(() => {
        vi.clearAllMocks();

        (useCharacterQuery as any).mockReturnValue({
            data: character,
            isLoading: false,
            isError: false,
            error: null,
        });

        (useCharacterStore as any).mockReturnValue({
            getCharacter: vi.fn(() => null),
            setCharacter: vi.fn(),
        });
    });

    it("renders character details and allows editing fields", async () => {
        render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <CharacterDetail />
                </QueryClientProvider>
            </MemoryRouter>
        );

        expect(await screen.findByText("Luke Skywalker")).toBeInTheDocument();

        const heightInput = screen.getByLabelText("HEIGHT") as HTMLInputElement;
        expect(heightInput.value).toBe("172");

        fireEvent.change(heightInput, { target: { value: "180" } });
        expect(heightInput.value).toBe("180");

        const addFilmButton = screen.getByText("Add Film");
        fireEvent.click(addFilmButton);

        const filmInputs = screen.getAllByTestId(/films-input-/i);
        expect(filmInputs.length).toBe(character.films.length + 1);
    });

    it("shows validation error when saving empty name", async () => {
        render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <CharacterDetail />
                </QueryClientProvider>
            </MemoryRouter>
        );

        const nameInput = screen.getByLabelText("NAME") as HTMLInputElement;
        fireEvent.change(nameInput, { target: { value: "" } });

        const saveButton = screen.getByText("Save");
        fireEvent.click(saveButton);

        await waitFor(() => {
            const alert = screen.getByRole("alert");
            expect(alert).toHaveTextContent("Name cannot be empty");
        });
    });

    it("saves character and calls setCharacter + navigate(-1)", async () => {
        const setCharacterMock = vi.fn();
        (useCharacterStore as any).mockReturnValue({
            getCharacter: vi.fn(),
            setCharacter: setCharacterMock,
        });

        render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <CharacterDetail />
                </QueryClientProvider>
            </MemoryRouter>
        );

        const saveButton = screen.getByText(/Save/i);
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(setCharacterMock).toHaveBeenCalledWith("1", character);
            expect(mockNavigate).toHaveBeenCalledWith(-1);
        });
    });
});
