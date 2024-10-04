import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/Authhook";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(inputs.name, inputs.email, inputs.password);
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      // Handle error (e.g., show error message to user)
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
          <Typography variant="h2">Signup</Typography>

          <TextField
            name="name"
            onChange={handleChange}
            value={inputs.name}
            variant="outlined"
            placeholder="Name"
            margin="normal"
          />
          <TextField
            name="email"
            onChange={handleChange}
            type={"email"}
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
            Signup
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Signup;
