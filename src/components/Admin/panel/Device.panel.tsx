import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useAdminAuth from "../../../hooks/useAdminAuth";
import GetDevicesById from "../../../api/GetDeviceById";
import LoadingSpinner from "../../LoadingSpinner";
import moment from "moment";
import { useEffect, useLayoutEffect, useState } from "react";
import IDevice from "../../../types/IDevice";
import { Status as StatusType } from "../../../types/Status";
import ConfirmModal from "../ConfirmModal";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetName } from "../../../store/slice/Page";
import toast from "react-hot-toast";
import { Visibility } from "@mui/icons-material";

const DevicePanel = (props: { id: string | undefined }) => {
  const { admin } = useAdminAuth();
  const Theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, error, isLoading, isFetching } = useQuery<IDevice>({
    queryKey: ["Devices", props.id],
    queryFn: () => GetDevicesById(admin?.accessToken, props.id),
  });
  const [Status, SetStatus] = useState<StatusType | "">("Active");
  const [StatusMessage, SetStatusMessage] = useState<string>("");
  const [OfflineImage, SetOfflineImage] = useState<string>("");
  const [ModalOpen, SetModalOpen] = useState<boolean>(false);
  const [NewData, SetNewData] = useState<object | undefined>(undefined);
  const [DeviceName, SetDeviceName] = useState<string>("");
  const [DeviceNote, SetDeviceNote] = useState<string>("");
  useEffect(() => {
    if (data) {
      SetStatus(data.Status);
      // @ts-ignore

      SetStatusMessage(data.Status_Message);
      // @ts-ignore
      SetOfflineImage(data.Offline_Image);
      SetDeviceName(data.Device_Name);
      SetDeviceNote(data.Device_Note);
    }
  }, [data]);
  const handleStatusChange = (event: SelectChangeEvent) => {
    // @ts-ignore
    SetStatus(event.target.value);
  };
  useLayoutEffect(() => {
    dispatch(SetName("Menuone | Device Details"));
  });
  if (isLoading) return <LoadingSpinner />;
  if (error) return <Navigate to={"/admin/device"} replace={true} />;

  return (
    <>
      {NewData && (
        <ConfirmModal
          open={ModalOpen}
          SetOpen={SetModalOpen}
          endpoint={`/?id=${props.id}`}
          method="patch"
          data={NewData}
          title="Are You Sure That You Want To Save ?"
          text="If you save these changes they will be instantly applied to if the device is active and online."
          Cachekey={["devices", props.id]}
          redirect="/admin/device"
        />
      )}

      <Paper
        className="FancyBoxShadow"
        sx={{
          mt: Theme.spacing(3),
          p: Theme.spacing(3),
          m: "auto",
          maxWidth: "650px",
        }}
      >
        <Stack gap={3}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h6">Device Info</Typography>

            <Tooltip title="Preview">
              <IconButton
                onClick={() =>
                  navigate(
                    `/preview?${
                      data?.User_ID ? `User_ID=${data?.User_ID}` : ""
                    }${data?.Device_ID ? `&Device_ID=${data.Device_ID}` : ""}`
                  )
                }
                color="primary"
                size="large"
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack>
            <Typography
              sx={{
                userSelect: "none",
              }}
              variant="subtitle1"
            >
              User ID
            </Typography>
            <Tooltip title="Copy To Clipboard">
              <Typography
                onClick={(e) => {
                  navigator.clipboard
                    .writeText(
                      // @ts-ignore
                      e.currentTarget.textContent
                    )
                    .then(() => {
                      toast.success("Copied To Clipboard");
                    })
                    .catch(() => {
                      toast.error("Failed To Copy To Clipboard");
                    });
                }}
                sx={{
                  userSelect: "none",
                  cursor: "pointer",
                  width: "fit-content",
                }}
                variant="h6"
                id="copy"
              >
                {data?.User_ID}
              </Typography>
            </Tooltip>
          </Stack>
          <Stack>
            <Typography
              sx={{
                userSelect: "none",
                width: "fit-content",
              }}
              variant="subtitle1"
            >
              ID
            </Typography>
            <Tooltip title="Copy To Clipboard">
              <Typography
                onClick={(e) => {
                  navigator.clipboard
                    .writeText(
                      // @ts-ignore
                      e.currentTarget.textContent
                    )
                    .then(() => {
                      toast.success("Copied To Clipboard");
                    })
                    .catch(() => {
                      toast.error("Failed To Copy To Clipboard");
                    });
                }}
                sx={{
                  userSelect: "none",
                  cursor: "pointer",
                }}
                variant="h6"
                id="copy"
              >
                {data?.Device_ID}
              </Typography>
            </Tooltip>
          </Stack>
          <Stack>
            <Typography
              sx={{
                userSelect: "none",
              }}
              variant="subtitle1"
            >
              Token
            </Typography>
            <Tooltip title="Copy To Clipboard">
              <Typography
                onClick={(e) => {
                  navigator.clipboard
                    .writeText(
                      // @ts-ignore
                      e.currentTarget.textContent
                    )
                    .then(() => {
                      toast.success("Copied To Clipboard");
                    })
                    .catch(() => {
                      toast.error("Failed To Copy To Clipboard");
                    });
                }}
                sx={{
                  userSelect: "none",
                  cursor: "pointer",
                  width: "fit-content",
                }}
                variant="h6"
                id="copy"
              >
                {data?.Device_Token}
              </Typography>
            </Tooltip>
          </Stack>
          <Stack>
            <Typography
              sx={{
                userSelect: "none",
              }}
              variant="subtitle1"
            >
              Connection
            </Typography>
            <Typography
              sx={{
                userSelect: "none",
                width: "max-content",
                py: Theme.spacing(1),
                px: Theme.spacing(2),
                borderRadius: "24px",
                background: data?.connectionID ? "green" : "red",
                color: Theme.palette.grey[100],
              }}
              variant="h6"
              id="copy"
            >
              <Typography
                fontSize={15}
                fontWeight={"bold"}
                textTransform={"uppercase"}
              >
                {data?.connectionID ? "Online" : "Offline"}
              </Typography>
            </Typography>
          </Stack>
          <Stack>
            <Typography
              sx={{
                userSelect: "none",
              }}
              variant="subtitle1"
            >
              Last Online
            </Typography>
            <Typography
              sx={{
                userSelect: "none",
              }}
              variant="h6"
              id="copy"
            >
              {data?.connectionID
                ? moment(Date.now()).format("lll")
                : data?.Last_Online_hit == null
                ? "N/A"
                : moment(data?.Last_Online_hit).format("lll")}
            </Typography>
          </Stack>
          <TextField
            error={NewData && !DeviceName ? true : false}
            helperText={
              NewData && !DeviceName
                ? "Device Name Is Required Field"
                : undefined
            }
            label="Device Name*"
            value={DeviceName || ""}
            onChange={(e) => SetDeviceName(e.target.value)}
          />
          <TextField
            multiline
            rows={4}
            label="Device Description"
            value={DeviceNote || ""}
            onChange={(e) => SetDeviceNote(e.target.value)}
          />
          <FormControl>
            <InputLabel id="Status_Select-label">Status</InputLabel>
            <Select
              labelId="Status_Select-label"
              id="Status_Select"
              value={Status}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value={"Active"}>Active</MenuItem>
              <MenuItem value={"Suspended"}>Suspended</MenuItem>
            </Select>
          </FormControl>
          <TextField
            placeholder="E.g This Device Is Suspended..."
            label="Suspended Message"
            value={StatusMessage || ""}
            onChange={(e) => SetStatusMessage(e.target.value)}
          />
          <TextField
            placeholder="E.g https://example.com/offline.png"
            label="Offline Image (URL)"
            value={OfflineImage || ""}
            onChange={(e) => SetOfflineImage(e.target.value)}
          />
          <Button
            size="large"
            variant="contained"
            onClick={() => {
              SetNewData({
                Status: Status,
                Status_Message: StatusMessage,
                Offline_Image: OfflineImage,
                Device_Name: DeviceName,
                Device_Note: DeviceNote,
              });
              if (DeviceName.length == 0)
                return toast.error(
                  "Error: Please Fill All The Empty Fields.",
                  {}
                );

              SetModalOpen(true);
            }}
          >
            Update
          </Button>
        </Stack>
      </Paper>
    </>
  );
};

export default DevicePanel;
