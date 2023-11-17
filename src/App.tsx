import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store/Store";
import GuardedRoute from "./components/GuardedRoute";
import React, { Suspense } from "react";

import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";

import { HashLoader } from "react-spinners";
import { Box } from "@mui/material";
import Page404 from "./pages/404";
import useVerifyToken from "./hooks/useVerifyToken";

// Pages
const Overview = React.lazy(() => import("./pages/Admin/Overview"));

const Users = React.lazy(() => import("./pages/Admin/Users"));
const UserDetails = React.lazy(
  () => import("./pages/Admin/Details/User.details")
);
const UserCreate = React.lazy(() => import("./pages/Admin/Create/User.create"));

const Dashboard = React.lazy(() => import("./pages/Admin/Dashboard"));
const Login = React.lazy(() => import("./pages/Admin/Login"));

const NewDevices = React.lazy(() => import("./pages/Admin/NewDevices"));

const Devices = React.lazy(() => import("./pages/Admin/Devices"));
const DeviceDetails = React.lazy(
  () => import("./pages/Admin/Details/Device.details")
);

const Programs = React.lazy(() => import("./pages/Admin/Programs"));
const CreateProgram = React.lazy(
  () => import("./pages/Admin/Create/Programs.create")
);
const ProgramDetails = React.lazy(
  () => import("./pages/Admin/Details/Programs.details")
);

const Preview = React.lazy(() => import("./pages/Admin/Preview"));
const App = () => {
  const adminAuth = useSelector((state: RootState) => state.adminAuth.value);
  useVerifyToken();
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        {/* Client */}

        <Route path="/" element={<Navigate to={"/admin"} replace />}></Route>
        {/* Preview */}
        <Route
          element={
            <GuardedRoute
              redirectRoute="/admin/login"
              isRouteAccessible={adminAuth.isAuthenticated}
            />
          }
        >
          <Route
            path="/preview"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Preview />
              </Suspense>
            }
          />
        </Route>
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
            path="/admin/user"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Users />
              </Suspense>
            }
          />
          <Route
            path="/admin/user/new"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <UserCreate />
              </Suspense>
            }
          />
          <Route
            path="/admin/user/:id"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <UserDetails />
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
            path="/admin/device"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Devices />
              </Suspense>
            }
          />
          <Route
            path="/admin/device/:device_id"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <DeviceDetails />
              </Suspense>
            }
          />
          <Route
            path="/admin/program"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Programs />
              </Suspense>
            }
          />
          <Route
            path="/admin/program/new"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CreateProgram />
              </Suspense>
            }
          />
          <Route
            path="/admin/program/:id"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProgramDetails />
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
    </>
  );
};

export default App;
