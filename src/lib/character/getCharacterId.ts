export const getCharacterId = (url?: string): string | null => {
    if (!url) return null;
    try {
        const segments = url.split("/").filter(Boolean);
        return segments.pop() || null;
    } catch {
        return null;
    }
};
