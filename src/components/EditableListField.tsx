import { type FC } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

interface EditableListFieldProps {
  label: string;
  items: string[];
  onChange: (newItems: string[]) => void;
}

export const EditableListField: FC<EditableListFieldProps> = ({
  label,
  items,
  onChange,
}) => {
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const handleAdd = () => onChange([...items, ""]);

  const handleRemove = (index: number) =>
    onChange(items.filter((_, i) => i !== index));

  return (
    <Box mb={2}>
      <Typography variant="h6">{label}</Typography>
      <Stack spacing={1}>
        {items.map((item, i) => (
          <Box key={i} display="flex" gap={1}>
            <TextField
              fullWidth
              data-testid={`${label.toLowerCase()}-input-${i}`}
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
