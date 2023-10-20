import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store/Store";
import GuardedRoute from "./components/GuardedRoute";
import React, { Suspense } from "react";

import LoadingSpinner from "./components/LoadingSpinner";
const Overview = React.lazy(() => import("./pages/Admin/Overview"));
const Dashboard = React.lazy(() => import("./pages/Admin/Dashboard"));
const Login = React.lazy(() => import("./pages/Admin/Login"));

const NewDevices = React.lazy(() => import("./pages/Admin/NewDevices"));
const Devices = React.lazy(() => import("./pages/Admin/Devices"));

import { AnimatePresence } from "framer-motion";
import { HashLoader } from "react-spinners";
import { Box } from "@mui/material";
import Page404 from "./pages/404";

const App = () => {
  const adminAuth = useSelector((state: RootState) => state.adminAuth.value);
  return (
    <AnimatePresence>
      <Routes>
        {/* Client */}

        <Route path="/" element={<Navigate to={"/admin"} replace />}></Route>
        {/* admin */}

        <Route
          element={
            <GuardedRoute
              redirectRoute="/admin/login"
              isRouteAccessible={adminAuth.isAuthenticated}
              // @ts-ignore
              Container={Dashboard}
            />
          }
        >
          <Route
            path="/admin"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Overview />
              </Suspense>
            }
          />
          <Route
            path="/admin/unregistered"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <NewDevices />
              </Suspense>
            }
          />
          <Route
            path="/admin/devices"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Devices />
              </Suspense>
            }
          />
        </Route>

        <Route
          element={
            <GuardedRoute
              redirectRoute="/admin"
              isRouteAccessible={!adminAuth.isAuthenticated}
            />
          }
        >
          <Route
            path="/admin/login"
            element={
              <Suspense
                fallback={
                  <Box
                    overflow={"hidden"}
                    position={"absolute"}
                    sx={{ inset: 1, padding: 0 }}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <HashLoader
                      color="#212121"
                      size={100}
                      style={{ padding: 0 }}
                    />
                  </Box>
                }
              >
                <Login />
              </Suspense>
            }
          />
        </Route>
        <Route path="*" element={<Page404 />}></Route>
      </Routes>
    </AnimatePresence>
  );
};

export default App;
