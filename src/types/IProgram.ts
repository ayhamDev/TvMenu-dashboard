import TypeEnterAnimations from "./EnterAnimations";
import TypeLeaveAnimations from "./LeaveAnimations";
import { Status } from "./Status";

export default interface IProgram {
  Device_ID: string[];
  Device_Token: string | undefined;
  User_ID: string | undefined;
  Program_Name: string | undefined;
  Program_Note: string | undefined;
  Program_Type: number;
  Program_Web_Url: string | undefined;
  Program_Image_Url: string | undefined;
  Program_MP4_Url: string | undefined;
  Program_Status: Status;
  Program_X: string | undefined;
  Program_Y: string | undefined;
  Program_W: string | undefined;
  Program_H: string | undefined;
  Program_Layer_Number: string | undefined;
  Start_DateTime: number | null;
  End_DateTime: number | null;
  Program_Duration: string | undefined;
  Next_Loop_Seconds: string | undefined;
  Program_Transition: TypeEnterAnimations;
  Program_Transition_End: TypeLeaveAnimations;
}
