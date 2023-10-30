import { ViewComfyAltRounded } from "@mui/icons-material";
import { Box, Paper, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const Panel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  const Theme = useTheme();
  if (value != index) return null;
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0.2, scale: 0.975 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, easings: ["easeIn"] }}
    >
      <Box width={"100%"} mt={2} {...other}>
        {children}
      </Box>
    </motion.div>
  );
};

export default Panel;
