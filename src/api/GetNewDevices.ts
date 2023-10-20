import api from "./API";

export default function GetNewDevices(token: string | undefined) {
  return api
    .get("/unregistered", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
}
