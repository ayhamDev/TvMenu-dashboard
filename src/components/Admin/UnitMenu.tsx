import * as React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import Units from "../../types/Units";

export default function UnitMenu({
  value = "px",
  SetValue,
}: {
  value: Units;
  SetValue: React.Dispatch<React.SetStateAction<Units>>;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseItem = (unit: Units) => {
    setAnchorEl(null);
    SetValue(unit);
  };

  return (
    <div>
      <Button
        id="Unit"
        size="large"
        sx={{ width: "100%", height: "100%", maxHeight: "56px" }}
        onClick={handleClickListItem}
        variant="contained"
      >
        {value}
      </Button>
      <Menu
        id="Unit"
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
          "aria-labelledby": "Unit",
        }}
      >
        <MenuItem onClick={() => handleCloseItem("px")}>px</MenuItem>
        <MenuItem onClick={() => handleCloseItem("%")}>%</MenuItem>
      </Menu>
    </div>
  );
}
