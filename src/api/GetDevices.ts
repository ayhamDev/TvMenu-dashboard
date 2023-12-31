import api from "./API";

export default function GetDevices(token: string | undefined, params?: object) {
  return api
    .get("/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params,
    })
    .then((res) => res.data);
}
