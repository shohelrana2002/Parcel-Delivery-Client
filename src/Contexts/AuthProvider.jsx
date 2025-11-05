import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../Firebase/Firebase";

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const handleRegister = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const handleLoginAuth = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("current user in on site", currentUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(true);
      }
    });
    return () => unSubscribe();
  }, []);

  const handleEmailVerify = (email) => {
    setLoading(true);
    return sendEmailVerification(email);
  };
  const handleLogOut = () => {
    setLoading(true);
    return signOut(auth);
  };
  //
  const authInfo = {
    user,
    loading,
    handleLogOut,
    handleRegister,
    handleEmailVerify,
    handleLoginAuth,
  };
  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
