import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Welcome from "./components/Welcome";
import { useAuth } from "./hooks/Authhook";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  console.log("hj");
  const { user } = useAuth();
  console.log(user, "user");

  return (
    <React.Fragment>
      <header>
        <Header />
      </header>
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <Welcome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={<Navigate to={user ? "/user" : "/login"} />}
          />
        </Routes>
      </main>
    </React.Fragment>
  );
}

export default App;
