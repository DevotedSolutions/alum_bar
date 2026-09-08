import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { COLORS } from "../theme/tokens";
import { getPageMeta } from "./common/pageMeta";
import { useRegion } from "./common/RegionContext";
import BrandLogo from "./common/BrandLogo";
import DashboardHeaderMeta from "./common/DashboardHeaderMeta";
import {
  CalendarIcon,
  DashboardIcon,
  InventoryIcon,
  AddIcon,
  ScannerIcon,
  LeavesIcon,
  UsersIcon,
  QuoteAppIcon,
  QuoteExportIcon,
  JobsIcon,
  LogoutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "./common/navIcons";

const EXPANDED_WIDTH = 272;
const COLLAPSED_WIDTH = 92;

export default function DrawerAppBar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("UserRole");
    localStorage.removeItem("tokenDesby");
    localStorage.removeItem("UserId");
    navigate("/login");
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(
    localStorage.getItem("sidebarCollapsed") === "1"
  );
  const toggleCollapsed = () => {
    setCollapsed((c) => {
      localStorage.setItem("sidebarCollapsed", c ? "0" : "1");
      return !c;
    });
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
    { text: "Calendar", path: "/calendar", Icon: CalendarIcon },
    { text: "Dashboard", path: "/dashboard", Icon: DashboardIcon },
    { text: "Inventory", path: "/inventory", Icon: InventoryIcon },
    { text: "Add Product", path: "/allproduct", Icon: AddIcon },
    { text: "Open Scanner", path: "/open-scanner", Icon: ScannerIcon },
    { text: "Leaves", path: "/leaves", Icon: LeavesIcon },
    { text: "User Management", path: "/users", Icon: UsersIcon },
    { text: "Quotation App", path: "/designation", Icon: QuoteAppIcon },
    { text: "Quotation Export", path: "/quotation-export", Icon: QuoteExportIcon },
    { text: "Job Sheets", path: "/jobsheets", Icon: JobsIcon },
  ];

  const itemsListUser = [
    { text: "Inventory", path: "/inventory", Icon: InventoryIcon },
    { text: "Scanner", path: "/open-scanner", Icon: ScannerIcon },
  ];

  const itemsListStaff = [
    { text: "Calendar", path: "/calendar", Icon: CalendarIcon },
    { text: "Leaves", path: "/leaves", Icon: LeavesIcon },
  ];

  const itemsList = isAdmin
    ? itemsListAdmin
    : isInventoryUser && isStaff
    ? [...new Map([...itemsListStaff, ...itemsListUser].map((i) => [i.text, i])).values()]
    : isInventoryUser
    ? itemsListUser
    : isStaff
    ? itemsListStaff
    : [];

  const goTo = (path) => () => {
    navigate(path);
    setMobileOpen(false);
  };

  const meta = getPageMeta(location.pathname);
  const { region, setRegion } = useRegion();
  const showRegionToggle = isAdmin && location.pathname.startsWith("/calendar");

  const navRow = (item, key) => {
    const active = location.pathname.startsWith(item.path);
    return (
      <Box
        key={key}
        onClick={goTo(item.path)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "13px 20px",
          cursor: "pointer",
          fontSize: "14.5px",
          fontWeight: active ? 600 : 400,
          color: active ? "#fff" : COLORS.sidebarTextInactive,
          background: active ? COLORS.headerTeal : "transparent",
          whiteSpace: "nowrap",
          overflow: "hidden",
          "&:hover": { background: active ? COLORS.headerTeal : COLORS.sidebarHover },
        }}
      >
        <item.Icon />
        {!collapsed && <span>{item.text}</span>}
      </Box>
    );
  };

  const sidebarContent = (
    <Box
      sx={{
        width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        minWidth: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        background: COLORS.sidebarBg,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflowY: "auto",
        overflowX: "hidden",
        position: "relative",
        transition: "width .18s ease, min-width .18s ease",
      }}
    >
      <Box
        onClick={toggleCollapsed}
        sx={{
          position: "absolute",
          top: "22px",
          right: "-14px",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: COLORS.tableHeaderBg,
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#C9CDD3",
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 5,
          "&:hover": { color: "#fff" },
        }}
      >
        {collapsed ? <ChevronRightIcon size={14} /> : <ChevronLeftIcon size={14} />}
      </Box>

      <Box>
        <Box sx={{ display: "flex", alignItems: "center", padding: "20px 18px 22px" }}>
          <BrandLogo size={56} textSize={19} showText={!collapsed} />
        </Box>

        {!collapsed && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 18px 14px" }}>
            <Box sx={{ color: COLORS.sidebarTextMuted, fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.14em" }}>
              MENU
            </Box>
            <Box sx={{ flex: 1, height: "1px", background: COLORS.sidebarDivider }} />
          </Box>
        )}

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {itemsList.map((item, i) => navRow(item, i))}
        </Box>
      </Box>

      <Box sx={{ padding: "10px 14px 22px" }}>
        <Box sx={{ height: "1px", background: COLORS.sidebarDivider, margin: "0 4px 10px" }} />
        <Box
          onClick={handleLogout}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "13px 16px",
            color: COLORS.sidebarTextInactive,
            fontSize: "14px",
            cursor: "pointer",
            borderRadius: "6px",
            "&:hover": { background: COLORS.sidebarHover },
          }}
        >
          <LogoutIcon />
          {!collapsed && <span>Log out</span>}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden", background: COLORS.bodyBg, color: COLORS.textPrimary }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", border: "none" } }}
      >
        {sidebarContent}
      </Drawer>

      <Box sx={{ display: { xs: "none", sm: "flex" } }}>{sidebarContent}</Box>

      <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <Box
          component="header"
          sx={{
            background: COLORS.headerTeal,
            padding: "18px 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            minHeight: "80px",
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: "inline-flex", sm: "none" }, color: "#fff" }}
            >
              <MenuIcon />
            </IconButton>
            <Box>
              <Box
                sx={{
                  color: "#fff",
                  fontSize: "29px",
                  fontWeight: 800,
                  letterSpacing: "0.01em",
                  textTransform: "uppercase",
                  lineHeight: 1.05,
                }}
              >
                {meta.title}
              </Box>
              {meta.subtitle && (
                <Box
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "14px",
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    marginTop: "5px",
                  }}
                >
                  {meta.subtitle}
                </Box>
              )}
            </Box>
          </Box>

          {meta.navKey === "dashboard" && <DashboardHeaderMeta />}

          {showRegionToggle && (
            <Box sx={{ display: "flex", alignItems: "center", border: "1px solid rgba(255,255,255,0.65)", borderRadius: "6px", overflow: "hidden" }}>
              <Box
                onClick={() => setRegion("MRU")}
                sx={{ padding: "11px 22px", fontSize: "13.5px", fontWeight: 600, letterSpacing: "0.04em", cursor: "pointer", color: "#fff", background: region === "MRU" ? "rgba(255,255,255,0.18)" : "transparent" }}
              >
                MAURITIUS
              </Box>
              <Box sx={{ width: "1px", alignSelf: "stretch", background: "rgba(255,255,255,0.5)" }} />
              <Box
                onClick={() => setRegion("MAY")}
                sx={{ padding: "11px 22px", fontSize: "13.5px", fontWeight: 600, letterSpacing: "0.04em", cursor: "pointer", color: "#fff", background: region === "MAY" ? "rgba(255,255,255,0.18)" : "transparent" }}
              >
                MAYOTTE
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1, overflow: "auto", padding: "24px 28px 40px" }}>{children}</Box>
      </Box>
    </Box>
  );
}
