export type UserRole = "Admin" | "Client";

type AdminUser = {
  email: string;
  User_ID: string;
  Role: "Admin";
};

type ClientUser = {
  email: string;
  User_ID: string;
  Role: "Client";
  ClientDetails: {
    Store_Name: string;
    Country: string;
    State: string;
    City: string;
    Address: string;
    Zip_Code: number;
  };
};
export type IUser = {
  email: string;
  User_ID: string;
  Role: "Client";
  ClientDetails: {
    Store_Name: string;
    Country: string;
    State: string;
    City: string;
    Address: string;
    Zip_Code: number;
  };
};
export type IUserWithRole<T extends UserRole> = T extends "admin"
  ? AdminUser
  : ClientUser;
