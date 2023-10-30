import {
  Button,
  FormControl,
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
import { useEffect, useState } from "react";
import IDevice from "../../../types/IDevice";
import { Status as StatusType } from "../../../types/Status";
import ConfirmModal from "../ConfirmModal";
import { Navigate, useNavigate } from "react-router-dom";
interface DevicePanelProps {
  id: string | undefined;
}
const DevicePanel = (props: DevicePanelProps) => {
  const { admin } = useAdminAuth();
  const Theme = useTheme();
  const navigate = useNavigate();
  const { data, error, isLoading, isFetching } = useQuery<IDevice>({
    queryKey: ["Devices", props.id],
    queryFn: () => GetDevicesById(admin?.accessToken, props.id),
  });
  const [Status, SetStatus] = useState<StatusType | "">("Active");
  const [StatusMessage, SetStatusMessage] = useState<string>();
  const [OfflineImage, SetOfflineImage] = useState<string>();
  const [ModalOpen, SetModalOpen] = useState<boolean>(false);
  const [NewData, SetNewData] = useState<object | undefined>(undefined);
  useEffect(() => {
    if (data) {
      SetStatus(data.Status);
      // @ts-ignore

      SetStatusMessage(data.Status_Message);
      // @ts-ignore
      SetOfflineImage(data.Offline_Image);
    }
  }, [data]);
  const handleStatusChange = (event: SelectChangeEvent) => {
    // @ts-ignore
    SetStatus(event.target.value);
  };
  if (isLoading) return <LoadingSpinner />;
  if (isFetching) return <LoadingSpinner />;
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
        }}
      >
        <Stack gap={3}>
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
                      console.log("copied");
                    });
                }}
                sx={{
                  userSelect: "none",
                  cursor: "pointer",
                  width: "max-content",
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
                      console.log("copied");
                    });
                }}
                sx={{
                  userSelect: "none",
                  cursor: "pointer",
                  width: "max-content",
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
                      console.log("copied");
                    });
                }}
                sx={{
                  userSelect: "none",
                  cursor: "pointer",
                  width: "max-content",
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
                width: "max-content",
              }}
              variant="h6"
              id="copy"
            >
              {data?.Last_Online_hit == null
                ? "N/A"
                : moment(data?.Last_Online_hit).format("lll")}
            </Typography>
          </Stack>
          <FormControl
            sx={{
              maxWidth: "350px",
            }}
          >
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
            sx={{
              maxWidth: "350px",
            }}
            placeholder="E.g This Device Is Suspended..."
            label="Suspended Message"
            value={StatusMessage || ""}
            onChange={(e) => SetStatusMessage(e.target.value)}
          />
          <TextField
            sx={{
              maxWidth: "350px",
            }}
            placeholder="E.g https://example.com/offline.png"
            label="Offline Image (URL)"
            value={OfflineImage || ""}
            onChange={(e) => SetOfflineImage(e.target.value)}
          />
          <Button
            sx={{
              ml: "auto",
            }}
            size="large"
            variant="contained"
            onClick={() => {
              SetNewData({
                Status: Status,
                Status_Message: StatusMessage,
                Offline_Image: OfflineImage,
              });
              SetModalOpen(true);
            }}
          >
            Save
          </Button>
        </Stack>
      </Paper>
    </>
  );
};

export default DevicePanel;
