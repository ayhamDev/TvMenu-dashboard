import { Box, Stack, useTheme } from "@mui/material";
import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import React from "react";

const Toolbar = (props: { children: React.ReactNode }) => {
  const Theme = useTheme();
  return (
    <GridToolbarContainer
      sx={{
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: Theme.spacing(2),
      }}
    >
      <GridToolbarQuickFilter
        sx={{
          flex: 1,
          minWidth: "200px",
        }}
      />
      <Stack gap={2} direction={"row"} paddingTop={Theme.spacing(2)}>
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </Stack>
      {props.children}
    </GridToolbarContainer>
  );
};

export default Toolbar;
