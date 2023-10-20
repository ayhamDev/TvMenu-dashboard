import api from "../API";

export default function GetOrder(
  token: string | undefined,
  id: string | undefined
) {
  return api
    .get(`/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
}
