import {
  AddRounded,
  DeleteRounded,
  MoreVertRounded,
} from "@mui/icons-material";
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
import GetDevicesById from "../../../api/GetDeviceById";
import GetPrograms from "../../../api/GetPrograms";
import Toolbar from "../../../components/Admin/Toolbar";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useAdminAuth from "../../../hooks/useAdminAuth";
import { SetName } from "../../../store/slice/Page";
import ICRUD from "../../../types/ICrud";
import IDevice from "../../../types/IDevice";
import IProgram from "../../../types/IProgram";
import { AdminMotionProps } from "../../../utils/ConfigMotion";
import ConfirmModal from "../ConfirmModal";

const ProgramsPanel = (props: {
  User_ID?: string | undefined;
  Device_ID?: string | undefined;
}) => {
  // Row Selection State
  const ProgramTypes = ["Web", "Image", "Video"];

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
    dispatch(SetName("Menuone | User Programs"));
  });
  const { status, data } = useQuery<IProgram[]>({
    queryKey: [
      "Programs",
      props.Device_ID
        ? { Device_ID: props.Device_ID }
        : { User_ID: props.User_ID },
    ],
    queryFn: () =>
      GetPrograms(
        admin?.accessToken,
        props.Device_ID
          ? {
              Device_ID: props.Device_ID,
            }
          : { User_ID: props.User_ID }
      ),
  });
  const {
    data: Device,
    error,
    isLoading,
    isFetching,
  } = useQuery<IDevice>({
    queryKey: ["Devices", props.Device_ID],
    queryFn: () => GetDevicesById(admin?.accessToken, props.Device_ID),
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
      headerName: "Lined Devices",
      valueGetter: (param) => param.value.length,
      headerAlign: "left",
      type: "number",
      align: "left",
      width: 200,
    },
    {
      field: "Device_Token",
      headerName: "Device Token",
      width: 250,
    },

    {
      field: "Program_Row_Number",
      headerName: "ID",
      type: "number",
      headerAlign: "left",
      align: "left",
      width: 150,
    },
    {
      field: "Program_Name",
      headerName: "Program Name",
      width: 250,
    },
    {
      field: "Start_DateTime",
      headerName: "Starts At",
      type: "dateTime",
      width: 250,
      valueGetter: (param) =>
        param.value == "null" || param.value == null
          ? null
          : new Date(param.value),
      valueFormatter: (param) =>
        param.value == "null" || param.value == null
          ? "N/A"
          : moment(param.value).format("lll"),
    },
    {
      field: "End_DateTime",
      headerName: "Ends At",
      type: "dateTime",
      width: 250,
      valueGetter: (param) =>
        param.value == "null" || param.value == null
          ? null
          : new Date(param.value),
      valueFormatter: (param) =>
        param.value == "null" || param.value == null
          ? "N/A"
          : moment(param.value).format("lll"),
    },
    {
      field: "Program_Type",
      headerName: "Program Type",
      valueGetter: (param) => ProgramTypes[param.value - 1],
      type: "singleSelect",
      valueOptions: ["Web", "Image", "Video"],
      width: 200,
    },
    {
      field: "Program_Status",
      headerName: "Status",
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
  ];

  if (status == "loading") return <LoadingSpinner />;
  if (status == "error") return <LoadingSpinner />;
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
        Cachekey={["Programs", { User_ID: props.User_ID }]}
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
              "aria-labelledby": "QuickActions",
            }}
          >
            <MenuItem
              onClick={() => {
                console.log(Selections);

                CloseQuickActions();
                if (Selections.length == 0) return null;
                SetEndPoint("/program/bulk");
                SetMethod("delete");
                SetOpen(true);
                setSelectedRow(Selections);
                SetModalTitle(
                  `Are You Sure You Want To Delete ${
                    Selections.length == 1
                      ? "This Device"
                      : "All Of These Devices"
                  } ?`
                );
                SetModalText(
                  `If You Deleted ${
                    Selections.length == 1 ? "This device" : "These Devices"
                  } you won't be able to recover ${
                    Selections.length == 1 ? "it" : "them"
                  }`
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
                SetEndPoint("/program/bulk?Program_Status=Active");
                SetMethod("patch");
                SetOpen(true);
                setSelectedRow(Selections);
                SetModalTitle(
                  `Are You Sure You Want To Activate ${
                    Selections.length == 1
                      ? "This Program"
                      : "All Of These Programs"
                  } ?`
                );
                SetModalText(
                  `Activating ${
                    Selections.length == 1 ? "This Program" : "these Programs"
                  } means that ${
                    Selections.length == 1 ? "they" : "it"
                  } will be shown.`
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
                console.log(Selections);

                CloseQuickActions();
                if (Selections.length == 0) return null;
                SetEndPoint("/program/bulk?Program_Status=Suspended");
                SetMethod("patch");
                SetOpen(true);
                setSelectedRow(Selections);
                SetModalTitle(
                  `Are You Sure You Want To Suspend ${
                    Selections.length == 1
                      ? "This Program"
                      : "All Of These Programs"
                  } ?`
                );
                SetModalText(
                  `Suspending ${
                    Selections.length == 1 ? "This Program" : "these Programs"
                  } means that ${
                    Selections.length == 1 ? "they" : "it"
                  } will not be shown.`
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
            <Divider />
            <MenuItem
              onClick={() => {
                CloseQuickActions();
                if (Selections.length == 0) return null;
                SetEndPoint(`/program/bulk?Program_Type=1`);
                SetMethod("patch");
                SetOpen(true);
                setSelectedRow(Selections);
                SetModalTitle(
                  `Are You Sure You Want To Change The Program Type for ${
                    Selections.length == 1
                      ? "This Device"
                      : "All Of These Devices"
                  } ?`
                );
                SetModalText(
                  `Changing The Program Type Can Cause Unexpected Be behavior`
                );
              }}
            >
              <ListItemText>
                Change Type To "Web"
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
                SetEndPoint(`/program/bulk?Program_Type=2`);
                SetMethod("patch");
                SetOpen(true);
                setSelectedRow(Selections);
                SetModalTitle(
                  `Are You Sure You Want To Change The Program Type for ${
                    Selections.length == 1
                      ? "This Device"
                      : "All Of These Devices"
                  } ?`
                );
                SetModalText(
                  `Changing The Program Type Can Cause Unexpected Be behavior`
                );
              }}
            >
              <ListItemText>
                Change Type To "Image"
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
                SetEndPoint(`/program/bulk?Program_Type=3`);
                SetMethod("patch");
                SetOpen(true);
                setSelectedRow(Selections);
                SetModalTitle(
                  `Are You Sure You Want To Change The Program Type for ${
                    Selections.length == 1
                      ? "This Device"
                      : "All Of These Devices"
                  } ?`
                );
                SetModalText(
                  `Changing The Program Type Can Cause Unexpected Be behavior`
                );
              }}
            >
              <ListItemText>
                Change Type To "Video"
                <span style={{ color: Theme.palette.grey[400] }}>
                  {" "}
                  ({Selections.length})
                </span>
              </ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                navigate(
                  `/admin/program/new?User_ID=${
                    props.User_ID ? props.User_ID : Device.User_ID
                  }${props.Device_ID ? `&Device_ID=${props.Device_ID}` : ""}`
                );
              }}
            >
              <ListItemIcon>
                <AddRounded fontSize="small" />
              </ListItemIcon>
              <ListItemText>Create Program</ListItemText>
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
            getRowId={(row) => row.Program_Row_Number}
            onRowClick={(data) => {
              navigate(`/admin/program/${data.id}`);
            }}
            disableRowSelectionOnClick={true}
            columns={columns}
            rows={rows}
            checkboxSelection
            // @ts-ignore
            onRowSelectionModelChange={(selections: number[]) => {
              setSelections(selections);
            }}
            rowSelectionModel={Selections}
            initialState={{
              columns: {
                columnVisibilityModel: {},
              },
              sorting: {
                sortModel: [{ field: "Start_DateTime", sort: "desc" }],
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

export default ProgramsPanel;
