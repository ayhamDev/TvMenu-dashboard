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
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBackIosRounded } from "@mui/icons-material";
import Panel from "../../../components/Admin/Panel";
import DevicePanel from "../../../components/Admin/panel/Device.panel";
import ProgramsPanel from "../../../components/Admin/panel/Program.panel";

const DeviceDetails = () => {
  const Dispatch = useDispatch();
  const [CurrentTab, SetCurrentTab] = useState<number>(0);
  const { device_id } = useParams();
  const Theme = useTheme();
  const navigate = useNavigate();
  useLayoutEffect(() => {
    Dispatch(SetName("Menuone | Edit Device"));
  }, []);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    SetCurrentTab(newValue);
  };
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
        <Typography variant="h5">Device Details</Typography>
      </Stack>

      <Tabs value={CurrentTab} onChange={handleChange}>
        <Tab label="Info" />
        <Tab label="Programs" />
        <Tab label="Logs" />
      </Tabs>
      <Panel value={CurrentTab} index={0}>
        <DevicePanel id={device_id} />
      </Panel>
      <Panel value={CurrentTab} index={1}>
        <ProgramsPanel Device_ID={device_id} />
      </Panel>
      <Panel value={CurrentTab} index={2}>
        Logs
      </Panel>
    </motion.div>
  );
};

export default DeviceDetails;
