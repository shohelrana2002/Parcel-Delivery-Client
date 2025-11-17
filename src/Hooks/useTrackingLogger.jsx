import React from "react";
import useAxiosSecure from "./useAxiosSecure";

const useTrackingLogger = () => {
  const axiosSecure = useAxiosSecure();
  const logTracking = async ({
    trackingId,
    status,
    details,
    location,
    updatedBy,
  }) => {
    try {
      const payload = {
        trackingId,
        status,
        details,
        location,
        updatedBy,
      };
      await axiosSecure.post("/trackings", payload);
    } catch (error) {
      console.log(error);
    }
  };
  return { logTracking };
};

export default useTrackingLogger;
