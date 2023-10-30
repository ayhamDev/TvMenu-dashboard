import api from "./API";

export default function GetPrograms(token: string | undefined) {
  return api
    .get("/program", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
}
