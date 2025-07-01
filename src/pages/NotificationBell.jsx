import React, { useState } from "react";
import { IconButton, Badge, Menu, MenuItem, ListItemText } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";

// Dummy notifications for demonstration
const dummyNotifications = [
  {
    id: 1,
    message: "You have a new friend request from John",
    link: "/friends",
    read: false,
  },
  {
    id: 2,
    message: "Your post received 5 new likes",
    link: "/post/123",
    read: false,
  },
  {
    id: 3,
    message: "You have been invited to join Group B",
    link: "/groups",
    read: false,
  },
];

export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // When a notification is clicked, mark it as read and navigate to the provided link.
  const handleNotificationClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notif.id ? { ...n, read: true } : n
      )
    );
    handleClose();
    navigate(notif.link);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <IconButton onClick={handleClick} sx={{ color: "#fff" }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {notifications.length === 0 ? (
          <MenuItem onClick={handleClose}>No Notifications</MenuItem>
        ) : (
          notifications.map((notif) => (
            <MenuItem
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              sx={{ opacity: notif.read ? 0.6 : 1 }}
            >
              <ListItemText primary={notif.message} />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
