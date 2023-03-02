import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  TXT_STOCKS,
  TXT_ASSIGNMENTS,
  TXT_ATTENDANCE,
} from "../../../../util/txt";

export default function BasicTabs({ isManager }: { isManager: boolean }) {
  const [tab, setTab] = useState(0);

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
            to="/assignments"
            sx={{ color: "red" }}
          />
          <Tab component={Link} label={TXT_ATTENDANCE} to="/attendace" />
        </Tabs>
      </Box>
    </Box>
  );
}
