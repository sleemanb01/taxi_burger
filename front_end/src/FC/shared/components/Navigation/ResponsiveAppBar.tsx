import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { IStock } from "../../../../typing/interfaces";
import AutoComplete from "../../../components/AutoComplete";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";

import "../../../../styles/styles.css";
import { AuthContext } from "../../../../hooks/auth-context";
import { useNavigate } from "react-router-dom";

function ResponsiveAppBar({
  stocks,
  clickHandler,
}: {
  stocks: IStock[];
  clickHandler: Function;
}) {
  const nav = useNavigate();
  const auth = React.useContext(AuthContext);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const stocksHandler = () => {
    nav("/");
  };

  const handleLogOut = () => {
    auth.logout();
    handleMenuClose();
  };

  const TXT_PROFILE = "פרופיל";
  const TXT_LOGOUT = "התנתק";
  const TXT_USERS = "משתמשים";
  const TXT_STOCKS = "מלאי";

  const pages = [TXT_USERS, TXT_STOCKS];

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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flex: 1 }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block" },
                }}
              >
                <MenuItem>{TXT_USERS}</MenuItem>
                <MenuItem onClick={handleLogOut}>{TXT_STOCKS}</MenuItem>
              </Menu>
            </Box>
            <Box sx={{ flex: 1, color: "primary.main" }}>
              <AutoComplete options={stocks} clickHandler={clickHandler} />
            </Box>
            <Box className={"align-end"} sx={{ flex: 1 }}>
              <IconButton
                sx={{ p: 1 }}
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
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
