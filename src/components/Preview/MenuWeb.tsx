import { Box, CircularProgress } from "@mui/material";
import React, { useState } from "react";

const MenuWeb = (props: { url: string | undefined }) => {
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
      <iframe
        src={props.url}
        style={{
          display: loading ? "none" : "block",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          objectPosition: "top",
          top: 0,
          flex: 1,
          border: 0,
          padding: 0,
          margin: 0,
          background: "transparent",
        }}
        onLoad={() => {
          setLoading(false);
        }}
      ></iframe>
    </>
  );
};

export default MenuWeb;
