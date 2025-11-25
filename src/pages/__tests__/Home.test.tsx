import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import Home from "../Home";

function mockFetchOnce(data: any) {
  (global.fetch as any).mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

describe("Home Page", () => {
  it("shows skeletons while loading and renders characters later", async () => {
    global.fetch = vi.fn();

    mockFetchOnce({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
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
        },
      ],
    });

    render(
      <MemoryRouter>
        <QueryClientProvider client={new QueryClient()}>
          <Home />
        </QueryClientProvider>
      </MemoryRouter>,
    );

    const skeletons = screen.getAllByRole("progressbar");
    expect(skeletons.length).toBeGreaterThan(0);

    await screen.findByText("Luke Skywalker");
  });

  it("switching pages triggers new skeletons", async () => {
    global.fetch = vi.fn();

    mockFetchOnce({
      count: 20,
      results: [
        {
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
        },
      ],
    });

    mockFetchOnce({
      count: 20,
      results: [
        {
          name: "Darth Vader",
          height: "174",
          mass: "79",
          hair_color: "blond",
          skin_color: "fair",
          eye_color: "blue",
          birth_year: "19BBY",
          gender: "male",
          homeworld: "https://swapi.py4e.com/api/planets/2/",
          films: [],
          species: [],
          vehicles: [],
          starships: [],
          created: "2014-12-09T13:50:51.644000Z",
          edited: "2014-12-20T21:17:56.891000Z",
          url: "https://swapi.py4e.com/api/people/2/",
        },
      ],
    });

    render(
      <MemoryRouter>
        <QueryClientProvider client={new QueryClient()}>
          <Home />
        </QueryClientProvider>
      </MemoryRouter>,
    );

    await screen.findByText("Luke Skywalker");

    fireEvent.click(screen.getByLabelText("Go to next page"));

    const skeletons = await screen.findAllByRole("progressbar");
    expect(skeletons.length).toBeGreaterThan(0);

    await screen.findByText("Darth Vader");
  });

  it("updates search, shows skeletons, and renders new results", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            count: 1,
            results: [
              {
                name: "Luke Skywalker",
                url: "1",
                films: [],
                species: [],
                vehicles: [],
                starships: [],
              },
            ],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            count: 1,
            results: [
              {
                name: "Leia Organa",
                url: "2",
                films: [],
                species: [],
                vehicles: [],
                starships: [],
              },
            ],
          }),
      });

    render(
      <MemoryRouter>
        <QueryClientProvider client={new QueryClient()}>
          <Home />
        </QueryClientProvider>
      </MemoryRouter>,
    );

    await screen.findByText("Luke Skywalker");

    fireEvent.change(screen.getByLabelText("Search Characters"), {
      target: { value: "Leia" },
    });

    expect(screen.getByLabelText("Search Characters")).toHaveValue("Leia");

    const skeletons = await screen.findAllByRole("progressbar");
    expect(skeletons.length).toBeGreaterThan(0);

    await screen.findByText("Leia Organa");
  });
});
