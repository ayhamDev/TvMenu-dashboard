import api from "./API";

export default function GetUsers(token: string | undefined) {
  return api
    .get("/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
}
