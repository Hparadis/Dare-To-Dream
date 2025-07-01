import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Drawer,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
  Report as ReportIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ExitToApp as ExitToAppIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { styled, createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
// Import Recharts for charting
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Remove dummy data
// const initialUsers = [...]
// const initialActivities = [...]
// const initialReports = [...]

// Dummy chart data
const dummyChartData = [
  { name: "Jan", users: 1200, activities: 800 },
  { name: "Feb", users: 1320, activities: 910 },
  { name: "Mar", users: 1100, activities: 780 },
  { name: "Apr", users: 1450, activities: 1020 },
  { name: "May", users: 1560, activities: 1150 },
];

// Real-time simulation (remove this section)
// const REAL_TIME_UPDATE_INTERVAL = 5000; // 5 seconds

const drawerWidth = 240;

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...theme.mixins.toolbar,
    open: true,
    "& .MuiDrawer-paper": theme.typography.body2,
  }),
  ...(!open && {
    ...theme.mixins.toolbar,
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  }),
}));

const defaultTheme = createTheme();

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true); // Drawer open state
  const [tabIndex, setTabIndex] = useState(0);
  const [users, setUsers] = useState([]); // Initialize as empty arrays
  const [activities, setActivities] = useState([]);
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New user registered!", time: "Just now" },
    { id: 2, message: "A report has been updated.", time: "2 minutes ago" },
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const isProfileMenuOpen = Boolean(profileAnchorEl);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);
  // Simulate admin check
  const isAdmin = true;
  useEffect(() => {
    if (!isAdmin) {
      navigate("/login");
    }
  }, [isAdmin, navigate]);

  // Real-time data simulation (replace with actual API calls)
  useEffect(() => {
    // Fetch events
    fetch("http://localhost:3000/api/events") // Replace with your actual events API endpoint
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((err) => {
        console.error("Error retrieving events:", err);
      })
      .finally(() => setLoading(false));

    // Fetch users
    fetch("http://localhost:3000/api/users") // Replace with your actual users API endpoint
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.error("Error retrieving users:", err);
      })
      .finally(() => setUsersLoading(false));

    // Fetch reports
    fetch("http://localhost:3000/api/reports") // Replace with your actual reports API endpoint
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
      })
      .catch((err) => {
        console.error("Error retrieving reports:", err);
      })
      .finally(() => setReportsLoading(false));

    // Remove the interval for real-time simulation
    // return () => clearInterval(intervalId);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNotificationMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    // Implement your logout logic here (e.g., clear session, redirect to login)
    console.log("Logout clicked");
    navigate("/login");
  };

  const menuId = "primary-search-account-menu";
  const renderNotificationMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleNotificationMenuClose}
    >
      {notifications.map((notification) => (
        <MenuItem key={notification.id} onClick={handleNotificationMenuClose}>
          <Typography>
            {notification.message} <Typography variant="caption">({notification.time})</Typography>
          </Typography>
        </MenuItem>
      ))}
      <MenuItem onClick={handleNotificationMenuClose}>
        <Typography color="primary">See All Notifications</Typography>
      </MenuItem>
    </Menu>
  );

  const profileMenuId = "account-menu";
  const renderProfileMenu = (
    <Menu
      anchorEl={profileAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={profileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isProfileMenuOpen}
      onClose={handleProfileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const renderUsersTable = () => {
    if (usersLoading) {
      return <CircularProgress />; // Show loading indicator
    }
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table aria-label="users data table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Signup Time</strong>
              </TableCell>
              <TableCell>
                <strong>Last Login</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell> {/* New column for user actions */}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(0, 5).map((user) => (
              // Display only a few for brevity
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.signup}</TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/user/${user.id}`)}
                  >
                    View Details
                  </Button>
                  {/* Add other action buttons as needed */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderActivitiesTable = () => {
    if (loading) {
      return <CircularProgress />; // Show loading indicator
    }
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table aria-label="activities data table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Timestamp</strong>
              </TableCell>
              <TableCell>
                <strong>Event</strong>
              </TableCell>
              <TableCell>
                <strong>Details</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>User</strong>
              </TableCell>{" "}
              {/* Assuming your event data includes user info */}
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event, index) => {
              let statusIcon = null;
              if (
                event.eventName === "user_login" &&
                typeof event.eventData.success !== "undefined"
              ) {
                statusIcon = event.eventData.success ? (
                  <CheckIcon style={{ color: "green" }} />
                ) : (
                  <CloseIcon style={{ color: "red" }} />
                );
              }
              return (
                <TableRow key={index}>
                  <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{event.eventName}</TableCell>
                  <TableCell>
                    <pre style={{ margin: 0 }}>
                      {JSON.stringify(event.eventData, null, 2)}
                    </pre>
                  </TableCell>
                  <TableCell>{statusIcon}</TableCell>
                  <TableCell>
                    {event.userId ? (
                      <Button
                        size="small"
                        onClick={() => navigate(`/user/${event.userId}`)}
                      >
                        View
                      </Button>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderReportsTable = () => {
    if (reportsLoading) {
      return <CircularProgress />;
    }
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table aria-label="reports data table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Report</strong>
              </TableCell>
              <TableCell>
                <strong>Timestamp</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Severity</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>{" "}
              {/* New column for report actions */}
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.slice(0, 5).map((rep) => (
              // Display only a few for brevity
              <TableRow key={rep.id}>
                <TableCell>{rep.report}</TableCell>
                <TableCell>{rep.timestamp}</TableCell>
                <TableCell>{rep.status}</TableCell>
                <TableCell>{rep.severity}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/report/${rep.id}`)}
                  >
                    View Details
                  </Button>
                  {/* Add other action buttons as needed */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderOverview = () => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 3,
        mt: 2,
      }}
    >
      <Paper sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        <Typography variant="h6">Total Users</Typography>
        <Typography variant="h4" color="primary">
          {users.length}
        </Typography>
        <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
      </Paper>
      <Paper sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        <Typography variant="h6">Recent Activities</Typography>
        <Typography variant="h4" color="secondary">
          {events.length}
        </Typography>
        <TimelineIcon color="secondary" sx={{ fontSize: 40 }} />
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          User Growth
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dummyChartData}>
            {" "}
            {/* You'll need to fetch and format real chart data */}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="users"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Activity Trends
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dummyChartData}>
            {" "}
            {/* You'll need to fetch and format real chart data */}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="activities"
              stroke={theme.palette.secondary.main}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
  const theme = useTheme();
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBarStyled position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <DashboardIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              Admin Dashboard
            </Typography>
            <IconButton color="inherit" onClick={handleNotificationMenuOpen}>
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Tooltip title="Account">
              <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                <Avatar alt="Admin User" src="/static/images/avatar/2.jpg" />{" "}
                {/* Replace with actual user image */}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBarStyled>
        <DrawerStyled variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={handleDrawerClose}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
            <ListItem
              button
              key="Dashboard"
              selected={tabIndex === 0}
              onClick={(event) => handleTabChange(event, 0)}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              button
              key="Users"
              selected={tabIndex === 1}
              onClick={(event) => handleTabChange(event, 1)}
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
            <ListItem
              button
              key="Activities"
              selected={tabIndex === 2}
              onClick={(event) => handleTabChange(event, 2)}
            >
              <ListItemIcon>
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText primary="Activities" />
            </ListItem>
            <ListItem
              button
              key="Reports"
              selected={tabIndex === 3}
              onClick={(event) => handleTabChange(event, 3)}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
            <ListItem button key="Settings" onClick={() => console.log("Settings clicked")}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key="Logout" onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </DrawerStyled>
        <Main open={open}>
          <Toolbar /> {/* Spacer for fixed AppBar */}
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
              Admin Dashboard
            </Typography>
            {tabIndex === 0 && renderOverview()}
            {tabIndex === 1 && renderUsersTable()}
            {tabIndex === 2 && renderActivitiesTable()}
            {tabIndex === 3 && renderReportsTable()}
          </Container>
        </Main>
        {renderNotificationMenu}
        {renderProfileMenu}
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;

