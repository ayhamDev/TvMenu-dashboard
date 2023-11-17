import { Box, CircularProgress } from "@mui/material";
import React, { useState } from "react";

const MenuImage = (props: { url: string | undefined }) => {
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
      <img
        src={props.url}
        style={{
          visibility: loading ? "hidden" : "visible",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          top: 0,
          flex: 1,
        }}
        onLoad={(e) => setLoading(false)}
      />
    </>
  );
};

export default MenuImage;
