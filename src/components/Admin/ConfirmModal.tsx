import {
  useTheme,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import api from "../../api/API";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

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
}) => {
  const Theme = useTheme();

  const [isloading, SetIsloading] = useState<boolean>(false);
  const [Error, SetError] = useState<string>();
  const fullScreen = useMediaQuery(Theme.breakpoints.down("sm"));
  const q = useQueryClient();
  const navigate = useNavigate();
  // @ts-ignore
  const handleClose = (event: Event, reason) => {
    if (reason == "backdropClick" && isloading) return null;
    SetOpen(false);
    SetError("");
  };

  const handleRegister = async () => {
    if (!data) return;
    SetIsloading(true);
    try {
      const res = await api(endpoint, {
        method: method,
        data: Array.isArray(data) ? { data: data } : { ...data },
      });
      if (res.status == 200) {
        SetIsloading(false);
        SetOpen(false);
        q.invalidateQueries({
          queryKey: Cachekey,
        });
        if (typeof setSelections == "function") {
          setSelections([]);
        }
        if (redirect) return navigate(redirect);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        SetIsloading(false);
        SetError(err.message);
      }
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
      </DialogContent>
      <DialogContent>
        <DialogContentText>{Error}</DialogContentText>
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
