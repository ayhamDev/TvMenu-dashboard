import { motion } from "framer-motion";
import React, {
  FormEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AdminMotionProps } from "../../../utils/ConfigMotion";
import {
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { useDispatch } from "react-redux";
import { SetName } from "../../../store/slice/Page";
import { ArrowBackIosRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import IUser from "../../../types/IUser";
import { useQuery } from "@tanstack/react-query";
import useAdminAuth from "../../../hooks/useAdminAuth";
import GetUsers from "../../../api/GetUsers";
import GetDevices from "../../../api/GetDevices";
import IDevice from "../../../types/IDevice";
import {
  DateTimePicker,
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import moment, { Moment, duration } from "moment";
import { Status as StatusType } from "../../../types/Status";
import api from "../../../api/API";
import EnterAnimations from "../../../utils/EnterAnimations";
import TypeEnterAnimations from "../../../types/EnterAnimations";
import TypeLeaveAnimations from "../../../types/LeaveAnimations";
import LeaveAnimations from "../../../utils/LeaveAnimations";
import ConfirmModal from "../../../components/Admin/ConfirmModal";
import toast from "react-hot-toast";
import IProgram from "../../../types/IProgram";
import UnitMenu from "../../../components/Admin/UnitMenu";
import TimeMenu from "../../../components/Admin/TimeMenu";

const CreateProgram = () => {
  const Theme = useTheme();
  const Dispatch = useDispatch();
  const navigate = useNavigate();

  const ProgramName = useRef<HTMLInputElement | null>(null);
  const ProgramNotes = useRef<HTMLInputElement | null>(null);
  const DeviceToken = useRef<HTMLInputElement | null>(null);

  const WebUrl = useRef<HTMLInputElement | null>(null);
  const ImageUrl = useRef<HTMLInputElement | null>(null);
  const VideoUrl = useRef<HTMLInputElement | null>(null);

  const XRef = useRef<HTMLInputElement | null>(null);
  const YRef = useRef<HTMLInputElement | null>(null);
  const LayerNumber = useRef<HTMLInputElement | null>(null);
  const Width = useRef<HTMLInputElement | null>(null);
  const Height = useRef<HTMLInputElement | null>(null);

  const Duration = useRef<HTMLInputElement | null>(null);
  const Loop = useRef<HTMLInputElement | null>(null);

  const [ProgramType, SetProgramType] = useState<number>(1);
  const [ProgramStatus, SetProgramStatus] = useState<StatusType>("Active");
  const [UsersOpen, SetUsersOpen] = useState<boolean>(false);
  const [UsersOptions, SetUsersOptions] = useState<readonly IUser[]>([]);
  const [User, SetUser] = useState<IUser | null>(null);
  const [DevicesOptions, SetDevicesOptions] = useState<readonly IDevice[]>([]);
  const [DevicesSelected, SetDevicesSelected] = useState<IDevice[]>([]);

  const [StartDateTime, SetStartDateTime] = useState<number | null>(null);
  const [EndDateTime, SetEndDateTime] = useState<number | null>(null);

  const [openEnterAnimation, SetOpenEnterAnimation] = useState<boolean>(false);
  const [EnterAnimation, SetEnterAnimation] =
    useState<TypeEnterAnimations>("fadeIn");

  const [openLeaveAnimation, SetOpenLeaveAnimation] = useState<boolean>(false);
  const [LeaveAnimation, SetLeaveAnimation] =
    useState<TypeLeaveAnimations>("fadeOut");

  const [X_Unit, SetX_Unit] = useState<Units>("px");
  const [Y_Unit, SetY_Unit] = useState<Units>("px");

  const [Width_Unit, SetWidth_Unit] = useState<Units>("px");
  const [Height_Unit, SetHeight_Unit] = useState<Units>("px");

  const [Duration_Unit, SetDuration_Unit] = useState<Times>("Seconds");
  const [Loop_Unit, SetLoop_Unit] = useState<Times>("Seconds");

  const [Form, SetForm] = useState<IProgram>({
    Device_ID: DevicesSelected.map((device) => device.Device_ID),
    Device_Token: DeviceToken.current?.value,
    User_ID: User?.User_ID,
    Program_Name: ProgramName.current?.value,
    Program_Note: ProgramNotes.current?.value,
    Program_Type: ProgramType,
    Program_Web_Url: WebUrl.current?.value,
    Program_Image_Url: ImageUrl.current?.value,
    Program_MP4_Url: VideoUrl.current?.value,
    Program_Status: ProgramStatus,
    Program_X: `${XRef.current?.value}${X_Unit == "%" ? "%" : ""}`,
    Program_Y: `${YRef.current?.value}${Y_Unit == "%" ? "%" : ""}`,
    Program_W: `${Width.current?.value}${Width_Unit == "%" ? "%" : ""}`,
    Program_H: `${Height.current?.value}${Height_Unit == "%" ? "%" : ""}`,
    Program_Layer_Number: LayerNumber.current?.value,
    Start_DateTime: StartDateTime,
    End_DateTime: EndDateTime,
    // @ts-ignore
    Program_Duration:
      Duration_Unit == "Seconds"
        ? // @ts-ignore
          Number(Duration.current?.value)
        : Duration_Unit == "Minute"
        ? Number(Duration.current?.value) * 60
        : Number(Duration.current?.value) * 60 * 60,
    // @ts-ignore
    Next_Loop_Seconds:
      Duration_Unit == "Seconds"
        ? // @ts-ignore
          Number(Loop.current?.value)
        : Loop_Unit == "Minute"
        ? Number(Loop.current?.value) * 60
        : Number(Loop.current?.value) * 60 * 60,
    Program_Transition: EnterAnimation,
    Program_Transition_End: LeaveAnimation,
  });

  const [Open, SetOpen] = useState<boolean>(false);
  const [FormSubmited, SetFormSubmited] = useState(false);
  const { admin } = useAdminAuth();

  const {
    data: Users,
    isLoading: loading,
    error: UsersError,
  } = useQuery<IUser[]>({
    queryKey: ["Users"],
    queryFn: () => GetUsers(admin?.accessToken),
  });
  const {
    data: Devices,
    isLoading: Devicesloading,
    isFetching: isDevicesFetching,
    error: DevicesError,
  } = useQuery<IDevice[]>({
    queryKey: [`Devices`, { user: User?.User_ID }],
    queryFn: () =>
      GetDevices(admin?.accessToken, {
        User_ID: User?.User_ID,
      }),
    enabled: User == null ? false : true,
  });

  useLayoutEffect(() => {
    Dispatch(SetName("Menuone | New Program"));
  }, []);
  useEffect(() => {
    if (Users) {
      SetUsersOptions(Users.filter((user: IUser) => user.Role != "Admin"));
    }
  }, [Users]);
  useEffect(() => {
    if (Devices) {
      SetDevicesOptions(Devices);
    } else {
      SetDevicesOptions([]);
    }
  }, [Devices]);
  const HandleSubmit = async () => {
    try {
      SetFormSubmited(true);

      SetForm({
        Device_ID: DevicesSelected.map((device) => device.Device_ID),
        Device_Token: DeviceToken.current?.value,
        User_ID: User?.User_ID,
        Program_Name: ProgramName.current?.value,
        Program_Note: ProgramNotes.current?.value,
        Program_Type: ProgramType,
        Program_Web_Url: WebUrl.current?.value,
        Program_Image_Url: ImageUrl.current?.value,
        Program_MP4_Url: VideoUrl.current?.value,
        Program_Status: ProgramStatus,
        Program_X: `${XRef.current?.value}${X_Unit == "%" ? "%" : ""}`,
        Program_Y: `${YRef.current?.value}${Y_Unit == "%" ? "%" : ""}`,
        Program_W: `${Width.current?.value}${Width_Unit == "%" ? "%" : ""}`,
        Program_H: `${Height.current?.value}${Height_Unit == "%" ? "%" : ""}`,
        Program_Layer_Number: LayerNumber.current?.value,
        Start_DateTime: StartDateTime,
        End_DateTime: EndDateTime,
        // @ts-ignore
        Program_Duration:
          Duration_Unit == "Seconds"
            ? // @ts-ignore
              Number(Duration.current?.value)
            : Duration_Unit == "Minute"
            ? Number(Duration.current?.value) * 60
            : Number(Duration.current?.value) * 60 * 60,
        // @ts-ignore
        Next_Loop_Seconds:
          Loop_Unit == "Seconds"
            ? // @ts-ignore
              Number(Loop.current?.value)
            : Loop_Unit == "Minute"
            ? Number(Loop.current?.value) * 60
            : Number(Loop.current?.value) * 60 * 60,
        Program_Transition: EnterAnimation,
        Program_Transition_End: LeaveAnimation,
      });
      if (
        !DeviceToken.current?.value ||
        !User?.User_ID ||
        !ProgramName.current?.value ||
        !ProgramNotes.current?.value ||
        !ProgramType ||
        !ProgramStatus ||
        !XRef.current?.value ||
        !YRef.current?.value ||
        !Width.current?.value ||
        !Height.current?.value ||
        !LayerNumber.current?.value ||
        !StartDateTime ||
        !EndDateTime ||
        !Duration.current?.value ||
        !Loop.current?.value ||
        !EnterAnimation ||
        !LeaveAnimation
      )
        return toast.error("Error: Please Fill All The Empty Fields.", {});
      SetOpen(true);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <ConfirmModal
        open={Open}
        SetOpen={SetOpen}
        data={Form}
        endpoint={"/program"}
        title={"Are You Sure You Want To Create This Program ?"}
        text={"Creating this program may cause unexpectecd behavior"}
        method={"post"}
        Cachekey={["Programs"]}
        redirect="/admin/program"
      />

      <motion.div {...AdminMotionProps}>
        <Stack direction={"row"} alignItems={"center"} gap={Theme.spacing(2)}>
          <IconButton
            sx={{
              padding: 0,
              margin: 0,
              width: "50px",
              height: "50px",
            }}
            onClick={() => navigate("/admin/program")}
          >
            <ArrowBackIosRounded />
          </IconButton>
          <Typography variant="h5">New Program</Typography>
        </Stack>
        <Paper
          className="FancyBoxShadow"
          sx={{
            maxWidth: "650px",
            margin: "auto",
            mt: Theme.spacing(3),
            p: Theme.spacing(3),
          }}
        >
          <Stack gap={Theme.spacing(3)}>
            <Typography variant="h6">General</Typography>
            <TextField
              inputRef={ProgramName}
              label="Program Name"
              placeholder="E.g Primary Menu"
              error={FormSubmited ? (Form.Program_Name ? false : true) : false}
              helperText={
                FormSubmited
                  ? Form.Program_Name
                    ? false
                    : "Program Name Cant be Empty"
                  : false
              }
            />
            <TextField
              inputRef={ProgramNotes}
              label="Program Notes"
              placeholder="Notes..."
              rows={4}
              multiline
              error={FormSubmited ? (Form.Program_Note ? false : true) : false}
              helperText={
                FormSubmited
                  ? Form.Program_Note
                    ? false
                    : "Program Notes Cant be Empty"
                  : false
              }
            />
            <Autocomplete
              sx={{
                flex: 1,
              }}
              id="UserSelect"
              open={UsersOpen}
              onOpen={() => {
                SetUsersOpen(true);
              }}
              onClose={() => {
                SetUsersOpen(false);
              }}
              isOptionEqualToValue={(option, value) =>
                option.User_ID === value.User_ID
              }
              onChange={(e, value) => {
                // console.log(DevicesSelected[0]?.User_ID != value?.User_ID);

                if (DevicesSelected[0]?.User_ID != value?.User_ID) {
                  SetDevicesSelected([]);
                }

                SetUser(value);
              }}
              getOptionLabel={(option) => option.email}
              options={UsersOptions}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  error={FormSubmited ? (Form.User_ID ? false : true) : false}
                  helperText={
                    FormSubmited
                      ? Form.User_ID
                        ? false
                        : "Please Select The Client For This Program"
                      : false
                  }
                  {...params}
                  label="Select a Client"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
            <Autocomplete
              sx={{
                flex: 1,
              }}
              multiple
              id="devices"
              options={DevicesOptions}
              disableCloseOnSelect
              disabled={Devices?.length == 0 ? true : false}
              onChange={(e, value) => {
                // console.log(value);
                SetDevicesSelected(value);
              }}
              value={DevicesSelected}
              getOptionLabel={(option) => option.Device_ID}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  {option.Device_ID}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={Devices?.length == 0 ? "No Devices" : "Choose Devices"}
                  placeholder="Choose Devices"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {Devicesloading && isDevicesFetching ? (
                          <CircularProgress size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
            <TextField
              inputRef={DeviceToken}
              label="Device Token"
              placeholder="Token..."
              error={FormSubmited ? (Form.Device_Token ? false : true) : false}
              helperText={
                FormSubmited
                  ? Form.Device_Token
                    ? false
                    : "Device Token Cant Be Empty"
                  : false
              }
            />
            <Typography variant="h6">Program</Typography>
            <FormControl fullWidth>
              <InputLabel id="program-type-select">Program Type</InputLabel>
              <Select
                labelId="program-type-select"
                id="demo-simple-select"
                // @ts-ignore
                value={ProgramType || ""}
                label="Program Type"
                onChange={(event: SelectChangeEvent) => {
                  // @ts-ignore
                  SetProgramType(event.target.value as number);
                }}
                error={
                  FormSubmited ? (Form.Program_Type ? false : true) : false
                }
              >
                <MenuItem value={1}>Web</MenuItem>
                <MenuItem value={2}>Image</MenuItem>
                <MenuItem value={3}>Video</MenuItem>
              </Select>
            </FormControl>
            <TextField inputRef={WebUrl} label="Web Url" />
            <TextField inputRef={ImageUrl} label="Image Url" />
            <TextField inputRef={VideoUrl} label="Video Url" />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Program Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // @ts-ignore
                value={ProgramStatus}
                label="Program Status"
                onChange={(event: SelectChangeEvent) => {
                  // @ts-ignore
                  SetProgramStatus(event.target.value as number);
                }}
                error={
                  FormSubmited ? (Form.Program_Status ? false : true) : false
                }
              >
                <MenuItem value={"Active"}>Active</MenuItem>
                <MenuItem value={"Suspended"}>Suspended</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="h6">Size & Position</Typography>
            <Stack direction={"row"} gap={Theme.spacing(3)} flexWrap={"wrap"}>
              <Stack
                direction={"row"}
                sx={{
                  flex: 1,
                }}
              >
                <TextField
                  sx={{
                    flex: 1,
                    minWidth: "180px",
                  }}
                  label="X"
                  placeholder="Number"
                  inputRef={XRef}
                  inputMode="numeric"
                  onChange={(event) => {
                    const regex = new RegExp(/[^\d]/g);
                    event.target.value = event.target.value.replace(regex, "");
                  }}
                  error={FormSubmited ? (Form.Program_X ? false : true) : false}
                  helperText={
                    FormSubmited
                      ? Form.Program_X
                        ? false
                        : "Program X Coordinates Cant Be Empty"
                      : false
                  }
                />
                <UnitMenu value={X_Unit} SetValue={SetX_Unit} />
              </Stack>
              <Stack
                direction={"row"}
                sx={{
                  flex: 1,
                }}
              >
                <TextField
                  sx={{
                    flex: 1,
                    minWidth: "180px",
                  }}
                  label="Y"
                  placeholder="Number"
                  inputRef={YRef}
                  inputMode="numeric"
                  onChange={(event) => {
                    const regex = new RegExp(/[^\d]/g);
                    event.target.value = event.target.value.replace(regex, "");
                  }}
                  error={FormSubmited ? (Form.Program_Y ? false : true) : false}
                  helperText={
                    FormSubmited
                      ? Form.Program_Y
                        ? false
                        : "Program Y Coordinates Cant Be Empty"
                      : false
                  }
                />
                <UnitMenu value={Y_Unit} SetValue={SetY_Unit} />
              </Stack>
            </Stack>

            <Stack direction={"row"} gap={Theme.spacing(3)} flexWrap={"wrap"}>
              {" "}
              <Stack
                direction={"row"}
                sx={{
                  flex: 1,
                }}
              >
                <TextField
                  sx={{
                    flex: 1,
                    minWidth: "180px",
                  }}
                  label="Width"
                  placeholder="Number"
                  inputRef={Width}
                  inputMode="numeric"
                  onChange={(event) => {
                    const regex = new RegExp(/[^\d]/g);
                    event.target.value = event.target.value.replace(regex, "");
                  }}
                  error={FormSubmited ? (Form.Program_W ? false : true) : false}
                  helperText={
                    FormSubmited
                      ? Form.Program_W
                        ? false
                        : "Program Width Cant Be Empty"
                      : false
                  }
                />
                <UnitMenu value={Width_Unit} SetValue={SetWidth_Unit} />
              </Stack>
              <Stack
                direction={"row"}
                sx={{
                  flex: 1,
                }}
              >
                <TextField
                  sx={{
                    flex: 1,
                    minWidth: "180px",
                  }}
                  label="Height"
                  placeholder="Number"
                  inputRef={Height}
                  inputMode="numeric"
                  onChange={(event) => {
                    const regex = new RegExp(/[^\d]/g);
                    event.target.value = event.target.value.replace(regex, "");
                  }}
                  error={FormSubmited ? (Form.Program_H ? false : true) : false}
                  helperText={
                    FormSubmited
                      ? Form.Program_H
                        ? false
                        : "Program Height Cant Be Empty"
                      : false
                  }
                />
                <UnitMenu value={Height_Unit} SetValue={SetHeight_Unit} />
              </Stack>
            </Stack>
            <Stack
              direction={"row"}
              sx={{
                flex: 1,
              }}
            >
              <TextField
                label="Layer Number"
                placeholder="Number"
                inputRef={LayerNumber}
                inputMode="numeric"
                fullWidth
                onChange={(event) => {
                  const regex = new RegExp(/[^\d]/g);
                  event.target.value = event.target.value.replace(regex, "");
                }}
                error={
                  FormSubmited
                    ? Form.Program_Layer_Number
                      ? false
                      : true
                    : false
                }
                helperText={
                  FormSubmited
                    ? Form.Program_Layer_Number
                      ? false
                      : "Program Layer Number Cant Be Empty"
                    : false
                }
              />
            </Stack>
            <Typography variant="h6">Transitions</Typography>
            <Stack direction={"row"} gap={Theme.spacing(3)} flexWrap={"wrap"}>
              <Autocomplete
                sx={{
                  flex: 1,
                  minWidth: "150px",
                }}
                id="EnterAnimationSelect"
                open={openEnterAnimation}
                onOpen={() => {
                  SetOpenEnterAnimation(true);
                }}
                onClose={() => {
                  SetOpenEnterAnimation(false);
                }}
                isOptionEqualToValue={(option, value) => option === value}
                onChange={(e, value) => {
                  // @ts-ignore
                  SetEnterAnimation(value);
                }}
                getOptionLabel={(option) => option}
                options={EnterAnimations}
                value={EnterAnimation}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={
                      FormSubmited
                        ? Form.Program_Transition
                          ? false
                          : true
                        : false
                    }
                    helperText={
                      FormSubmited
                        ? Form.Program_Transition
                          ? false
                          : "Program Transition Coordinates Cant Be Empty"
                        : false
                    }
                    label="Enter Transition"
                  />
                )}
              />
              <Autocomplete
                sx={{
                  flex: 1,
                  minWidth: "150px",
                }}
                id="EnterAnimationSelect"
                open={openLeaveAnimation}
                onOpen={() => {
                  SetOpenLeaveAnimation(true);
                }}
                onClose={() => {
                  SetOpenLeaveAnimation(false);
                }}
                isOptionEqualToValue={(option, value) => option === value}
                onChange={(e, value) => {
                  // @ts-ignore
                  SetLeaveAnimation(value);
                }}
                getOptionLabel={(option) => option}
                options={LeaveAnimations}
                value={LeaveAnimation}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={
                      FormSubmited
                        ? Form.Program_Transition_End
                          ? false
                          : true
                        : false
                    }
                    helperText={
                      FormSubmited
                        ? Form.Program_Transition_End
                          ? false
                          : "Program Transition Coordinates Cant Be Empty"
                        : false
                    }
                    label="Leave Transition"
                  />
                )}
              />
            </Stack>
            <Typography variant="h6">Time & Duration</Typography>
            <Stack direction={"row"} gap={Theme.spacing(3)} flexWrap={"wrap"}>
              <LocalizationProvider
                dateAdapter={AdapterMoment}
                adapterLocale="en"
              >
                <MobileDateTimePicker
                  label="Starts At"
                  sx={{
                    flex: 1,
                    minWidth: "180px",
                  }}
                  value={moment(StartDateTime)}
                  onChange={(value) => {
                    SetStartDateTime(
                      new Date(moment(value).toString()).getTime()
                    );
                  }}
                  slots={{
                    textField: (params) => (
                      <TextField
                        error={
                          FormSubmited
                            ? Form.Start_DateTime
                              ? false
                              : true
                            : false
                        }
                        helperText={
                          FormSubmited
                            ? Form.Start_DateTime
                              ? false
                              : "Program Start Date Cant Be Empty"
                            : false
                        }
                        {...params}
                        sx={{ width: "100%" }}
                      />
                    ),
                  }}
                />
                <MobileDateTimePicker
                  label="Ends At"
                  sx={{
                    flex: 1,
                    minWidth: "180px",
                  }}
                  value={moment(EndDateTime)}
                  onChange={(value) => {
                    SetEndDateTime(
                      new Date(moment(value).toString()).getTime()
                    );
                  }}
                  slots={{
                    textField: (params) => (
                      <TextField
                        error={
                          FormSubmited
                            ? Form.End_DateTime
                              ? false
                              : true
                            : false
                        }
                        helperText={
                          FormSubmited
                            ? Form.End_DateTime
                              ? false
                              : "Program End Date Cant Be Empty"
                            : false
                        }
                        {...params}
                        sx={{ width: "100%" }}
                      />
                    ),
                  }}
                />
              </LocalizationProvider>
            </Stack>
            <Stack direction={"row"}>
              <TextField
                fullWidth
                label="Duration"
                placeholder="In Seconds"
                inputRef={Duration}
                inputMode="numeric"
                onChange={(event) => {
                  const regex = new RegExp(/[^\d]/g);
                  event.target.value = event.target.value.replace(regex, "");
                }}
                error={
                  FormSubmited ? (Form.Program_Duration ? false : true) : false
                }
                helperText={
                  FormSubmited
                    ? Form.Program_Duration
                      ? false
                      : "Program Duration Date Cant Be Empty"
                    : false
                }
              />
              <TimeMenu value={Duration_Unit} SetValue={SetDuration_Unit} />
            </Stack>
            <Stack direction={"row"}>
              <TextField
                fullWidth
                label="Loop"
                placeholder="In Seconds"
                inputRef={Loop}
                inputMode="numeric"
                onChange={(event) => {
                  const regex = new RegExp(/[^\d]/g);
                  event.target.value = event.target.value.replace(regex, "");
                }}
                error={
                  FormSubmited ? (Form.Next_Loop_Seconds ? false : true) : false
                }
                helperText={
                  FormSubmited
                    ? Form.Next_Loop_Seconds
                      ? false
                      : "Program Loop Cant Be Empty"
                    : false
                }
              />
              <TimeMenu value={Loop_Unit} SetValue={SetLoop_Unit} />
            </Stack>

            <Button
              onClick={HandleSubmit}
              variant="contained"
              fullWidth
              size="large"
            >
              Create
            </Button>
          </Stack>
        </Paper>
      </motion.div>
    </>
  );
};

export default CreateProgram;
