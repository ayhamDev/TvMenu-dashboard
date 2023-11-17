import { motion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { AdminMotionProps } from "../../utils/ConfigMotion";
import { SetName } from "../../store/slice/Page";
import { useDispatch, useSelector } from "react-redux";
import useAdminAuth from "../../hooks/useAdminAuth";
import {
  Typography,
  Paper,
  Stack,
  Badge,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/LoadingSpinner";
import GetNewDevices from "../../api/GetNewDevices";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import INewDevice from "../../types/INewDevice";
import Toolbar from "../../components/Admin/Toolbar";
import moment from "moment";
import ConfirmModal from "../../components/Admin/ConfirmModal";
import { MoreVertRounded, LockOpenRounded } from "@mui/icons-material";

const NewDevices = () => {
  // Row Selection State
  const [Selections, setSelections] = useState<number[]>([]);
  const [endpoint, SetEndPoint] = useState<string>("/");

  const [SelectedRow, setSelectedRow] = useState<object | number[] | undefined>(
    undefined
  );
  const [open, SetOpen] = useState<boolean>(false);
  const Theme = useTheme();
  const { VerifyToken, admin } = useAdminAuth();
  const dispatch = useDispatch();

  // Menu

  useLayoutEffect(() => {
    dispatch(SetName("Menuone | New Devices"));
  });
  const { status, data } = useQuery<INewDevice[]>({
    queryKey: ["newDevices"],
    queryFn: () => GetNewDevices(admin?.accessToken),
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });
  const [ModalTitle, SetModalTitle] = useState<string>(
    "Are You Sure You Want To Register This Device ?"
  );
  const [ModalText, SetModalText] = useState<string>(
    `This Device Has Requested To Be Registered, If You Want To Confirm That This Device Should Be Registered Click on Register, If Not Click on Cancel.`
  );
  const columns: GridColDef[] = [
    {
      field: "User_ID",
      headerName: "User ID",
      width: 300,
    },
    {
      field: "Unregistered_Device_ID",
      headerName: "Device ID",
      width: 250,
    },
    {
      field: "Device_Token",
      headerName: "Device Token",
      width: 200,
    },
    {
      field: "IP_Address",
      headerName: "Ip Address",
      width: 200,
    },
    {
      field: "First_Date_Time_Hit",
      headerName: "First Request",
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
      field: "Last_Date_Time_Hit",
      headerName: "Last Request",
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
      field: "Requested_Count",
      headerName: "Requested Count",
      type: "number",
      headerAlign: "left",
      align: "left",
      width: 200,
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
        method="post"
        Cachekey={["newDevices"]}
        fields={[
          {
            name: "Device_Name",
            label: "Device Name",
            helperText: "Device Name Is Required ",
            required: true,
          },
          {
            name: "Device_Notes",
            label: "Device Description",
            multiline: true,
          },
        ]}
      />
      <motion.div {...AdminMotionProps}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
          gap={Theme.spacing(4)}
        >
          <Typography variant="h5">New Devices</Typography>
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
            onRowClick={(data) => {
              SetEndPoint("/");
              setSelectedRow({
                Device_ID: data.row.Unregistered_Device_ID,
                Device_Token: data.row.Device_Token,
                User_ID: data.row.User_ID,
              });
              SetOpen(true);
              SetModalTitle(`Are You Sure You Want To Register This Device`);
              SetModalText(
                `This Device Has Requested To Be Registered, If You Want To Confirm That This Device Should Be Registered Click on Register, If Not Click on Cancel.`
              );
            }}
            disableRowSelectionOnClick={true}
            columns={columns}
            rows={rows}
            // @ts-ignore
            initialState={{
              sorting: {
                sortModel: [{ field: "Last_Date_Time_Hit", sort: "desc" }],
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

export default NewDevices;
