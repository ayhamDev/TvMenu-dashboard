import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { LogOut } from "../store/slice/AdminAuthSlice";
import api from "../api/API";
import moment from "moment";

const useAdminAuth = () => {
  const auth = useSelector((state: RootState) => state.adminAuth.value);
  const dispatch = useDispatch();

  return {
    admin: auth,
    LogOut: () => {
      return dispatch(LogOut());
    },
    VerifyToken: async () => {
      try {
        console.log(
          `[${moment(Date.now()).format("lll")}]`,
          "Verifying Token..."
        );
        await api.get("/user/verify", {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        console.log(
          `[${moment(Date.now()).format("lll")}]`,
          "Token Has Been Verified."
        );
        return true;
      } catch (err) {
        dispatch(LogOut());
        console.log(err);
      }
    },
  };
};

export default useAdminAuth;
