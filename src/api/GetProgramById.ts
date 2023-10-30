import api from "./API";

export default function GetProgramById(
  token: string | undefined,
  id: string | undefined
) {
  return api
    .get("/program/single", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        Program_Row_Number: id,
      },
    })
    .then((res) => res.data);
}
