import { message } from "antd";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import NotFound from "../../user/404";

function NoPermission() {
  return <h1 style={{ textAlign: "center" }}>You do not have permission</h1>;
}

function PrivateRoute({ children, requiredRoles }) {
  const [hasAccess, setHasAccess] = useState(null); // Giá trị ban đầu là null
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  const hasRole = () => {
    if (!user || !user.roles) {
      return false;
    }
    return requiredRoles.some((role) => user.roles.includes(role));
  };

  useEffect(() => {
    if (user) {
      setHasAccess(hasRole());
    } else {
      setHasAccess(false);
    }
  }, [requiredRoles, user]);

  if (hasAccess === null) {
    return <div>Loading...</div>;
  }

  if (!hasAccess) {
    if (!user || !user.roles || (user.roles.length === 1 && user.roles.includes("ROLE_USER"))) {
      return <NotFound />;
    }
    return <NoPermission />;
  }

  return children;
}

export default PrivateRoute;
