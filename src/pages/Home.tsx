import { type FC, useMemo, useState } from "react";
import { useCharactersQuery } from "../hooks/queries/useCharactersQuery.ts";
import { Alert, Box, TextField, Grid, Skeleton } from "@mui/material";
import { CharacterCard } from "../components/CharacterCard.tsx";
import { PaginationControls } from "../components/PaginationControls.tsx";
import { useDebounce } from "../hooks/custom/useDebounce.ts";
import { useCharacterStore } from "../hooks/stores/useCharacterStore.ts";

const skeletonArray = Array.from({ length: 9 });

const Home: FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  const editedCharacters = useCharacterStore((state) => state.editedCharacters);

  const { data, isLoading, isFetching, isError } = useCharactersQuery(
    page,
    debouncedSearch,
  );

  const mergedResults = useMemo(() => {
    if (!data?.results) return [];
    return data.results.map((char) => {
      const id = char.url.split("/").filter(Boolean).pop()!;
      const edited = editedCharacters[id];
      return edited ? { ...char, ...edited } : char;
    });
  }, [data?.results ? data.results : [], editedCharacters]);

  return (
    <Box mt={4}>
      <TextField
        fullWidth
        label="Search Characters"
        variant="outlined"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        margin="normal"
      />
      {isError && <Alert severity="error">Error loading characters</Alert>}
      <Grid container spacing={2} mt={2}>
        {isLoading || isFetching
          ? skeletonArray.map((_, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                <Skeleton
                  variant="rectangular"
                  height={220}
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            ))
          : mergedResults.map((character) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={character.url}>
                <CharacterCard character={character} />
              </Grid>
            ))}
      </Grid>

      {data && (
        <PaginationControls
          currentPage={page}
          totalCount={data.count}
          onPageChange={setPage}
        />
      )}
    </Box>
  );
};

export default Home;
