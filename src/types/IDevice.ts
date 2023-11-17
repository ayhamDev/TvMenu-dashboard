import { Status } from "./Status";

interface IDevice {
  User_ID: string;
  connectionID: string | null;
  Offline_Image: string | null;
  Status: Status;
  Status_Message: string | null;
  Device_ID: string;
  Device_Token: string;
  Last_Online_hit: Date | null;
  Device_Name: string;
  Device_Note: string;
}
export default IDevice;
