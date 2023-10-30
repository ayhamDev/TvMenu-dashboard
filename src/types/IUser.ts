export default interface IUser {
  User_ID: string;
  email: string;
  password: string;
  Role: "Admin" | "Client";
}
