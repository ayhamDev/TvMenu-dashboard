import api from "./API";

export default function GetPrograms(
  token: string | undefined,
  params?: object | undefined
) {
  return api
    .get("/program", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params,
    })
    .then((res) => res.data);
}
