import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AnimatePresence } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/API";
import toast from "react-hot-toast";
type Typefield = {
  name: string;
  label: string;
  helperText?: string;
  multiline?: boolean;
  required?: boolean;
  type?: "password" | "email" | "text" | "number";
};

const ConfirmModal = ({
  open,
  SetOpen,
  data,
  endpoint,
  title,
  text,
  method = "post",
  Cachekey,
  setSelections,
  redirect,
  fields,
}: {
  open: boolean;
  SetOpen: Dispatch<SetStateAction<boolean>>;
  setSelections?: Dispatch<SetStateAction<number[]>>;
  data: any;
  endpoint: string;
  title: string;
  text: string;
  method: "post" | "get" | "patch" | "delete";
  Cachekey: any[];
  redirect?: string;
  fields?: Typefield[];
}) => {
  const Theme = useTheme();
  const [fieldsValue, SetfieldsValue] = useState<object>({});
  const [submited, SetSubmited] = useState<boolean>(false);
  const [isloading, SetIsloading] = useState<boolean>(false);
  const fullScreen = useMediaQuery(Theme.breakpoints.down("sm"));
  const q = useQueryClient();
  const navigate = useNavigate();
  // @ts-ignore
  useEffect(() => {
    if (fields) {
      const obj = {};
      for (let i = 0; i < fields.length; i++) {
        obj[fields[i].name] = "";
      }
      SetfieldsValue(obj);
    }
    return () => {
      SetfieldsValue({});
    };
  }, []);
  const handleClose = (_, reason) => {
    if (reason == "backdropClick" && isloading) return null;
    SetSubmited(false);
    SetIsloading(false);
    SetOpen(false);
  };

  const handleRegister = async () => {
    if (!data) return;
    SetIsloading(true);
    SetSubmited(true);
    let done = false;
    console.log(fields);

    if (fields && fields?.length != 0) {
      for (const key in fieldsValue) {
        if (fields?.find((field) => field.name == key)?.required) {
          console.log(fieldsValue[key].length);
          if (fieldsValue[key].length == 0) {
            SetIsloading(false);
            done = true;
          } else {
            done = false;
          }
        }
      }
    }

    if (done) return null;
    console.log(
      Array.isArray(data) ? { data: data } : { ...data, ...fieldsValue }
    );

    try {
      const res = await api(endpoint, {
        method: method,
        data: Array.isArray(data)
          ? { data: data }
          : { ...data, ...fieldsValue },
      });
      if (res.status == 200) {
        SetIsloading(false);
        SetOpen(false);
        SetfieldsValue({});
        q.invalidateQueries({
          queryKey: Cachekey,
        });
        if (typeof setSelections == "function") {
          setSelections([]);
        }

        res.data?.message &&
          toast.success(res.data.message, {
            duration: 5000,
          });
        if (redirect) return navigate(redirect);
      }
    } catch (err) {
      console.log(err);

      if (err instanceof AxiosError) {
        err.response?.data?.message &&
          toast.error(err.response.data.message, {
            duration: 5000,
          });
      }
      SetIsloading(false);
      SetOpen(false);
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      PaperProps={{
        sx: {
          p: Theme.spacing(2),
        },
      }}
    >
      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{text}</DialogContentText>

        {/* <DialogContentText>{Error}</DialogContentText> */}
        <Stack gap={Theme.spacing(3)} mt={Theme.spacing(3)}>
          {fields?.map((field) => {
            return (
              <TextField
                type={field.type || "text"}
                key={field.name}
                error={
                  field.required &&
                  submited &&
                  fieldsValue[field.name]?.length == 0
                    ? true
                    : false
                }
                helperText={
                  field.required &&
                  submited &&
                  fieldsValue[field.name]?.length == 0
                    ? field.helperText
                    : undefined
                }
                multiline={field.multiline}
                rows={field.multiline ? 4 : undefined}
                onChange={(e) => {
                  SetfieldsValue((fieldsValue) => {
                    fieldsValue[field.name] = e.currentTarget.value;
                    return fieldsValue;
                  });
                  console.log(fieldsValue);
                }}
                label={`${field.label}` + (field.required ? "*" : "")}
                fullWidth
              />
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={isloading} variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleRegister}
          autoFocus
          disabled={isloading}
        >
          {isloading ? <CircularProgress size={"28px"} /> : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
