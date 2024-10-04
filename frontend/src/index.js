import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
ReactDOM.render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
    {/* <Provider store={store}> */}
    <AuthProvider>
      <App />
      {/* </Provider> */}
    </AuthProvider>
    {/* </React.StrictMode> */}
  </BrowserRouter>,
  document.getElementById("root")
);
