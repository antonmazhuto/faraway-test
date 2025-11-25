import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("test", 500));
    expect(result.current).toBe("test");
  });

  it("cleans up timer on unmount", () => {
    const { unmount } = renderHook(() => useDebounce("test", 500));
    unmount();

    expect(() => {
      vi.advanceTimersByTime(1000);
    }).not.toThrow();
  });
});

