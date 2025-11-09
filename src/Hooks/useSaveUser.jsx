import React from "react";

import useAxiosPublic from "./useAxiosPublic";
const useSaveUser = () => {
  const axiosPublic = useAxiosPublic();
  const save = async (email) => {
    const userData = {
      email: email,
      role: "user",
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    };
    const res = await axiosPublic.post("/users", userData);
    return res.data;
  };
  return save;
};

export default useSaveUser;
