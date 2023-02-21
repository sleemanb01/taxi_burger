import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { useState } from "react";
import { userWToken } from "../../../../types/types";
import {
  TXT_STOCKS,
  TXT_ASSIGNMENTS,
  TXT_DASHBOARD,
} from "../../../../util/txt";

export default function BasicTabs({ user }: { user: userWToken | undefined }) {
  const [tab, setTab] = useState(0);
  const isManager = user?.email === process.env.REACT_APP_MANAGER;

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          aria-label="nav tabs example"
          centered
        >
          <Tab component={Link} label={TXT_STOCKS} to="/stocks" />
          <Tab
            component={Link}
            label={TXT_ASSIGNMENTS}
            to="/assignements"
            sx={{ color: "red" }}
          />
          {isManager && (
            <Tab component={Link} label={TXT_DASHBOARD} to="/dashboard" />
          )}
        </Tabs>
      </Box>
    </Box>
  );
}
