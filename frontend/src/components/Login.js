import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/Authhook";

const Login = () => {
  console.log("hero");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    try {
      await login(inputs.email, inputs.password);
      navigate("/user");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          marginLeft="auto"
          marginRight="auto"
          width={300}
          display="flex"
          flexDirection={"column"}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h2">Login</Typography>

          <TextField
            name="email"
            onChange={handleChange}
            type="email"
            value={inputs.email}
            variant="outlined"
            placeholder="Email"
            margin="normal"
          />
          <TextField
            name="password"
            onChange={handleChange}
            type="password"
            value={inputs.password}
            variant="outlined"
            placeholder="Password"
            margin="normal"
          />
          <Button variant="contained" type="submit">
            Login
          </Button>
          {error && (
            <Typography color="error" variant="body2" style={{ marginTop: 10 }}>
              {error}
            </Typography>
          )}
        </Box>
      </form>
    </div>
  );
};

export default Login;
