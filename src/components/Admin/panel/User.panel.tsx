import {
  Autocomplete,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { countries } from "country-list-json";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Navigate, useNavigate } from "react-router-dom";
import GetUserById from "../../../api/getUserById";
import useAdminAuth from "../../../hooks/useAdminAuth";
import { SetName } from "../../../store/slice/Page";
import { IUser } from "../../../types/IUser";
import LoadingSpinner from "../../LoadingSpinner";
import ConfirmModal from "../ConfirmModal";
import toast from "react-hot-toast";

const UserPanel = (props: { id: string | undefined }) => {
  const { admin } = useAdminAuth();
  const Theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, error, isLoading, isFetching } = useQuery<IUser>({
    queryKey: ["User", props.id],
    queryFn: () => GetUserById(admin?.accessToken, props.id),
  });
  const [ModalOpen, SetModalOpen] = useState<boolean>(false);
  const [ClientModalOpen, SetClientModalOpen] = useState<boolean>(false);
  const [NewData, SetNewData] = useState<object | undefined>({});

  const [FormSubmited, SetFormSubmited] = useState<boolean>(false);
  const [Country, SetCountry] = useState(
    countries.find((country) => country.code == "US")
  );
  const [openCountry, SetopenCountry] = useState<boolean>(false);

  const StoreName = useRef<HTMLInputElement | null>(null);
  const StateRef = useRef<HTMLInputElement | null>(null);
  const CityRef = useRef<HTMLInputElement | null>(null);
  const AddressRef = useRef<HTMLInputElement | null>(null);
  const ZipCodeRef = useRef<HTMLInputElement | null>(null);

  const [Form, SetForm] = useState({
    Store_Name: StoreName.current?.value,
    Country: Country?.name,
    State: StateRef.current?.value,
    City: CityRef.current?.value,
    Address: AddressRef.current?.value,
    Zip_Code: ZipCodeRef.current?.value,
  });
  useLayoutEffect(() => {
    dispatch(SetName("Menuone | User Details"));
  });
  useEffect(() => {
    if (
      data &&
      data.ClientDetails &&
      StoreName.current &&
      StateRef.current &&
      CityRef.current &&
      AddressRef.current &&
      ZipCodeRef.current
    ) {
      StoreName.current.value = data.ClientDetails.Store_Name;
      SetCountry(
        countries.find((country) => country.name == data.ClientDetails.Country)
      );
      StateRef.current.value = data.ClientDetails.State;
      CityRef.current.value = data.ClientDetails.City;
      AddressRef.current.value = data.ClientDetails.Address;
      // @ts-ignore
      ZipCodeRef.current.value = data.ClientDetails.Zip_Code;
    }
  }, [data]);
  const HandleSubmit = () => {
    SetFormSubmited(true);
    SetForm({
      Store_Name: StoreName.current?.value,
      Country: Country?.name,
      State: StateRef.current?.value,
      City: CityRef.current?.value,
      Address: AddressRef.current?.value,
      Zip_Code: ZipCodeRef.current?.value,
    });
    if (
      !StoreName.current?.value ||
      !Country?.name ||
      !StateRef.current?.value ||
      !CityRef.current?.value ||
      !AddressRef.current?.value ||
      !ZipCodeRef.current?.value
    )
      return toast.error("Please Fill All The Required Fields.", {});
    SetClientModalOpen(true);
  };
  if (isLoading) return <LoadingSpinner />;
  if (error) return <Navigate to={"/admin/user"} replace={true} />;

  return (
    <>
      <ConfirmModal
        open={ModalOpen}
        SetOpen={SetModalOpen}
        endpoint={`/user/password`}
        method="patch"
        data={NewData}
        title="Change Password"
        text="Plase Type The New Password Below."
        Cachekey={["user", props.id]}
        fields={[
          {
            label: "New Password",
            name: "password",
            required: true,
            helperText: "New Password Is Required Field",
            type: "password",
          },
        ]}
        redirect="/admin/user"
      />
      {data?.Role == "Client" && (
        <ConfirmModal
          open={ClientModalOpen}
          SetOpen={SetClientModalOpen}
          endpoint={`/user/${data.User_ID}`}
          method="patch"
          data={Form}
          title="Are You Sure You Want To Save ?"
          text="Please Make Sure The Info Are Correct."
          Cachekey={["user", props.id]}
          redirect="/admin/user"
        />
      )}

      <Paper
        className="FancyBoxShadow"
        sx={{
          mt: Theme.spacing(3),
          p: Theme.spacing(3),
          maxWidth: "650px",
          m: "auto",
        }}
      >
        <Stack gap={3}>
          <Stack>
            <Typography
              sx={{
                userSelect: "none",
              }}
              variant="subtitle1"
            >
              User ID
            </Typography>
            <Tooltip title="Copy To Clipboard">
              <Typography
                onClick={(e) => {
                  navigator.clipboard
                    .writeText(
                      // @ts-ignore
                      e.currentTarget.textContent
                    )
                    .then(() => {
                      toast.success("Copied To Clipboard");
                    })
                    .catch(() => {
                      toast.error("Failed To Copy To Clipboard");
                    });
                }}
                sx={{
                  userSelect: "none",
                  cursor: "pointer",
                  width: "fit-content",
                }}
                variant="h6"
                id="copy"
              >
                {data?.User_ID}
              </Typography>
            </Tooltip>
          </Stack>
          <Stack>
            <Typography
              sx={{
                userSelect: "none",
              }}
              variant="subtitle1"
            >
              Email
            </Typography>
            <Tooltip title="Copy To Clipboard">
              <Typography
                onClick={(e) => {
                  navigator.clipboard
                    .writeText(
                      // @ts-ignore
                      e.currentTarget.textContent
                    )
                    .then(() => {
                      toast.success("Copied To Clipboard");
                    })
                    .catch(() => {
                      toast.error("Failed To Copy To Clipboard");
                    });
                }}
                sx={{
                  userSelect: "none",
                  cursor: "pointer",
                  width: "fit-content",
                }}
                variant="h6"
                id="copy"
              >
                {data?.email}
              </Typography>
            </Tooltip>
          </Stack>
          <Stack>
            <Typography
              sx={{
                userSelect: "none",
              }}
              variant="subtitle1"
            >
              Password
            </Typography>
            <Tooltip title="Change Password">
              <Button
                onClick={() => {
                  SetNewData({
                    User_ID: data?.User_ID,
                  });
                  SetModalOpen(true);
                }}
                sx={{
                  userSelect: "none",
                  cursor: "pointer",
                  width: "max-content",
                }}
                id="copy"
                variant="outlined"
              >
                Change Password
              </Button>
            </Tooltip>
          </Stack>
          <Stack>
            <Typography
              sx={{
                userSelect: "none",
              }}
              variant="subtitle1"
            >
              Role
            </Typography>
            <Box
              sx={{
                py: Theme.spacing(1),
                px: Theme.spacing(2),
                width: "max-content",
                borderRadius: "24px",
                color: data?.Role == "Client" ? "green" : "red",
                background: Theme.palette.grey[300],
              }}
            >
              <Typography
                fontSize={15}
                fontWeight={"bold"}
                textTransform={"uppercase"}
                width={"max-content"}
              >
                {data?.Role == "Client" ? "Client" : "Admin"}
              </Typography>
            </Box>
            {data?.Role == "Client" && (
              <>
                <Stack gap={Theme.spacing(3)} mt={3}>
                  <Typography variant="h6">Client Details</Typography>
                  <TextField
                    inputRef={StoreName}
                    label="Store Name"
                    placeholder="E.g. Client Name..."
                    error={
                      FormSubmited ? (Form.Store_Name ? false : true) : false
                    }
                    helperText={
                      FormSubmited
                        ? Form.Store_Name
                          ? false
                          : "Store Name is Required Field"
                        : false
                    }
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
                          FormSubmited ? (Form.Country ? false : true) : false
                        }
                        helperText={
                          FormSubmited
                            ? Form.Country
                              ? false
                              : "Please Select The Country For This Client"
                            : false
                        }
                        {...params}
                        label="Country"
                      />
                    )}
                  />
                  <TextField
                    inputRef={StateRef}
                    label="State"
                    placeholder="E.g. California..."
                    error={FormSubmited ? (Form.State ? false : true) : false}
                    helperText={
                      FormSubmited
                        ? Form.State
                          ? false
                          : "State is Required Field"
                        : false
                    }
                  />
                  <TextField
                    inputRef={CityRef}
                    label="City"
                    placeholder="E.g. San Francisco..."
                    error={FormSubmited ? (Form.City ? false : true) : false}
                    helperText={
                      FormSubmited
                        ? Form.City
                          ? false
                          : "City is Required Field"
                        : false
                    }
                  />
                  <TextField
                    inputRef={AddressRef}
                    label="Address"
                    multiline
                    rows={4}
                    placeholder="E.g. Address Line..."
                    error={FormSubmited ? (Form.Address ? false : true) : false}
                    helperText={
                      FormSubmited
                        ? Form.Address
                          ? false
                          : "Address is Required Field"
                        : false
                    }
                  />
                  <TextField
                    inputRef={ZipCodeRef}
                    label="Zip Code"
                    placeholder="E.g. 14738"
                    error={
                      FormSubmited ? (Form.Zip_Code ? false : true) : false
                    }
                    helperText={
                      FormSubmited
                        ? Form.Zip_Code
                          ? false
                          : "Zip Code is Required Field"
                        : false
                    }
                    inputMode="numeric"
                    onChange={(event) => {
                      const regex = new RegExp(/[^\d]/g);
                      event.target.value = event.target.value.replace(
                        regex,
                        ""
                      );
                    }}
                  />
                </Stack>

                <Button
                  sx={{
                    mt: 3,
                  }}
                  size="large"
                  variant="contained"
                  onClick={HandleSubmit}
                >
                  Update
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Paper>
    </>
  );
};

export default UserPanel;
