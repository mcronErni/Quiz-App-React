import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles, children }) => {
  const { role, isAuthenticated } = useSelector((state) => state.auth);

  console.log("PrivateRoute - Role:", role);
  console.log("PrivateRoute - Is Authenticated:", isAuthenticated);

  if (!isAuthenticated) {
    console.log('Not Authenticated')
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(role)) {
    console.log(role)
    console.log(allowedRoles)
    return <Navigate to="/" />;
  }
  console.log('success')
  console.log(children)
  return <Outlet/>
};

export default PrivateRoute;
