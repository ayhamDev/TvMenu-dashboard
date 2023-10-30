import api from "./API";

export default function GetDevicesById(
  token: string | undefined,
  id: string | undefined
) {
  return api
    .get("/single", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        Device_ID: id,
      },
    })
    .then((res) => res.data);
}
