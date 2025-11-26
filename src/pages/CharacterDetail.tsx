import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCharacterQuery } from "../hooks/queries/useCharacterQuery.ts";
import { useCharacterStore } from "../hooks/stores/useCharacterStore.ts";
import type { ICharacter } from "../types/character.ts";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { getCharacterId } from "../lib/character/getCharacterId.ts";
import {EditableListField} from "../components/EditableListField.tsx";

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

const validateCharacter = (char: ICharacter): ValidationErrors<ICharacter> => {
  const errors: ValidationErrors<ICharacter> = {};

  if (!char.name.trim()) errors.name = "Name cannot be empty";
  if (!char.height.trim()) errors.height = "Height cannot be empty";
  if (!char.mass.trim()) errors.mass = "Mass cannot be empty";
  return errors;
};

const CharacterDetail: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useCharacterQuery(id || "", {
    enabled: !!id,
  });
  const { getCharacter, setCharacter } = useCharacterStore();
  const queryClient = useQueryClient();

  const [localCharacter, setLocalCharacter] = useState<ICharacter | null>(null);
  const [formErrors, setFormErrors] = useState<ValidationErrors<ICharacter>>(
    {},
  );
  const [isSaving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const persistedOrFetched = useMemo(() => {
    const stored = id ? getCharacter(id) : null;
    return stored || data;
  }, [id, data, getCharacter]);

  useEffect(() => {
    if (persistedOrFetched) {
      setLocalCharacter(persistedOrFetched);
    }
  }, [persistedOrFetched]);

  const handleChange = useCallback((field: keyof ICharacter, value: string) => {
    setLocalCharacter((prev) => (prev ? { ...prev, [field]: value } : prev));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
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

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleSave = useCallback(async () => {
    if (!localCharacter) return;

    const errors = validateCharacter(localCharacter);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setSnackbarMessage(Object.values(errors)[0]);
      setSnackbarOpen(true);
      return;
    }

    setSaving(true);
    try {
      setCharacter(id!, localCharacter!);
      queryClient.setQueryData(
        ["characters", 1, ""],
        (oldData: { results: ICharacter[] }) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            results: oldData.results.map((c) =>
              getCharacterId(c.url) === id ? localCharacter : c,
            ),
          };
        },
      );
      navigate(-1);
    } catch (err) {
      console.error("Failed to save character:", err);
      setSnackbarMessage("Failed to save character. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setTimeout(() => setSaving(false), 500);
    }
  }, [id, localCharacter, navigate, queryClient, setCharacter]);

  if (!id) return <Typography color="error">Invalid character ID</Typography>;
  if (isError)
    return (
      <Typography color="error">
        Failed to load character. {error instanceof Error ? error.message : ""}
      </Typography>
    );
  if (isLoading)
    return (
      <Box mt={4} display="flex" flexDirection="column" gap={3}>
        <Skeleton variant="rectangular" width={80} height={40} />

        <Skeleton variant="text" width={200} height={40} />

        <Stack spacing={2}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton
              key={idx}
              variant="rectangular"
              height={56}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Stack>

        {Array.from({ length: 4 }).map((_, idx) => (
          <Box key={idx}>
            <Skeleton variant="text" width={100} height={28} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={48} sx={{ mb: 1 }} />
          </Box>
        ))}

        <Skeleton variant="rectangular" width={100} height={40} />
      </Box>
    );
  if (!localCharacter)
    return <Typography color="error">Character not found</Typography>;

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
            onChange={(e) => handleChange(field, e.target.value)}
            error={!!formErrors[field]}
            helperText={formErrors[field]}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CharacterDetail;
