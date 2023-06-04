import React, { useEffect, useState } from "react";
import { useAddress } from "../hooks/useAddress";
import { useManager } from "../hooks/useManager";
import Unauthorized from "../components/Unauthorized";

function PrivateRoute({ children }) {
  const [isLoading, setLoading] = useState(true);
  const address = useAddress();
  const manager = useManager();

  useEffect(() => {
    let checkAuthorization;

    if (address === null || manager === null) {
      checkAuthorization = setInterval(() => {
        if (address !== null && manager !== null) {
          setLoading(false);
          clearInterval(checkAuthorization);
        }
      }, 1000);
    } else {
      setLoading(false);
    }

    return () => {
      clearInterval(checkAuthorization);
    };
  }, [address, manager]);

  if (isLoading) {
    return (
      <div
        style={{
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          fontSize: "4rem",
          marginTop: "2rem",
        }}
      >
        Loading...
      </div>
    );
  }

  if (address === manager) {
    return <div>{children}</div>;
  } else {
    return <Unauthorized />;
  }
}

export default PrivateRoute;
