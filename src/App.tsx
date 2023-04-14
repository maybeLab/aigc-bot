import * as React from "react";
import { Outlet } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";

import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import Settings from "@/components/settings";
import Conversations from "@/components/conversations";
import { API_GET_CONVERSATIONS } from "@/fetch/api";
import { IConversation } from "@/types";
const drawerWidth = 240;

interface Props {}

export default function App(props: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [settingOpen, setSettingOpen] = React.useState(false);

  const [list, setList] = React.useState([] as IConversation[]);
  React.useEffect(() => {
    API_GET_CONVERSATIONS().then((list) => {
      setList(list);
    });
  }, []);

  const onAddRobot = React.useCallback((data: IConversation) => {
    setList((prev) => [...prev, data]);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleSettingToggle = () => {
    setSettingOpen(!settingOpen);
  };

  return (
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            TIYA-BOT-DEMO
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
          <Conversations list={list} onAdd={onAddRobot} />
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
          <Conversations list={list} onAdd={onAddRobot} />
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
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
