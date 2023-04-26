import * as React from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import {
  AppBar,
  ClickAwayListener,
  Box,
  CssBaseline,
  Drawer,
  Tooltip,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import SettingsIcon from "@mui/icons-material/Settings";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuIcon from "@mui/icons-material/Menu";

import Settings from "@/components/settings";
import Conversations from "@/components/conversations";
import { API_GET_CONVERSATIONS } from "@/fetch/api";
import { IConversation, EModifyType } from "@/types";
import Store from "@/context";

const drawerWidth = 240;

interface Props {}

export default function App(props: Props) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const darkTheme = createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light",
    },
  });
  const { state, dispatch } = React.useContext(Store);

  const [open, setOpen] = React.useState(false);

  const toggleTooltip = (status: boolean) => {
    setOpen(status);
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [settingOpen, setSettingOpen] = React.useState(false);

  React.useEffect(() => {
    API_GET_CONVERSATIONS().then((list) => {
      dispatch({
        type: EModifyType.SET_PAYLOAD,
        payload: {
          key: "conversations",
          value: list,
        },
      });
    });
  }, [dispatch]);

  const onAddRobot = React.useCallback(
    (data: IConversation) => {
      dispatch({
        type: EModifyType.PUSH_CONVERSATION,
        payload: data,
      });
    },
    [dispatch]
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleSettingToggle = () => {
    setSettingOpen(!settingOpen);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex", height: "100%" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open bot drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              {state.conversation.name || ""}
              {state.conversation.name && (
                <ClickAwayListener onClickAway={() => toggleTooltip(false)}>
                  <Tooltip
                    onClose={() => toggleTooltip(false)}
                    open={open}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={state.conversation.preset || "No Preset"}
                    sx={{ color: "red" }}
                  >
                    <IconButton
                      aria-label="infomation"
                      size="small"
                      sx={{ ml: "2px" }}
                      onClick={() => toggleTooltip(true)}
                    >
                      <InfoOutlinedIcon sx={{ color: "#fff", fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </ClickAwayListener>
              )}
            </Typography>
            <IconButton
              color="inherit"
              aria-label="open setting drawer"
              edge="end"
              onClick={handleSettingToggle}
            >
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            <Conversations
              list={state.conversations}
              onAdd={onAddRobot}
              onNav={handleDrawerToggle}
            />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            <Conversations list={state.conversations} onAdd={onAddRobot} />
          </Drawer>
          <Drawer
            open={settingOpen}
            anchor="right"
            onClose={handleSettingToggle}
            keepMounted
          >
            <Settings />
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            marginTop: 7,
            position: "relative",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
