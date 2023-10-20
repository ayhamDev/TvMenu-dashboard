import { motion } from "framer-motion";
import { useCallback, useLayoutEffect, useState } from "react";
import { AdminMotionProps } from "../../utils/ConfigMotion";
import { SetName } from "../../store/slice/Page";
import { useDispatch, useSelector } from "react-redux";
import useAdminAuth from "../../hooks/useAdminAuth";
import {
  Typography,
  Paper,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
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
import { RootState } from "../../store/Store";
import { LockOpenRounded, MoreVertRounded } from "@mui/icons-material";
import QuickActions from "../../components/Admin/QuickActions";

const NewDevices = () => {
  // Row Selection State
  const [Selections, setSelections] = useState<number[]>([]);
  const [endpoint, SetEndPoint] = useState<string>("/");

  const page = useSelector((state: RootState) => state.Page.value);
  const [SelectedRow, setSelectedRow] = useState<object | number[] | undefined>(
    undefined
  );
  const [open, SetOpen] = useState<boolean>(false);
  const Theme = useTheme();
  const { VerifyToken, admin } = useAdminAuth();
  const dispatch = useDispatch();

  // Menu

  useLayoutEffect(() => {
    dispatch(SetName("New Devices"));
    VerifyToken();
  });
  const { status, data } = useQuery<INewDevice[]>({
    queryKey: ["newDevices"],
    queryFn: () => GetNewDevices(admin?.accessToken),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const columns: GridColDef[] = [
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
      headerName: "First Time Hit",
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
      headerName: "Last Time Hit",
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
        endpoint={endpoint}
        title={"Are You Sure You Want To Register This Device ?"}
        text={`This Device Has Requested To Be Registered, If You Want To Confirm That This Device Should Be Registered Click on Register, If Not Click on Cancel.`}
        method="post"
      />
      <motion.div {...AdminMotionProps}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
          gap={Theme.spacing(4)}
        >
          <Typography variant="h5">{page}</Typography>
          <QuickActions
            Selections={Selections}
            SetEndPoint={SetEndPoint}
            SetOpen={SetOpen}
            setSelectedRow={setSelectedRow}
          />
        </Stack>
        <Paper
          className="FancyBoxShadow"
          sx={{
            maxWidth: "100%",
            mt: Theme.spacing(2),
          }}
        >
          <DataGrid
            sx={{
              border: 0,
              padding: Theme.spacing(3),
            }}
            onRowClick={(data) => {
              SetEndPoint("/");
              setSelectedRow({
                Device_ID: data.row.Unregistered_Device_ID,
                Device_Token: data.row.Device_Token,
              });
              SetOpen(true);
            }}
            disableRowSelectionOnClick={true}
            columns={columns}
            rows={rows}
            checkboxSelection
            // @ts-ignore
            onRowSelectionModelChange={(selections: number[]) => {
              setSelections(selections);
            }}
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
