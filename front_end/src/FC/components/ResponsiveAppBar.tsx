import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { ILack, IStock } from "../../typing/interfaces";
import AutoComplete from "./AutoComplete";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Popover from "@mui/material/Popover";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import "../../styles/styles.css";
import { AuthContext } from "../../hooks/auth-context";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import LackList from "./LackList";
import { calcLacks } from "../../util/lacks";
import { ShiftContext } from "../../hooks/shift-context";

function ResponsiveAppBar({
  stocks,
  clickHandler,
}: {
  stocks: IStock[];
  clickHandler: Function;
}) {
  const nav = useNavigate();
  const auth = useContext(AuthContext);

  const { shift } = useContext(ShiftContext);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openLackList, setOpenLackList] = React.useState<null | HTMLElement>(
    null
  );
  const [openToolTip, setOpenToolTip] = React.useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isListOpen = Boolean(openLackList);
  const id = isListOpen ? "simple-popover" : undefined;

  const handleTooltipClose = () => {
    setOpenToolTip(false);
  };

  const handleTooltipOpen = () => {
    setOpenToolTip(true);
  };

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

  const handleLacksListOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpenLackList(event.currentTarget);
  };

  const handleLackListClose = () => {
    setOpenLackList(null);
  };

  const stocksHandler = () => {
    nav("/");
  };

  const handleLogOut = () => {
    auth.logout();
    handleMenuClose();
  };

  const TXT_PROFILE = auth.user?.name;
  const TXT_LOGOUT = "התנתק";
  const TXT_USERS = "משתמשים";
  const TXT_STOCKS = "מלאי";
  const TXT_SHIFT = shift
    ? shift.date.getMonth() + "/" + shift.date.getMonth()
    : "אין משמרת פעילה";

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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Box sx={{ flex: 1 }} display="flex" alignItems="center">
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
                <MenuItem onClick={stocksHandler}>{TXT_STOCKS}</MenuItem>
              </Menu>
              <ClickAwayListener onClickAway={handleTooltipClose}>
                <Tooltip
                  PopperProps={{
                    disablePortal: true,
                  }}
                  onClose={handleTooltipClose}
                  open={openToolTip}
                  title={TXT_SHIFT}
                >
                  {shift ? (
                    <AssignmentTurnedInIcon
                      sx={{ color: "success.light" }}
                      onClick={handleTooltipOpen}
                    />
                  ) : (
                    <AssignmentLateIcon
                      sx={{ color: "warning.main" }}
                      onClick={handleTooltipOpen}
                    />
                  )}
                </Tooltip>
              </ClickAwayListener>
            </Box>
            <Box sx={{ flex: 1 }}>
              <AutoComplete options={stocks} clickHandler={clickHandler} />
            </Box>
            <Box className={"align-end"} sx={{ flex: 1 }}>
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
