// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ allowedRoles, children }) => {
//   const { role, isAuthenticated } = useSelector((state) => state.auth);

//   if (!isAuthenticated) {
//     return <Navigate to="/" />;
//   }

//   if (!allowedRoles.includes(role)) {
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// export default PrivateRoute


import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles, children }) => {
  const { role, isAuthenticated } = useSelector((state) => state.auth);

  // Debugging the role and isAuthenticated
  console.log("PrivateRoute - Role:", role);
  console.log("PrivateRoute - Is Authenticated:", isAuthenticated);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('Not Authenticated')
    return <Navigate to="/" />;
  }

  // If role is not allowed, redirect to login
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
