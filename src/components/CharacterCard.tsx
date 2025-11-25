import {type FC, memo} from "react";
import type { ICharacter } from "../types/character.ts";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Typography,
} from "@mui/material";
import {getCharacterId} from "../lib/character/getCharacterId.ts";

type Props = {
  character: ICharacter;
};

const CharacterCardComponent: FC<Props> = ({ character }) => {
  const navigate = useNavigate();
  const id = getCharacterId(character.url);

  return (
    <Card
      sx={{
        p: 4,
        border: "1px solid rgba(0, 150, 255, 0.25)",
        borderRadius: 2,
        background: "rgba(20, 25, 30, 0.7)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 0 12px rgba(0,140,255,0.3)",
      }}
    >
      <CardContent>
        <Typography variant="h6">{character.name}</Typography>
        <Typography variant="body2">Height: {character.height}</Typography>
        <Typography variant="body2">Mass: {character.mass}</Typography>
        <Box display="flex" flexDirection="column" mt={1} gap={2}>
          <Chip label={`Films: ${character.films.length ?? 0}`} />
          <Chip label={`Species: ${character.species.length ?? 0}`} />
          <Chip label={`Vehicles: ${character.vehicles.length ?? 0}`} />
          <Chip label={`Starships: ${character.starships.length ?? 0}`} />
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button size="small" disabled={!id} onClick={() => navigate(`/character/${id}`)}>
          Details
        </Button>
      </CardActions>
    </Card>
  );
};

export const CharacterCard = memo(CharacterCardComponent, (prev, next) => {
    return prev.character === next.character;
});
