import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../store/AuthContext";

const ProtectedRoute = ({ children }) => {
  // Access the token and isAdmin state by using the useMyContext hook from the ContextProvider
  const { token, } = useAuthContext();

  //navigate to login page to an unauthenticated
   if (!token) {
     return <Navigate to="/signin" />;
   }

  return children;
};

export default ProtectedRoute;


// USING LOCAL STORAGE OPTION FOR OAUTH ISSUE SINCE IT WAS NOT GETTING REDIRECTED.
// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children, adminPage = false }) => {
//   const token = localStorage.getItem('JWT_TOKEN');
//   const user = JSON.parse(localStorage.getItem('USER'));

//   console.log("ProtectedRoute: Token:", token);
//   console.log("ProtectedRoute: User:", user);

//   if (!token) {
//     console.log("ProtectedRoute: No token found, redirecting to login");
//     return <Navigate to="/login" />;
//   }

//   if (adminPage && (!user || !user.roles.includes('ADMIN'))) {
//     console.log("ProtectedRoute: User does not have admin rights, redirecting to access denied");
//     return <Navigate to="/access-denied" />;
//   }

//   console.log("ProtectedRoute: Access granted to protected route");
//   return children;
// };

// export default ProtectedRoute;
