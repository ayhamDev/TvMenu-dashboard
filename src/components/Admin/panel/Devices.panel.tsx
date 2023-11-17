import { DeleteRounded, MoreVertRounded } from "@mui/icons-material";
import {
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import moment from "moment";
import { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import GetDevices from "../../../api/GetDevices";
import useAdminAuth from "../../../hooks/useAdminAuth";
import { SetName } from "../../../store/slice/Page";
import ICRUD from "../../../types/ICrud";
import IDevice from "../../../types/IDevice";
import { AdminMotionProps } from "../../../utils/ConfigMotion";
import LoadingSpinner from "../../LoadingSpinner";
import ConfirmModal from "../ConfirmModal";
import Toolbar from "../Toolbar";

const DevicesPanel = (props: {
  User_ID?: string | undefined;
  Device_ID?: string | undefined;
}) => {
  // Row Selection State
  const [Selections, setSelections] = useState<number[]>([]);
  const [endpoint, SetEndPoint] = useState<string>("/");

  const [SelectedRow, setSelectedRow] = useState<object | number[] | undefined>(
    undefined
  );
  const [open, SetOpen] = useState<boolean>(false);
  const Theme = useTheme();
  const { admin } = useAdminAuth();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(SetName("Menuone | User Devices"));
  });
  const { data, error, isLoading, isFetching } = useQuery<IDevice>({
    queryKey: ["Devices", { User_ID: props.User_ID }],
    queryFn: () =>
      GetDevices(admin?.accessToken, {
        User_ID: props.User_ID,
      }),
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [ModalTitle, SetModalTitle] = useState<string>(
    "Are You Sure You Want To Register This Device ?"
  );
  const [ModalText, SetModalText] = useState<string>(
    `This Device Has Requested To Be Registered, If You Want To Confirm That This Device Should Be Registered Click on Register, If Not Click on Cancel.`
  );
  const [Method, SetMethod] = useState<ICRUD>("delete");
  const QuickActionsOpen = Boolean(anchorEl);
  const OpenQuickActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const CloseQuickActions = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    {
      field: "Device_ID",
      headerName: "Device ID",
      width: 250,
    },
    {
      field: "Device_Token",
      headerName: "Device Token",
      width: 200,
    },
    {
      field: "Status",
      width: 250,
      type: "singleSelect",
      valueOptions: ["Active", "Suspended"],
      renderCell: (params) => {
        return (
          <Box
            sx={{
              py: Theme.spacing(1),
              px: Theme.spacing(2),
              borderRadius: "24px",
              color: params.value == "Active" ? "green" : "red",
              background: Theme.palette.grey[300],
            }}
          >
            <Typography
              fontSize={15}
              fontWeight={"bold"}
              textTransform={"uppercase"}
            >
              {params.value == "Active" ? "Active" : "Suspended"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "connectionID",
      headerName: "Connection",
      width: 250,
      type: "singleSelect",
      valueOptions: ["Online", "Offline"],
      valueGetter: (params) => {
        return params.value ? "Online" : "Offline";
      },
      renderCell: (params) => {
        return (
          <Box
            sx={{
              py: Theme.spacing(1),
              px: Theme.spacing(2),
              borderRadius: "24px",
              background: params.value == "Online" ? "green" : "red",
              color: Theme.palette.grey[100],
            }}
          >
            <Typography
              fontSize={15}
              fontWeight={"bold"}
              textTransform={"uppercase"}
            >
              {params.value == "Online" ? "Online" : "Offline"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "Last_Online_hit",
      headerName: "Last Online",
      type: "date",
      width: 250,
      valueGetter: (param) =>
        param.row.connectionID
          ? Date.now()
          : param.value == "null" || param.value == null
          ? null
          : new Date(param.value),
      valueFormatter: (param) =>
        param.value == "null" || param.value == null
          ? "N/A"
          : moment(param.value).format("lll"),
    },
  ];
  if (isLoading) return <LoadingSpinner />;
  if (error) return <Navigate to={"/admin/device"} replace={true} />;
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
        method={Method}
        Cachekey={["Devices", { User_ID: props.User_ID }]}
      />
      <motion.div {...AdminMotionProps}>
        <Stack
          direction={"row"}
          justifyContent={"flex-end"}
          flexWrap={"wrap"}
          gap={Theme.spacing(4)}
        >
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
                SetEndPoint(`/bulk`);
                SetOpen(true);
                setSelectedRow(Selections);
                SetModalTitle(
                  `Are You Sure That You Want To ${
                    Selections.length == 1
                      ? "Delete This Device"
                      : "Delete All Of These Devices"
                  } ?`
                );
                SetModalText(
                  "Deleted devices can not be restored later, that means if you want them back you need to create them from scratch."
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
                CloseQuickActions();
                if (Selections.length == 0) return null;

                SetMethod("patch");
                SetEndPoint("/bulk?value=Active");
                SetOpen(true);
                setSelectedRow(Selections);
                SetModalTitle(
                  `Are You Sure That You Want To Activate ${
                    Selections.length == 1
                      ? "This Device"
                      : "All Of These Devices"
                  } ?`
                );
                SetModalText(
                  "If you make them active they will be able to access the server."
                );
              }}
            >
              <ListItemText>
                Change Status To "Active"
                <span style={{ color: Theme.palette.grey[400] }}>
                  {" "}
                  ({Selections.length})
                </span>
              </ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                CloseQuickActions();
                if (Selections.length == 0) return null;
                SetMethod("patch");
                SetEndPoint("/bulk?value=Suspended");
                SetOpen(true);
                setSelectedRow(Selections);
                SetModalTitle(
                  `Are You Sure That You Want To Suspend ${
                    Selections.length == 1
                      ? "This Device"
                      : "All Of These Devices"
                  }?`
                );
                SetModalText(
                  "If you make them suspended they will not be able to access the server."
                );
              }}
            >
              <ListItemText>
                Change Status To "Suspended"
                <span style={{ color: Theme.palette.grey[400] }}>
                  {" "}
                  ({Selections.length})
                </span>
              </ListItemText>
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
            getRowId={(row) => row.Device_ID}
            // @ts-ignore
            columns={columns}
            rows={rows}
            onRowClick={(row) => navigate(`/admin/device/${row.id}`)}
            checkboxSelection
            rowSelectionModel={Selections}
            disableRowSelectionOnClick={true}
            // @ts-ignore
            onRowSelectionModelChange={(selection: number[]) => {
              setSelections(selection);
            }}
            initialState={{
              sorting: {
                sortModel: [{ field: "Last_Online_hit", sort: "desc" }],
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

export default DevicesPanel;
