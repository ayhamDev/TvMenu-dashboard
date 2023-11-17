import { AnimatePresence, motion } from "framer-motion";
import React, { useLayoutEffect, useState } from "react";
import { AdminMotionProps } from "../../../utils/ConfigMotion";
import { useDispatch } from "react-redux";
import { SetName } from "../../../store/slice/Page";
import {
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowBackIosRounded } from "@mui/icons-material";
import Panel from "../../../components/Admin/Panel";
import ProgramsPanel from "../../../components/Admin/panel/Program.panel";
import UserPanel from "../../../components/Admin/panel/User.panel";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import IUser from "../../../types/IUser";
import GetUserById from "../../../api/getUserById";
import useAdminAuth from "../../../hooks/useAdminAuth";
import DevicesPanel from "../../../components/Admin/panel/Devices.panel";

const DeviceDetails = () => {
  const Dispatch = useDispatch();
  const [CurrentTab, SetCurrentTab] = useState<number>(0);
  const { id } = useParams();
  const Theme = useTheme();
  const navigate = useNavigate();
  const { admin } = useAdminAuth();

  const { data, error, isLoading, isFetching } = useQuery<IUser>({
    queryKey: ["User", id],
    queryFn: () => GetUserById(admin?.accessToken, id),
  });
  useLayoutEffect(() => {
    Dispatch(SetName("Menuone | Edit User"));
  }, []);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    SetCurrentTab(newValue);
  };
  if (isLoading) return <LoadingSpinner />;
  if (error) return <Navigate to={"/admin/user"} replace={true} />;
  return (
    <motion.div {...AdminMotionProps}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        pb={Theme.spacing(2)}
        gap={Theme.spacing(2)}
      >
        <IconButton
          sx={{
            padding: 0,
            margin: 0,
            width: "50px",
            height: "50px",
          }}
          onClick={() => history.back()}
        >
          <ArrowBackIosRounded />
        </IconButton>
        <Typography variant="h5">User Details</Typography>
      </Stack>
      {data?.Role == "Client" ? (
        <>
          <Tabs value={CurrentTab} onChange={handleChange}>
            <Tab label="Info" />
            <Tab label="Devices" />
            <Tab label="Programs" />
          </Tabs>
          <Panel value={CurrentTab} index={0}>
            <UserPanel id={id} />
          </Panel>

          <Panel value={CurrentTab} index={1}>
            <DevicesPanel User_ID={id} />
          </Panel>

          <Panel value={CurrentTab} index={2}>
            <ProgramsPanel User_ID={id} />
          </Panel>
        </>
      ) : (
        <UserPanel id={id} />
      )}
    </motion.div>
  );
};

export default DeviceDetails;
