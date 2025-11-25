import { type FC, useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCharacterQuery } from "../hooks/queries/useCharacterQuery.ts";
import { useCharacterStore } from "../hooks/stores/useCharacterStore.ts";
import type { ICharacter } from "../types/character.ts";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";

const EditableListField: FC<{
  label: string;
  items: string[];
  onChange: (newItems: string[]) => void;
}> = ({ label, items, onChange }) => {
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const handleAdd = () => {
    onChange([...items, ""]);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <Box mb={2}>
      <Typography variant="h6">{label}</Typography>
      <Stack spacing={1}>
        {items.map((item, i) => (
          <Box key={i} display="flex" gap={1}>
            <TextField
              fullWidth
              value={item}
              onChange={(e) => handleItemChange(i, e.target.value)}
              size="small"
            />
            <IconButton onClick={() => handleRemove(i)}>
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Button startIcon={<Add />} onClick={handleAdd} size="small">
          Add {label.slice(0, -1)}
        </Button>
      </Stack>
    </Box>
  );
};

const CharacterDetail: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useCharacterQuery(id!);
  const { getCharacter, setCharacter } = useCharacterStore();
  const queryClient = useQueryClient();

  const [isSaving, setSaving] = useState(false);

  const persistedOrFetched = useMemo(() => {
    const stored = getCharacter(id!);
    return stored || data;
  }, [id, data, getCharacter]);

  const [localCharacter, setLocalCharacter] = useState<ICharacter | null>(
    () => {
      return getCharacter(id!) || null;
    },
  );

  if (!localCharacter && persistedOrFetched) {
    setLocalCharacter(persistedOrFetched);
  }

  const handleChange = useCallback((field: keyof ICharacter, value: string) => {
    setLocalCharacter((prev) => (prev ? { ...prev, [field]: value } : prev));
  }, []);

  const handleListChange = useCallback(
    (
      field: keyof Pick<
        ICharacter,
        "films" | "species" | "vehicles" | "starships"
      >,
      items: string[],
    ) => {
      setLocalCharacter((prev) => (prev ? { ...prev, [field]: items } : prev));
    },
    [],
  );

  const handleSave = useCallback(async () => {
    if (!localCharacter) return;
    setSaving(true);
    try {
      setCharacter(id!, localCharacter!);
      queryClient.setQueryData(
        ["characters", 1, ""],
        (oldData: { results: ICharacter[] }) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            results: oldData.results.map((c: ICharacter) =>
              c.url === id ? localCharacter : c,
            ),
          };
        },
      );
      navigate(-1)
    } finally {
      setTimeout(() => setSaving(false), 500);
    }

  }, [id, localCharacter, queryClient, setCharacter]);

  if (isLoading || !localCharacter) return <CircularProgress />;

  const fields: (keyof Pick<
    ICharacter,
    | "name"
    | "height"
    | "mass"
    | "hair_color"
    | "skin_color"
    | "eye_color"
    | "birth_year"
    | "gender"
    | "homeworld"
  >)[] = [
    "name",
    "height",
    "mass",
    "hair_color",
    "skin_color",
    "eye_color",
    "birth_year",
    "gender",
    "homeworld",
  ];

  return (
    <Box mt={4} display="flex" flexDirection="column" gap={3}>
      <Box display="flex" justifyContent="flex-start">
        <Button onClick={() => navigate(-1)} variant="outlined" sx={{ mb: 2 }}>
          ← Back
        </Button>
      </Box>

      <Typography variant="h4">{localCharacter.name}</Typography>
      <Stack spacing={2}>
        {fields.map((field) => (
          <TextField
            key={field}
            label={field.replace("_", " ").toUpperCase()}
            value={localCharacter[field]}
            onChange={(e) =>
              handleChange(field as keyof ICharacter, e.target.value)
            }
          />
        ))}
      </Stack>

      <EditableListField
        label="Species"
        items={localCharacter.species}
        onChange={(items) => handleListChange("species", items)}
      />
      <EditableListField
        label="Films"
        items={localCharacter.films}
        onChange={(items) => handleListChange("films", items)}
      />
      <EditableListField
        label="Vehicles"
        items={localCharacter.vehicles}
        onChange={(items) => handleListChange("vehicles", items)}
      />
      <EditableListField
        label="Starships"
        items={localCharacter.starships}
        onChange={(items) => handleListChange("starships", items)}
      />

      <Box display="flex" gap={2} mt={2}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          {isSaving && (
            <CircularProgress
              size={20}
              color="secondary"
              sx={{ marginRight: 1 }}
            />
          )}
          Save
        </Button>
      </Box>

      <Box mt={2}>
        <Typography variant="caption">
          Created: {new Date(localCharacter.created).toLocaleString()} | Edited:{" "}
          {new Date(localCharacter.edited).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default CharacterDetail;
