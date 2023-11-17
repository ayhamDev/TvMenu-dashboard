import api from "./API";

export default function GetUserById(
  token: string | undefined,
  id: string | undefined
) {
  return api
    .get("/user/single", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        User_ID: id,
      },
    })
    .then((res) => res.data);
}
