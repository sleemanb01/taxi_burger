import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { ILack, IStock } from "../../types/interfaces";
import AutoComplete from "./AutoComplete";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Popover from "@mui/material/Popover";

import { AuthContext } from "../../hooks/auth-context";
import { useContext } from "react";
import LackList from "./LackList";
import { calcLacks } from "../../util/lacks";
import logo from "../../logo.svg";

import "../../styles/css/global.css";
import { TXT_LOGOUT } from "../../util/txt";

function ResponsiveAppBar({
  stocks,
  clickHandler,
}: {
  stocks: IStock[];
  clickHandler: Function;
}) {
  const { logout, user } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openLackList, setOpenLackList] = React.useState<null | HTMLElement>(
    null
  );

  const isMenuOpen = Boolean(anchorEl);
  const isListOpen = Boolean(openLackList);
  const id = isListOpen ? "simple-popover" : undefined;

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLacksListOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpenLackList(event.currentTarget);
  };

  const handleLackListClose = () => {
    setOpenLackList(null);
  };

  const handleLogOut = () => {
    logout();
    handleMenuClose();
  };

  const TXT_PROFILE = user?.name;

  const lacks: ILack[] = calcLacks(stocks);

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>{TXT_PROFILE}</MenuItem>
      <MenuItem onClick={handleLogOut}>{TXT_LOGOUT}</MenuItem>
    </Menu>
  );

  return (
    <Box>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flex: 1 }}>
              <img style={{ maxHeight: "3rem" }} src={logo} alt="app logo" />
            </Box>
            <Box sx={{ flex: 2 }}>
              <AutoComplete options={stocks} clickHandler={clickHandler} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <IconButton
                onClick={handleLacksListOpen}
                sx={{ p: 1 }}
                size="large"
                aria-label="show notifications"
                color="inherit"
              >
                <Badge badgeContent={lacks.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Popover
                id={id}
                open={!!openLackList}
                anchorEl={openLackList}
                onClose={handleLackListClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <LackList
                  lacks={lacks}
                  clickHandler={clickHandler}
                  closeHandler={handleLackListClose}
                />
              </Popover>
              <IconButton
                onClick={handleProfileMenuOpen}
                size="large"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {renderMenu}
    </Box>
  );
}
export default ResponsiveAppBar;
