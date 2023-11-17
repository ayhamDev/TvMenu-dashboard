import {
  ArrowBackIosRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { CountryListItemType, countries } from "country-list-json";

import {
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useLayoutEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import ConfirmModal from "../../../components/Admin/ConfirmModal";
import { SetName } from "../../../store/slice/Page";
import { AdminMotionProps } from "../../../utils/ConfigMotion";
import { UserRole } from "../../../types/IUser";

const CreateUser = () => {
  const [open, SetOpen] = useState<boolean>(false);
  const [FormSubmited, SetFormSubmited] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [Role, SetRole] = useState<UserRole>("Client");
  const [Country, SetCountry] = useState<CountryListItemType | undefined>(
    countries.find((country) => country.code == "US")
  );

  const [openCountry, SetopenCountry] = useState<boolean>(false);

  // Refs
  const EmailRef = useRef<HTMLInputElement | null>(null);
  const PasswordRef = useRef<HTMLInputElement | null>(null);
  const StoreName = useRef<HTMLInputElement | null>(null);
  const StateRef = useRef<HTMLInputElement | null>(null);
  const CityRef = useRef<HTMLInputElement | null>(null);
  const AddressRef = useRef<HTMLInputElement | null>(null);
  const ZipCodeRef = useRef<HTMLInputElement | null>(null);

  const [Form, SetForm] = useState({
    email: EmailRef.current?.value,
    password: PasswordRef.current?.value,
    Role,
    Store_Name: StoreName.current?.value,
    Country: Country?.name,
    State: StateRef.current?.value,
    City: CityRef.current?.value,
    Address: AddressRef.current?.value,
    Zip_Code: ZipCodeRef.current?.value,
  });

  const Theme = useTheme();
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(SetName("Menone | New User"));
  }, []);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const HandleSubmit = () => {
    SetFormSubmited(true);

    SetForm({
      email: EmailRef.current?.value,
      password: PasswordRef.current?.value,
      Role,
      Store_Name: StoreName.current?.value,
      Country: Country?.name,
      State: StateRef.current?.value,
      City: CityRef.current?.value,
      Address: AddressRef.current?.value,
      Zip_Code: ZipCodeRef.current?.value,
    });
    if (!EmailRef.current?.value || !PasswordRef.current?.value)
      return toast.error("Please Fill All The Required Fields.", {});
    if (
      Role == "Client" &&
      (!StoreName.current?.value ||
        !Country ||
        !StateRef.current?.value ||
        !CityRef.current?.value ||
        !AddressRef.current?.value ||
        !ZipCodeRef.current?.value)
    )
      return toast.error("Please Fill All The Required Fields.", {});
    SetOpen(true);
  };

  return (
    <>
      <ConfirmModal
        open={open}
        SetOpen={SetOpen}
        data={Form}
        endpoint={"/user/register"}
        method={"post"}
        title={`Are You Sure You Want To Create This ${Role} ?`}
        text={"Please Make Sure All The Info Are Correct."}
        Cachekey={["Users"]}
        redirect="/admin/user"
      />
      <motion.div {...AdminMotionProps}>
        <Stack direction={"row"} alignItems={"center"} gap={Theme.spacing(2)}>
          <IconButton
            sx={{
              padding: 0,
              margin: 0,
              width: "50px",
              height: "50px",
            }}
            onClick={() => history.back()}
          >
            <ArrowBackIosRounded />
          </IconButton>
          <Typography variant="h5">New User</Typography>
        </Stack>
        <Paper
          className="FancyBoxShadow"
          sx={{
            maxWidth: "650px",
            margin: "auto",
            mt: Theme.spacing(3),
            p: Theme.spacing(3),
          }}
        >
          <Stack gap={Theme.spacing(3)}>
            <Typography variant="h6">General</Typography>
            <TextField
              inputRef={EmailRef}
              label="Emails*"
              placeholder="E.g. client@example.com"
              error={FormSubmited ? (Form.email ? false : true) : false}
              helperText={
                FormSubmited
                  ? Form.email
                    ? false
                    : "User Email is Required Field"
                  : false
              }
            />
            <FormControl sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                inputRef={PasswordRef}
                error={FormSubmited ? (Form.email ? false : true) : false}
                fullWidth
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              <FormHelperText
                error={FormSubmited ? (Form.password ? false : true) : false}
              >
                {FormSubmited
                  ? Form.password
                    ? false
                    : "User Password is Required Field"
                  : false}
              </FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="program-type-select">Role*</InputLabel>
              <Select
                labelId="program-type-select"
                id="demo-simple-select"
                // @ts-ignore
                value={Role || ""}
                label="Role*"
                onChange={(event: SelectChangeEvent) => {
                  // @ts-ignore
                  SetRole(event.target.value as number);
                }}
                error={FormSubmited ? (Form.Role ? false : true) : false}
              >
                <MenuItem value={"Admin"}>Admin</MenuItem>
                <MenuItem value={"Client"}>Client</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="h6">Client Details</Typography>
            <TextField
              inputRef={StoreName}
              label="Store Name"
              placeholder="E.g. Client Name..."
              error={
                Role == "Client" && FormSubmited
                  ? Form.Store_Name
                    ? false
                    : true
                  : false
              }
              helperText={
                Role == "Client" && FormSubmited
                  ? Form.Store_Name
                    ? false
                    : "Store Name is Required Field"
                  : false
              }
              disabled={Role == "Admin"}
            />
            <Autocomplete
              disablePortal
              id="Country"
              open={openCountry}
              onOpen={() => {
                SetopenCountry(true);
              }}
              onClose={() => {
                SetopenCountry(false);
              }}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              onChange={(e, value) => {
                SetCountry(value);
              }}
              value={Country}
              getOptionLabel={(option) => option.name}
              options={countries}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  error={
                    Role == "Client" && FormSubmited
                      ? Form.Country
                        ? false
                        : true
                      : false
                  }
                  helperText={
                    Role == "Client" && FormSubmited
                      ? Form.Country
                        ? false
                        : "Please Select The Country For This Client"
                      : false
                  }
                  {...params}
                  label="Country"
                />
              )}
              disabled={Role == "Admin"}
            />
            <TextField
              inputRef={StateRef}
              label="State"
              placeholder="E.g. California..."
              error={
                Role == "Client" && FormSubmited
                  ? Form.State
                    ? false
                    : true
                  : false
              }
              helperText={
                Role == "Client" && FormSubmited
                  ? Form.State
                    ? false
                    : "State is Required Field"
                  : false
              }
              disabled={Role == "Admin"}
            />
            <TextField
              inputRef={CityRef}
              label="City"
              placeholder="E.g. San Francisco..."
              error={
                Role == "Client" && FormSubmited
                  ? Form.City
                    ? false
                    : true
                  : false
              }
              helperText={
                Role == "Client" && FormSubmited
                  ? Form.City
                    ? false
                    : "City is Required Field"
                  : false
              }
              disabled={Role == "Admin"}
            />
            <TextField
              inputRef={AddressRef}
              label="Address"
              multiline
              rows={4}
              placeholder="E.g. Address Line..."
              error={
                Role == "Client" && FormSubmited
                  ? Form.Address
                    ? false
                    : true
                  : false
              }
              helperText={
                Role == "Client" && FormSubmited
                  ? Form.Address
                    ? false
                    : "Address is Required Field"
                  : false
              }
              disabled={Role == "Admin"}
            />
            <TextField
              inputRef={ZipCodeRef}
              label="Zip Code"
              placeholder="E.g. 14738"
              error={
                Role == "Client" && FormSubmited
                  ? Form.Zip_Code
                    ? false
                    : true
                  : false
              }
              helperText={
                Role == "Client" && FormSubmited
                  ? Form.Zip_Code
                    ? false
                    : "Zip Code is Required Field"
                  : false
              }
              disabled={Role == "Admin"}
              inputMode="numeric"
              onChange={(event) => {
                const regex = new RegExp(/[^\d]/g);
                event.target.value = event.target.value.replace(regex, "");
              }}
            />
            <Button
              onClick={HandleSubmit}
              variant="contained"
              fullWidth
              size="large"
            >
              Create
            </Button>
          </Stack>
        </Paper>
      </motion.div>
    </>
  );
};

export default CreateUser;
