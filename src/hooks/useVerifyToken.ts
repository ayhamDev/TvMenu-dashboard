import { useLayoutEffect } from "react";
import useAdminAuth from "./useAdminAuth";

const useVerifyToken = () => {
  const { VerifyToken, admin } = useAdminAuth();
  useLayoutEffect(() => {
    VerifyToken();
    let index = setInterval(async () => {
      if (!admin?.accessToken) {
        clearInterval(index);
      }

      await VerifyToken();
    }, 60000);
    if (!admin?.accessToken) {
      clearInterval(index);
    }
    return () => {
      clearInterval(index);
    };
  }, []);
};

export default useVerifyToken;
