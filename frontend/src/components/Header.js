import React, { useState } from "react";
import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/Authhook";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [value, setValue] = useState();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h3">MernAuth</Typography>
          <Box sx={{ marginLeft: "auto" }}>
            <Tabs
              indicatorColor="secondary"
              onChange={(e, val) => setValue(val)}
              value={value}
              textColor="inherit"
            >
              {!user && (
                <>
                  <Tab to="/login" LinkComponent={Link} label="Login" />
                  <Tab to="/signup" LinkComponent={Link} label="Signup" />
                </>
              )}
              {user && (
                <Tab
                  onClick={handleLogout}
                  to="/"
                  LinkComponent={Link}
                  label="Logout"
                />
              )}
            </Tabs>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
