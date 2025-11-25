import type { FC } from "react";
import { Box, Pagination } from "@mui/material";

type Props = {
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
};

export const PaginationControls: FC<Props> = ({
  currentPage,
  totalCount,
  onPageChange,
  pageSize = 10,
}) => {
  const totalPages = totalCount && pageSize ? Math.ceil(totalCount / pageSize) : 1;

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
      />
    </Box>
  );
};
