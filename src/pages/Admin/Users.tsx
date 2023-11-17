import { AnimatePresence, motion } from "framer-motion";
import { useLayoutEffect, useState } from "react";
import { AdminMotionProps } from "../../utils/ConfigMotion";
import { SetName } from "../../store/slice/Page";
import { useDispatch, useSelector } from "react-redux";
import useAdminAuth from "../../hooks/useAdminAuth";
import {
  Typography,
  Paper,
  Box,
  Stack,
  IconButton,
  Badge,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/LoadingSpinner";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import INewDevice from "../../types/INewDevice";
import Toolbar from "../../components/Admin/Toolbar";
import moment from "moment";
import GetDevices from "../../api/GetDevices";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/Admin/ConfirmModal";
import {
  MoreVertRounded,
  DeleteRounded,
  TvRounded,
  TvOffRounded,
  Add,
} from "@mui/icons-material";
import ICRUD from "../../types/ICrud";
import GetUsers from "../../api/GetUsers";

const Users = () => {
  const Theme = useTheme();
  const navigate = useNavigate();
  const { VerifyToken, admin } = useAdminAuth();
  const dispatch = useDispatch();
  const [Selections, setSelections] = useState<number[]>([]);
  const [endpoint, SetEndPoint] = useState<string>("/");

  useLayoutEffect(() => {
    dispatch(SetName("Menuone | Users"));
  });
  const [SelectedRow, setSelectedRow] = useState<object | number[] | undefined>(
    undefined
  );
  const [open, SetOpen] = useState<boolean>(false);

  const { status, data } = useQuery<INewDevice[]>({
    queryKey: ["Users"],
    queryFn: () => GetUsers(admin?.accessToken),
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [method, SetMethod] = useState<ICRUD>("patch");
  const [ModalTitle, SetModalTitle] = useState<string>("");
  const [ModalText, SetModalText] = useState<string>("");
  const QuickActionsOpen = Boolean(anchorEl);
  const OpenQuickActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const CloseQuickActions = () => {
    setAnchorEl(null);
  };

  const columns: GridColDef[] = [
    {
      field: "User_ID",
      headerName: "User ID",
      width: 350,
    },
    {
      field: "email",
      headerName: "Email",
      width: 350,
    },

    {
      field: "Role",
      width: 350,
      type: "singleSelect",
      valueOptions: ["Admin", "Client"],
      renderCell: (params) => {
        return (
          <Box
            sx={{
              py: Theme.spacing(1),
              px: Theme.spacing(2),
              borderRadius: "24px",
              color: params.value == "Client" ? "green" : "red",
              background: Theme.palette.grey[300],
            }}
          >
            <Typography
              fontSize={15}
              fontWeight={"bold"}
              textTransform={"uppercase"}
            >
              {params.value == "Client" ? "Client" : "Admin"}
            </Typography>
          </Box>
        );
      },
    },
  ];

  if (status == "loading") return <LoadingSpinner />;
  if (status == "error") return <LoadingSpinner />;
  const rows = Array.isArray(data) ? data : [];
  return (
    <>
      <ConfirmModal
        open={open}
        SetOpen={SetOpen}
        data={SelectedRow}
        setSelections={setSelections}
        endpoint={endpoint}
        title={ModalTitle}
        text={ModalText}
        method={method}
        Cachekey={["Users"]}
      />
      <motion.div {...AdminMotionProps}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
          gap={Theme.spacing(4)}
        >
          <Typography variant="h5">Users</Typography>
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
                CloseQuickActions();
                if (Selections.length == 0) return null;
                SetMethod("delete");
                SetEndPoint(`/user/bulk`);
                SetOpen(true);
                setSelectedRow(Selections);
                SetModalTitle(
                  `Are You Sure That You Want To ${
                    Selections.length == 1
                      ? "Delete This User"
                      : "Delete All Of These Users"
                  } ?`
                );
                SetModalText(
                  "Deleted Users can not be restored later, that means if you want them back you need to create."
                );
              }}
            >
              <ListItemIcon>
                <DeleteRounded fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                Delete
                <span style={{ color: Theme.palette.grey[400] }}>
                  {" "}
                  ({Selections.length})
                </span>
              </ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                navigate("/admin/user/new");
              }}
            >
              <ListItemIcon>
                <Add fontSize="small" />
              </ListItemIcon>
              <ListItemText>Create User</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
        <Paper
          className="FancyBoxShadow"
          sx={{
            maxWidth: "100%",
            mt: Theme.spacing(3),
          }}
        >
          <DataGrid
            sx={{
              border: 0,
              padding: Theme.spacing(2),
            }}
            getRowId={(row) => row.User_ID}
            // @ts-ignore
            columns={columns}
            rows={rows}
            onRowClick={(row) => navigate(`/admin/user/${row.id}`)}
            checkboxSelection
            rowSelectionModel={Selections}
            disableRowSelectionOnClick={true}
            // @ts-ignore
            onRowSelectionModelChange={(selection: number[]) => {
              setSelections(selection);
            }}
            initialState={{
              sorting: {
                sortModel: [{ field: "email", sort: "asc" }],
              },
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            density="comfortable"
            pageSizeOptions={[10, 25, 50, 100]}
            slots={{
              toolbar: Toolbar,
            }}
          ></DataGrid>
        </Paper>
      </motion.div>
    </>
  );
};
export default Users;
