import { describe, it, expect } from "vitest";
import { getCharacterId } from "../getCharacterId";

describe("getCharacterId", () => {
  it("extracts ID from valid SWAPI URL", () => {
    const id = getCharacterId("https://swapi.py4e.com/api/people/1/");
    expect(id).toBe("1");
  });

  it("extracts ID from URL with multiple path segments", () => {
    const id = getCharacterId("https://swapi.py4e.com/api/people/42/");
    expect(id).toBe("42");
  });

  it("returns null for empty string", () => {
    const id = getCharacterId("");
    expect(id).toBeNull();
  });

  it("returns null for undefined", () => {
    const id = getCharacterId(undefined);
    expect(id).toBeNull();
  });

  it("returns last segment of URL path", () => {
    const id = getCharacterId("invalid-url");
    expect(id).toBe("invalid-url");
  });

  it("returns null for URL without segments", () => {
    const id = getCharacterId("/");
    expect(id).toBeNull();
  });

  it("handles URL with special characters", () => {
    const id = getCharacterId("https://example.com/api/people/123/");
    expect(id).toBe("123");
  });

  it("returns last segment even if URL has trailing slashes", () => {
    const id = getCharacterId("https://swapi.py4e.com/api/people/1///");
    expect(id).toBe("1");
  });
});

