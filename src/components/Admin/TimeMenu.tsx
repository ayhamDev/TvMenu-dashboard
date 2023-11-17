import * as React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import Times from "../../types/Times";

export default function TimeMenu({
  value = "Seconds",
  SetValue,
  disabled = false,
}: {
  value: Times;
  SetValue: React.Dispatch<React.SetStateAction<Times>>;
  disabled: boolean;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseItem = (unit: Times) => {
    setAnchorEl(null);
    SetValue(unit);
  };

  return (
    <div>
      <Button
        disabled={disabled}
        id="TimeMenu"
        size="large"
        sx={{ width: "115px", height: "100%", maxHeight: "56px" }}
        onClick={handleClickListItem}
        variant="contained"
      >
        {value}
      </Button>
      <Menu
        id="TimeMenu"
        slotProps={{
          paper: {
            sx: {
              minWidth: "65px",
            },
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "TimeMenu",
        }}
      >
        <MenuItem onClick={() => handleCloseItem("Seconds")}>Second</MenuItem>
        <MenuItem onClick={() => handleCloseItem("Minute")}>Minute</MenuItem>
        <MenuItem onClick={() => handleCloseItem("Hour")}>Hour</MenuItem>
      </Menu>
    </div>
  );
}
