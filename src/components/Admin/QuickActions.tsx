import { MoreVertRounded, LockOpenRounded } from "@mui/icons-material";
import {
  useTheme,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

const QuickActions = ({
  Selections,
  SetEndPoint,
  SetOpen,
  setSelectedRow,
}: {
  Selections: number[];
  SetEndPoint: Dispatch<SetStateAction<string>>;
  SetOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedRow: Dispatch<SetStateAction<object | number[] | undefined>>;
}) => {
  const Theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const QuickActionsOpen = Boolean(anchorEl);
  const OpenQuickActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const CloseQuickActions = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton id="QuickActions" onClick={OpenQuickActions}>
        <Badge badgeContent={Selections.length} color="primary">
          <MoreVertRounded />
        </Badge>
      </IconButton>
      <Menu
        id="QuickActions"
        anchorEl={anchorEl}
        open={QuickActionsOpen}
        onClose={CloseQuickActions}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            if (Selections.length == 0) {
              CloseQuickActions();
            } else {
              SetEndPoint("/bulk");
              SetOpen(true);
              setSelectedRow(Selections);
            }
          }}
        >
          <ListItemIcon>
            <LockOpenRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            Register
            <span style={{ color: Theme.palette.grey[400] }}>
              {" "}
              ({Selections.length})
            </span>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default QuickActions;
