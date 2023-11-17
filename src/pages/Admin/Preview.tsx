import {
  MenuItem,
  AppBar,
  FormControl,
  Select,
  TextField,
  Typography,
  useTheme,
  Divider,
  SelectChangeEvent,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";
import { Box, Stack } from "@mui/material";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SetName } from "../../store/slice/Page";
import { useDebounce } from "use-debounce";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { ScreenRotationAltRounded } from "@mui/icons-material";
import PreviewScreen, {
  TypeAspectRatio,
} from "../../components/Preview/PreviewScreen";

const Presets: { w: number; h: number }[] = [
  {
    w: 1280,
    h: 720,
  },
  {
    w: 1920,
    h: 1080,
  },
  {
    w: 2560,
    h: 1440,
  },
  {
    w: 3840,
    h: 2160,
  },
];
const Preview = () => {
  const Theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [SearchParams, SetSearchParams] = useSearchParams();

  const [Preset, SetPreset] = useState<number>(2);
  const [disabledFields, SetDisabledFields] = useState<boolean>(false);
  const [Width, SetWidth] = useState<number>(Presets[1].w);
  const [Height, SetHight] = useState<number>(Presets[1].h);
  const [AspectRatio, SetAspectRatio] = useState<TypeAspectRatio>("16/9");
  const [WidthValue] = useDebounce(Width, 1000);
  const [HightValue] = useDebounce(Height, 1000);
  const handlePresetChange = (event: SelectChangeEvent) => {
    // @ts-ignore
    SetPreset(event.target.value);
  };
  const HandleRotate = () => {
    if (AspectRatio == "16/9") return SetAspectRatio("9/16");
    if (AspectRatio == "9/16") return SetAspectRatio("16/9");
  };
  useEffect(() => {
    SetDisabledFields(Preset == 0 ? false : true);
    if (Preset != 0) {
      SetWidth(Presets[Preset - 1].w);
      SetHight(Presets[Preset - 1].h);
    }
  }, [Preset]);

  useLayoutEffect(() => {
    dispatch(SetName("Mneuone | Preview"));
  }, []);

  if (
    SearchParams.get("User_ID") == null ||
    (SearchParams.get("Device_ID") == null &&
      SearchParams.get("Program_Row_Number") == null) ||
    (SearchParams.get("Device_ID") && SearchParams.get("Program_Row_Number"))
  )
    return <Navigate to={"/"} replace={true} />;
  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        p: 0,
        m: 0,
        overflow: "hidden",
      }}
    >
      <AppBar
        // variant="outlined"
        position="static"
        elevation={1}
        sx={{
          backgroundColor: "white",
          py: 1,
        }}
      >
        <Stack
          sx={{
            m: " auto",
            justifyContent: "center",
            alignItems: "center",
          }}
          gap={3}
          direction={"row"}
        >
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <Select
              size="small"
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              // @ts-ignore
              value={Preset}
              onChange={handlePresetChange}
              variant="outlined"
            >
              <MenuItem value={1}>720p (HD TV)</MenuItem>
              <MenuItem value={2}>1080p (Full HD TV)</MenuItem>
              <MenuItem value={3}>1440p (QHD TV)</MenuItem>
              <MenuItem value={4}>2160p (UHD TV)</MenuItem>
              <Divider></Divider>
              <MenuItem value={0}>Custom Preset</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            sx={{
              width: "75px",
            }}
            placeholder="Width"
            variant="standard"
            disabled={disabledFields}
            value={Width}
            onChange={(e) => {
              const regex = new RegExp(/[^\d]/g);
              // @ts-ignore
              e.target.value = Number(e.target.value.replace(regex, ""));
              // @ts-ignore
              if (e.target.value == 0) {
                e.target.value = "";
              }

              if (e.target.value.length == 5) return;
              // @ts-ignore
              SetWidth(e.target.value);
            }}
          />
          <Typography
            variant="overline"
            color={Theme.palette.primary.dark}
            sx={{
              userSelect: "none",
            }}
          >
            X
          </Typography>
          <TextField
            size="small"
            sx={{
              width: "75px",
            }}
            placeholder="Height"
            variant="standard"
            disabled={disabledFields}
            value={Height}
            onChange={(e) => {
              const regex = new RegExp(/[^\d]/g);
              // @ts-ignore
              e.target.value = Number(e.target.value.replace(regex, ""));
              // @ts-ignore
              if (e.target.value == 0) {
                e.target.value = "";
              }

              if (e.target.value.length == 5) return;
              // @ts-ignore
              SetHight(e.target.value);
            }}
          />
          <Tooltip title="Rotate">
            <IconButton size="large" onClick={HandleRotate}>
              <ScreenRotationAltRounded />
            </IconButton>
          </Tooltip>
        </Stack>
      </AppBar>
      <PreviewScreen
        Single={SearchParams.get("Device_ID") ? false : true}
        AspectRatio={AspectRatio}
        Width={Width}
        Height={Height}
      />
    </Stack>
  );
};

export default Preview;
