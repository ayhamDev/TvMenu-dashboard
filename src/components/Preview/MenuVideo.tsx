import { Box, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import "animate.css";

const MenuVideo = (props: { url: string | undefined }) => {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <>
      {loading && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <video
        loop={true}
        controls={false}
        autoPlay={true}
        muted={true}
        style={{
          display: loading ? "none" : "block",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          top: 0,
          flex: 1,
        }}
        onCanPlay={(e) => {
          setLoading(false);
          const video = e.target as HTMLVideoElement;
          video.play();
        }}
      >
        <source src={props.url}></source>
      </video>
    </>
  );
};

export default MenuVideo;
