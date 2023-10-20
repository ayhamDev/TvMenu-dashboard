import { motion } from "framer-motion";
import { useLayoutEffect, useState } from "react";
import { AdminMotionProps } from "../../utils/ConfigMotion";
import { SetName } from "../../store/slice/Page";
import { useDispatch, useSelector } from "react-redux";
import useAdminAuth from "../../hooks/useAdminAuth";
import { Typography, Paper, Box, Stack, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/LoadingSpinner";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import INewDevice from "../../types/INewDevice";
import Toolbar from "../../components/Admin/Toolbar";
import moment from "moment";
import { RootState } from "../../store/Store";
import GetDevices from "../../api/GetDevices";
import { useNavigate } from "react-router-dom";

const Devices = () => {
  const page = useSelector((state: RootState) => state.Page.value);
  const Theme = useTheme();
  const navigate = useNavigate();
  const { VerifyToken, admin } = useAdminAuth();
  const dispatch = useDispatch();
  const [Selections, setSelections] = useState<number[]>([]);
  const [endpoint, SetEndPoint] = useState<string>("/");

  useLayoutEffect(() => {
    dispatch(SetName("Devices"));
    VerifyToken();
  });

  const { status, data } = useQuery<INewDevice[]>({
    queryKey: ["Devices"],
    queryFn: () => GetDevices(admin?.accessToken),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
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
      editable: true,
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
        param.value == "null" || param.value == null
          ? null
          : new Date(param.value),
      valueFormatter: (param) =>
        param.value == "null" || param.value == null
          ? "N/A"
          : moment(param.value).format("lll"),
    },
  ];

  if (status == "loading") return <LoadingSpinner />;
  if (status == "error") return <LoadingSpinner />;
  const rows = Array.isArray(data) ? data : [];

  return (
    <>
      <motion.div {...AdminMotionProps}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
          gap={Theme.spacing(4)}
        >
          <Typography variant="h5">{page}</Typography>
          {Selections.length > 0 ? (
            <Stack direction={"row"} gap={Theme.spacing(2)} flexWrap={"wrap"}>
              <Button
                sx={{
                  height: "fit-content",
                }}
                variant="contained"
                color="info"
              >
                {Selections.length == 1 ? "Active" : "Active All"}
              </Button>
              <Button
                sx={{
                  height: "fit-content",
                }}
                variant="contained"
                color="warning"
              >
                {Selections.length == 1 ? "Suspend" : "Suspend All"}
              </Button>
              <Button
                sx={{
                  height: "fit-content",
                }}
                variant="contained"
                color="error"
              >
                {Selections.length == 1 ? "Delete" : "Delete All"}
              </Button>
            </Stack>
          ) : null}
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
              padding: Theme.spacing(2),
            }}
            // @ts-ignore
            columns={columns}
            rows={rows}
            onRowClick={() => navigate(`/admin/devices/`)}
            checkboxSelection
            disableRowSelectionOnClick={true}
            onRowSelectionModelChange={(selection) => {
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

export default Devices;
