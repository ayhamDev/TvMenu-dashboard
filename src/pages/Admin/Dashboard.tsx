import {
  AnalyticsRounded,
  PersonRounded,
  SpaceDashboard,
  TvOffRounded,
  TvRounded,
} from "@mui/icons-material";
import { Box, Container, colors, useTheme } from "@mui/material";
import isMobile from "is-mobile";
import React from "react";
import DashboardPart from "../../components/Admin/DashboardPart";
export default function Dashboard({
  children,
}: {
  children: React.JSX.Element;
}) {
  const SideBarItems = [
    {
      title: "General",
      items: [
        {
          label: "Overview",
          icon: <AnalyticsRounded sx={{ color: colors.grey[500] }} />,
          path: "/admin",
        },
        {
          label: "Users",
          icon: <PersonRounded sx={{ color: colors.grey[500] }} />,
          path: "/admin/user",
        },
      ],
    },
    {
      title: "Devices Management",
      items: [
        {
          label: "Devices",
          icon: <TvRounded sx={{ color: colors.grey[400] }} />,
          path: "/admin/device",
        },
        {
          label: "New Devices",
          icon: <TvOffRounded sx={{ color: colors.grey[400] }} />,
          path: "/admin/unregistered",
        },
        {
          label: "Programs",
          icon: <SpaceDashboard sx={{ color: colors.grey[400] }} />,
          path: "/admin/program",
        },
      ],
    },
  ];
  const Theme = useTheme();

  return (
    <DashboardPart items={SideBarItems}>
      {/* Dashboard Content */}
      <Box
        padding={Theme.spacing(isMobile() ? 0 : 2)}
        paddingTop={Theme.spacing(isMobile() ? 2 : 2)}
      >
        <Container maxWidth="xl" disableGutters>
          {children}
        </Container>
      </Box>
    </DashboardPart>
  );
}
