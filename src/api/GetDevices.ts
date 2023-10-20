import api from "./API";

export default function GetDevices(token: string | undefined) {
  return api
    .get("/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
}
