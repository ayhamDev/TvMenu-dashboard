import IProgram from "../../types/IProgram";
import { Box } from "@mui/material";
import MenuImage from "./MenuImage";
import MenuVideo from "./MenuVideo";
import MenuWeb from "./MenuWeb";
import { useEffect, useState } from "react";
import TypeEnterAnimations from "../../types/EnterAnimations";
import TypeLeaveAnimations from "../../types/LeaveAnimations";
import Sleep from "../../utils/Sleep";

const ProgramSelector = (props: IProgram) => {
  if (props.Program_Type == 1) return <MenuWeb url={props.Program_Web_Url} />;
  if (props.Program_Type == 2)
    return <MenuImage url={props.Program_Image_Url} />;
  if (props.Program_Type == 3) return <MenuVideo url={props.Program_MP4_Url} />;
};

interface AnimatedProgram extends IProgram {
  Width: number;
  Height: number;
}

const AnimatedProgram = (props: AnimatedProgram) => {
  const [hidden, SetHidden] = useState<boolean>(true);
  const [Animation, SetAnimation] = useState<
    TypeEnterAnimations | TypeLeaveAnimations
  >(!props.Program_Transition ? "fadeIn" : props.Program_Transition);

  const { Width, Height, ...program } = props;

  const top = props.Program_Y?.includes("%")
    ? props.Program_Y
    : `${(Number(props.Program_Y) / Height) * 100}%`;
  const left = props.Program_X?.includes("%")
    ? props.Program_X
    : `${(Number(props.Program_X) / Width) * 100}%`;

  const width = props.Program_W?.includes("%")
    ? props.Program_W
    : `${(Number(props.Program_W) / Width) * 100}%`;
  const height = props.Program_H?.includes("%")
    ? props.Program_H
    : `${(Number(props.Program_H) / Height) * 100}%`;

  const CheckForTime = async () => {
    // @ts-ignore
    if (props.Program_Duration != 0) {
      SetHidden(false);
      SetAnimation(props.Program_Transition);
      // @ts-ignore
      await Sleep((2 + props.Program_Duration) * 1000);
      SetAnimation(props.Program_Transition_End);
      // @ts-ignore
      await Sleep(props.Next_Loop_Seconds * 1000);
      CheckForTime();
    } else {
      SetAnimation(props.Program_Transition);
      SetHidden(false);
    }
  };
  useEffect(() => {
    CheckForTime();
  }, []);

  if (hidden) return null;
  return (
    <Box
      className={`animate__animated animate__${Animation}`}
      sx={{
        m: "auto",
        display: "flex",
        position: "absolute",
        zIndex: Number(props.Program_Layer_Number),
        top,
        left,
        width,
        height,
      }}
    >
      <ProgramSelector {...program} />
    </Box>
  );
};

export default AnimatedProgram;
