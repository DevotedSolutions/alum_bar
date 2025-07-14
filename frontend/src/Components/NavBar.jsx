import * as React from "react";
import AppBar from "@mui/material/AppBar";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Inventory2TwoToneIcon from "@mui/icons-material/Inventory2TwoTone";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import UserIcon from "@mui/icons-material/Person2TwoTone";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import AttachmentIcon from "@mui/icons-material/Attachment";
import CalculateIcon from "@mui/icons-material/Calculate";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ApprovalIcon from "@mui/icons-material/Approval";
import logo from "./dasby.jpeg";

import FunctionsIcon from "@mui/icons-material/Functions";
const drawerWidth = 280;

export default function DrawerAppBar(props) {
  let navigate = useNavigate();

  // logout functionality
  const handleLogout = () => {
    localStorage.removeItem("UserRole");
    localStorage.removeItem("tokenDesby");
    localStorage.removeItem("UserId");

    // Navigate to the login page
    navigate("/login");
  };

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isAdmin =
    localStorage.getItem("UserRole") === "admin" ||
    localStorage.getItem("UserRole")?.includes("admin");
  const isInventoryUser =
    localStorage.getItem("UserRole") === "user" ||
    localStorage.getItem("UserRole")?.includes("user");
  const isStaff =
    localStorage.getItem("UserRole") === "staff" ||
    localStorage.getItem("UserRole")?.includes("staff");

  const itemsListAdmin = [
    {
      text: "Calendar",
      icon: <CalendarTodayIcon />,
      onClick: () => {
        navigate("/calendar");
        setMobileOpen(false);
      },
    },
    {
      text: "Dashboard",
      icon: <InboxIcon />,
      onClick: () => {
        navigate("/dashboard");

        setMobileOpen(false);
      },
    },
    {
      text: "Inventory",
      icon: <Inventory2TwoToneIcon />,
      onClick: () => {
        navigate("/inventory");

        setMobileOpen(false);
      },
    },
    {
      text: "Add Product",
      icon: <AddIcon />,
      onClick: () => {
        navigate("/allproduct");

        setMobileOpen(false);
      },
    },
    {
      text: "Open Scanner",
      icon: <QrCodeScannerIcon />,
      onClick: () => {
        navigate("/open-scanner");

        setMobileOpen(false);
      },
    },

    {
      text: "Leaves",
      icon: <ApprovalIcon />,
      onClick: () => {
        navigate("/leaves");
        setMobileOpen(false);
      },
    },

    {
      text: "User Management",
      icon: <UserIcon />,
      onClick: () => {
        navigate("/users");

        setMobileOpen(false);
      },
    },
    {
      text: "Quotation App",
      icon: <CalculateIcon />,
      onClick: () => {
        navigate("/designation");

        setMobileOpen(false);
      },
    },
    {
      text: "Quotation Export",
      icon: <AttachmentIcon />,
      onClick: () => {
        navigate("/quotation-export");

        setMobileOpen(false);
      },
    },
    {
      text: "Job Sheets",
      icon: <FunctionsIcon />,
      onClick: () => {
        navigate("/jobsheets");

        setMobileOpen(false);
      },
    },
    {
      text: "Log out",
      icon: <LogoutIcon />,
      onClick: () => {
        handleLogout();

        setMobileOpen(false);
      },
    },
  ].filter(Boolean);

  const itemsListUser = [
    {
      text: "Inventory",
      icon: <Inventory2TwoToneIcon />,
      onClick: () => {
        navigate("/inventory");

        setMobileOpen(false);
      },
    },

    {
      text: "Scanner",
      icon: <QrCodeScannerIcon />,
      onClick: () => {
        navigate("/open-scanner");

        setMobileOpen(false);
      },
    },

    {
      text: "Log out",
      icon: <LogoutIcon />,
      onClick: () => {
        handleLogout();

        setMobileOpen(false);
      },
    },
  ].filter(Boolean);

  const itemsListStaff = [
    {
      text: "Calendar",
      icon: <CalendarTodayIcon />,
      onClick: () => {
        navigate("/calendar");
        setMobileOpen(false);
      },
    },

    {
      text: "Leaves",
      icon: <ApprovalIcon />,
      onClick: () => {
        navigate("/leaves");
        setMobileOpen(false);
      },
    },
    {
      text: "Log out",
      icon: <LogoutIcon />,
      onClick: () => {
        handleLogout();

        setMobileOpen(false);
      },
    },
  ].filter(Boolean);

  const itemsList = isAdmin
    ? itemsListAdmin
    : isInventoryUser
    ? itemsListUser
    : isStaff
    ? itemsListStaff
    : [];

  const drawer = (
    <div>
      <Box
        sx={{
          display: "flex",

          alignItems: "center",

          height: "130px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "70px",
            height: "70px",
            marginLeft: "20px",
          }}
        >
          {" "}
          <img
            src={logo}
            alt="img"
            width="100%"
            height="100%"
            style={{ borderRadius: "50%", border: "0.3px solid gray" }}
          ></img>
        </Box>

        <Box>
          <Typography
            variant="h3"
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              padding: "0 5px",
              textTransform: "capitalize",
            }}
          >
            {" "}
            Dasby Pofile System
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontSize: "10px",
              fontWeight: "600",
              padding: "0 5px",
              marginTop: "3px",
              color: "#707070",
            }}
          >
            Address: Royal Road St Paul Phoenix Mauritius
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontSize: "10px",
              fontWeight: "600",
              padding: "0 5px",
              marginTop: "3px",
              color: "#707070",
            }}
          >
            Phone: +230 6062720
          </Typography>
        </Box>
      </Box>
      <Toolbar />

      <Divider />

      <List>
        {itemsList.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={item.onClick}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ wborder: "1px solid black", display: "flex" }}>
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
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            sx={{ color: "white" }}
            variant="h6"
            noWrap
            component="div"
          >
            Welcome
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
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
          {drawer}
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
          {drawer}
        </Drawer>
      </Box>
      {/* <Box
        component="main"
        sx={{ flexGrow: 1,marginTop:"70px",border:"1px solid black" }}
      >


      </Box> */}
    </Box>
  );
}
