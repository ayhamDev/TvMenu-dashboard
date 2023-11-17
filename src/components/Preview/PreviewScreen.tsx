import { Paper, Box, BoxProps } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import useAdminAuth from "../../hooks/useAdminAuth";
import GetProgramById from "../../api/GetProgramById";
import GetDevicesById from "../../api/GetDeviceById";
import GetPrograms from "../../api/GetPrograms";
import LoadingSpinner from "../LoadingSpinner";
import { motion } from "framer-motion";
import { AdminMotionProps } from "../../utils/ConfigMotion";
import AnimatedProgram from "./AnimatedProgram";

export type TypeAspectRatio = "16/9" | "9/16";
interface IPreviewScreenProps {
  AspectRatio: TypeAspectRatio;
  Height: number;
  Width: number;
  Single: boolean;
}
interface IndexableObject {
  [key: string]: number;
}
const AspectRatioList: IndexableObject = {
  "16/9": 16 / 9,
  "9/16": 9 / 16,
};

const PreviewScreen = React.memo((props: IPreviewScreenProps) => {
  const ScreenBody = useRef<HTMLDivElement | null>(null);
  const ScreenPaper = useRef<HTMLDivElement | null>(null);
  const { admin } = useAdminAuth();
  const [SearchParams, SetSearchParams] = useSearchParams();
  const { data, isLoading, status } = useQuery({
    queryKey: props.Single
      ? ["Programs", SearchParams.get("Program_Row_Number")]
      : ["Programs", { Device_ID: SearchParams.get("Device_ID") }],
    queryFn: props.Single
      ? () =>
          GetProgramById(
            admin.accessToken,
            SearchParams.get("Program_Row_Number") || ""
          )
      : () =>
          GetPrograms(admin.accessToken, {
            Device_ID: SearchParams.get("Device_ID"),
          }),
  });

  const HandleSizeChange = () => {
    if (!ScreenBody.current || !ScreenPaper.current) return null;

    // Calculate new width and height while considering the maximum width
    const maxWidth = ScreenBody.current.clientWidth - 80; // Replace with your desired maximum width
    const maxHeight = ScreenBody.current.clientHeight - 80; // Replace with your desired maximum height
    const Height = Math.min(
      ScreenBody.current.clientWidth / AspectRatioList[props.AspectRatio],
      maxHeight
    );
    const Width = Math.min(
      Height * AspectRatioList[props.AspectRatio],
      maxWidth
    );

    ScreenPaper.current.style.width = `${Width}px`;
    ScreenPaper.current.style.height = `${Height}px`;
  };

  useEffect(() => {
    if (ScreenBody.current && ScreenPaper.current) {
      HandleSizeChange();
      window.addEventListener("resize", HandleSizeChange);
    }
    return () => {
      window.removeEventListener("resize", HandleSizeChange);
    };
  }, [ScreenBody, ScreenPaper, props.AspectRatio, isLoading]);
  if (isLoading) return <LoadingSpinner />;
  const Programs = Array.isArray(data) ? [...data] : [data];
  if (status == "error") return <Navigate to={"/"} replace={true} />;
  return (
    <Box
      ref={ScreenBody}
      sx={{
        flex: 1,
        display: "flex",
        p: 5,
      }}
    >
      <Paper
        ref={ScreenPaper}
        className="FancyBoxShadow"
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 0,
          m: "auto",
          display: "flex",
        }}
      >
        {Programs.map((program, index) => (
          <AnimatedProgram
            key={index}
            {...program}
            Width={props.AspectRatio === "16/9" ? props.Width : props.Height}
            Height={props.AspectRatio === "16/9" ? props.Height : props.Width}
            aspe
          />
        ))}
      </Paper>
    </Box>
  );
});

export default PreviewScreen;
