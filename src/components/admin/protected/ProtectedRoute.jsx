import { message } from "antd";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import NotFound from "../../user/404";

function NoPermission() {
  return <h1 style={{ textAlign: "center" }}>You do not have permission</h1>;
}

// Component PrivateRoute
function PrivateRoute({ children, requiredRoles }) {
  const [hasAccess, setHasAccess] = useState(null); // Giữ giá trị null trong lần render đầu tiên
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const hasRole = () => {
    if (!user || !user.roles) {
      return false;
    }
    return requiredRoles.some((role) => user.roles.includes(role));
  };

  useEffect(() => {
    if (user) {
      setHasAccess(hasRole()); // Chỉ kiểm tra quyền khi user đã tồn tại
    } else {
      setHasAccess(false); // Không có user, không có quyền
    }
  }, [requiredRoles, user]); // Thêm `user` vào dependencies

  if (hasAccess === null) {
    return <div>Loading...</div>; // Có thể hiển thị loading trong lúc kiểm tra quyền
  }

  if (!hasAccess && (!user.roles || user.roles.length === 1 && user.roles.includes("ROLE_USER"))) {
    return <NotFound />;
  } else if (!hasAccess) {
    return <NoPermission />;
  }
  

  return children;
}

export default PrivateRoute;
