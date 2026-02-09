// src/pages/Friends.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  // Button, // No longer directly used, IconButton is preferred
  TextField,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  useMediaQuery,
  Badge,
  Stack,
  Drawer,
  Switch,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
// import PersonIcon from "@mui/icons-material/Person"; // Not directly used in main layout after header changes
// import WorkspacesIcon from "@mui/icons-material/Workspaces"; // Not directly used
// import Diversity2Icon from "@mui/icons-material/Diversity2"; // Not directly used
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { getAcceptedFriends } from "../services/friends";

import {  sendMessage, getChatMessages, moderateContent, fetchGroups, fetchCommunities ,getSuggestedFriends} from "../api";
import { useUser } from "../context/UserContext";

const APP_PRIMARY_BACKGROUND = '#111';
const APP_COMPONENT_BACKGROUND = '#333';
const APP_BORDER_COLOR = 'rgba(255,255,255,0.1)';
const APP_TEXT_COLOR = '#fff';
const APP_ICON_COLOR = '#fff';
const APP_MUTED_TEXT_COLOR = '#ccc';

const AI_USER_ID = 'ai-assistant';
const AI_USER_PROFILE = {
  userId: AI_USER_ID,
  name: 'AI Assistant',
  profileImage: null, // Will use SmartToyOutlinedIcon as avatar in chat
  status: 'online',
  description: 'Your helpful AI companion, ready to chat or assist.'
};

export default function Friends() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = !isMobile;

  const { userName, userId, isAuthReady } = useUser();

  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const [groups, setGroups] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loadingGroupsAndCommunities, setLoadingGroupsAndCommunities] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const messagesEndRef = useRef(null);

  const [listDrawerOpen, setListDrawerOpen] = useState(false);
  const [aiActive, setAiActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleAiToggle = () => {
    const newAiState = !aiActive;
    setAiActive(newAiState);
    if (newAiState && !selectedFriend) {
        setSelectedFriend(AI_USER_PROFILE);
    } else if (!newAiState && selectedFriend && selectedFriend.userId === AI_USER_ID) {
        setSelectedFriend(null); // Clear selection if AI chat is deactivated
        setMessages([]); // Clear AI messages
    }
    // If a human friend is selected, toggling AI just changes its background assistance status
  };

  useEffect(() => {
    const fetchFriendsData = async () => {
      if (isAuthReady && userId) {
        try {
          setLoadingFriends(true);
          const accepted = await getAcceptedFriends(userId);
          setFriends(accepted || []);
          if (accepted.length === 0) {
            setSnackbarMessage("No accepted friends yet.");
            setSnackbarSeverity("info");
            setSnackbarOpen(true);
          }
        } catch (error) {
          console.error("Friends.jsx: Error fetching accepted friends:", error);
          setSnackbarMessage(`Error loading friends: ${error.message}`);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        } finally {
          setLoadingFriends(false);
        }
      }
    };
    fetchFriendsData();
  }, [userId, isAuthReady]);

  useEffect(() => {
    const fetchMessagesOrSetupAiChat = async () => {
      setLoadingMessages(true);
      if (selectedFriend && selectedFriend.userId === AI_USER_ID) {
        // Load initial AI message or clear messages for AI chat
        setMessages([{
            senderId: AI_USER_ID,
            content: "Hello! I'm your AI Assistant. How can I help you today? I can chat, help ensure our conversations stay positive, look out for trolls, and remind you about friends you might want to reconnect with!",
            timestamp: new Date().toISOString(),
            receiverId: userId // Conceptually, the user is the receiver of this greeting
        }]);
        setLoadingMessages(false);
      } else if (isAuthReady && selectedFriend && userId) {
        try {
          const chatHistory = await getChatMessages(userId, selectedFriend.userId);
          setMessages(chatHistory || []);
        } catch (error) {
          console.error("Friends.jsx: Error fetching chat messages:", error);
          setSnackbarMessage(`Error loading chat: ${error.message}`);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          setMessages([]);
        } finally {
          setLoadingMessages(false);
        }
      } else {
        setMessages([]); // Clear messages if no friend selected or auth not ready for friend chat
        setLoadingMessages(false);
      }
    };
    fetchMessagesOrSetupAiChat();
  }, [selectedFriend, userId, isAuthReady]); // Removed AI_USER_ID from deps as it's constant

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectChat = (friend) => {
    setSelectedFriend(friend);
    if (isMobile) {
      setListDrawerOpen(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
  
    if (!selectedFriend || !userId) return;
  
    setSendingMessage(true);
  
    let finalMessageContent = newMessage.trim(); // <-- always defined
  
    const conversationId = [userId, selectedFriend.userId].sort().join("_");
  
    try {
      // Optional: AI moderation
      if (aiActive) {
        const moderationResult = await moderateContent(finalMessageContent);
        if (moderationResult?.is_problematic) {
          setSnackbarMessage(
            `AI Moderation: ${moderationResult.reason || "Content inappropriate"}`
          );
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          setSendingMessage(false);
          return;
        }
  
        // If moderation API cleans text, use that instead
        if (moderationResult?.cleaned_content) {
          finalMessageContent = moderationResult.cleaned_content;
        }
      }
  
      // Build payload
      const messagePayload = {
        senderId: userId,
        receiverId: selectedFriend.userId,
        content: finalMessageContent, // ✅ now defined properly
        timestamp: new Date().toISOString(),
      };
  
      // Send to backend
      await sendMessage(conversationId, messagePayload);
  
      // Add locally
      setMessages((prev) => [
        ...prev,
        { ...messagePayload, senderName: userName || "You" },
      ]);
  
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setSnackbarMessage(`Failed to send message: ${error.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSendingMessage(false);
    }
  };
  
    

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  

  const renderChatArea = () => {
    const currentChatPartner = selectedFriend; // Could be human or AI_USER_PROFILE

    return (
      <Paper
        elevation={0}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: isMobile ? '100%' : `calc(100vh - 70px - ${theme.spacing(2)})`,
          maxHeight: isMobile ? 'none' : `calc(100vh - 70px - ${theme.spacing(2)})`,
          backgroundColor: APP_COMPONENT_BACKGROUND,
          border: `1px solid ${APP_BORDER_COLOR}`,
          borderRadius: isDesktop ? '12px' : 0,
          color: APP_TEXT_COLOR,
          position: 'relative',
        }}
      >
        {!currentChatPartner ? (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: APP_MUTED_TEXT_COLOR }}>
              {aiActive ? "AI is active. Select a friend or chat with the AI directly." : "Select a friend to start chatting."}
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: "flex", alignItems: "center", p: 1.5, borderBottom: `1px solid ${APP_BORDER_COLOR}` }}>
              {isMobile && currentChatPartner && currentChatPartner.userId !== AI_USER_ID && (
                <IconButton onClick={() => setSelectedFriend(null)} sx={{ color: APP_ICON_COLOR, mr: 1 }}>
                  <ArrowBackIcon />
                </IconButton>
              )}
               {isMobile && currentChatPartner && currentChatPartner.userId === AI_USER_ID && !aiActive && (
                 // If AI was selected but then AI is globally toggled off, allow "back"
                <IconButton onClick={() => { setSelectedFriend(null); setMessages([]); }} sx={{ color: APP_ICON_COLOR, mr: 1 }}>
                  <ArrowBackIcon />
                </IconButton>
              )}
              <ListItemAvatar>
                {currentChatPartner.userId === AI_USER_ID ? (
                    <Avatar sx={{ width: 40, height: 40, backgroundColor: theme.palette.primary.main }}>
                        <SmartToyOutlinedIcon />
                    </Avatar>
                ) : (
                    <Avatar src={currentChatPartner.profileImage || '/default-avatar.jpg'} sx={{ width: 40, height: 40, border: `1px solid ${APP_BORDER_COLOR}` }}>
                    {currentChatPartner.name ? currentChatPartner.name[0]?.toUpperCase() : 'U'}
                    </Avatar>
                )}
              </ListItemAvatar>
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 'medium' }}>
                {currentChatPartner.name || 'Anonymous'}
              </Typography>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                p: 2,
                overflowY: 'auto',
              }}
            >
              {loadingMessages ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress color="inherit" />
                </Box>
              ) : messages.length === 0 ? (
                <Typography variant="body2" sx={{ color: APP_MUTED_TEXT_COLOR, textAlign: "center", my: 3 }}>
                  {currentChatPartner.userId === AI_USER_ID ? "Ask the AI anything or start a conversation!" : "No messages yet. Start the conversation!"}
                </Typography>
              ) : (
                messages.map((msg, index) => (
                  
                  <Box
                    key={index}
                    sx={{
                      mb: 1.5,
                      display: 'flex',
                      justifyContent: msg.senderId === userId ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: '10px 14px',
                        borderRadius: msg.senderId === userId ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                        maxWidth: '75%',
                        backgroundColor: msg.senderId === userId ? theme.palette.primary.dark : (msg.senderId === AI_USER_ID ? '#4A5568' : '#555'), // Different color for AI
                        color: APP_TEXT_COLOR,
                        wordBreak: 'break-word',
                        border: `1px solid ${APP_BORDER_COLOR}`
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: APP_TEXT_COLOR }}>
                        {msg.senderId === userId ? (userName || "You") : (currentChatPartner.userId === AI_USER_ID && msg.senderId === AI_USER_ID ? AI_USER_PROFILE.name : currentChatPartner.name || 'Anonymous')}
                      </Typography>
                      <Typography variant="body1" sx={{ color: APP_TEXT_COLOR }}>{msg.content}</Typography>
                      <Typography variant="caption" sx={{ display: "block", textAlign: "right", color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Paper>
                  </Box>
                ))
              )}
              <div ref={messagesEndRef} />
            </Box>
          </>
        )}

        <Box sx={{ p: 2, borderTop: `1px solid ${APP_BORDER_COLOR}`, backgroundColor: APP_COMPONENT_BACKGROUND }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder={currentChatPartner ? `Message ${currentChatPartner.name}...` : "Select a chat or toggle AI..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              disabled={!currentChatPartner || sendingMessage}
              sx={{
                backgroundColor: '#1c1c1c',
                borderRadius: '10px',
                "& .MuiOutlinedInput-root": {
                  color: APP_TEXT_COLOR,
                  "& fieldset": { borderColor: '#555' },
                  "&:hover fieldset": { borderColor: '#777' },
                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
                  borderRadius: '10px',
                },
                "& .MuiInputLabel-root": { color: APP_MUTED_TEXT_COLOR },
              }}
            />
            <IconButton 
              onClick={handleSendMessage} 
              disabled={sendingMessage || !currentChatPartner || !newMessage.trim()}
              sx={{
                backgroundColor: theme.palette.primary.main,
                "&:hover": { backgroundColor: theme.palette.primary.dark },
                "&.Mui-disabled": { backgroundColor: '#555', color: '#888' },
                color: APP_ICON_COLOR,
                p: 1.5,
                borderRadius: '10px',
              }}>
              {sendingMessage ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
            </IconButton>
          </Stack>
        </Box>
      </Paper>
    );
  };

  const renderFriendList = (isDrawer = false) => (
    <Box sx={{pt: isDrawer ? 0 : 1 }}>
      <Typography variant="h6" sx={{ color: APP_TEXT_COLOR, mb: 1, fontWeight: '600', px: isDrawer ? 0 : 1 }}>
        Friends
      </Typography>
      <Divider sx={{ mb: 2, backgroundColor: APP_BORDER_COLOR }} />
      {loadingFriends && !friends.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress color="inherit" /></Box>
      ) : friends.length === 0 ? (
        <Typography variant="body2" sx={{ color: APP_MUTED_TEXT_COLOR, textAlign: "center", my: 3, px: 1 }}>
          No friend suggestions yet.
        </Typography>
      ) : (
        <List sx={{ maxHeight: isDesktop || isDrawer ? 'calc(100vh - 250px)' : 'auto', overflowY: 'auto', pr: 0.5 }}>
          {friends.map((friend) => (
            <ListItem
              key={friend.userId}
              button
              onClick={() => handleSelectChat(friend)}
              sx={{
                borderRadius: 2,
                mb: 1,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                border: `1px solid ${selectedFriend?.userId === friend.userId ? theme.palette.primary.main : 'transparent'}`,
                backgroundColor: selectedFriend?.userId === friend.userId ? 'rgba(255,255,255,0.08)' : 'transparent',
              }}
            >
              <ListItemAvatar>
                <Badge 
                    color={friend.status === 'online' ? 'success' : 'error'} 
                    variant="dot" 
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    sx={{ '& .MuiBadge-badge': { border: `2px solid ${APP_COMPONENT_BACKGROUND}`}}}
                >
                  <Avatar src={friend.profileImage || '/default-avatar.jpg'} sx={{border: `1px solid ${APP_BORDER_COLOR}`}}/>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={friend.name || 'Anonymous'}
                primaryTypographyProps={{ color: APP_TEXT_COLOR, fontWeight: '500' }}
                secondary={friend.description || 'No description'}
                secondaryTypographyProps={{ color: APP_MUTED_TEXT_COLOR, fontSize: '0.8rem' }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  const renderGroupsAndCommunities = (isDrawer = false) => (
    <Box sx={{ maxHeight: isDesktop || isDrawer ? 'calc(100vh - 200px)' : 'auto', overflowY: 'auto', pr: isDrawer ? 0 : 0.5 }}>
      <Typography variant="h6" sx={{ mt: 2, color: APP_TEXT_COLOR, mb: 1, fontWeight: '600', px: isDrawer ? 0 : 1 }}>
        Groups
      </Typography>
      <Divider sx={{ mb: 2, backgroundColor: APP_BORDER_COLOR }} />
      {loadingGroupsAndCommunities && !groups.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress color="inherit" /></Box>
      ) : groups.length === 0 ? (
        <Typography variant="body2" sx={{ color: APP_MUTED_TEXT_COLOR, textAlign: "center", my: 3, px: 1 }}>
          No groups available.
        </Typography>
      ) : (
        <List sx={{pb: 1}}>
          {groups.map((group) => (
            <ListItem key={group.groupId} button sx={{
              borderRadius: 2, mb: 1, '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
              border: `1px solid transparent`,
            }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#FFC107', color: '#111', border: `1px solid ${APP_BORDER_COLOR}` }}>{group.groupName ? group.groupName[0].toUpperCase() : 'G'}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={group.groupName}
                primaryTypographyProps={{ color: APP_TEXT_COLOR, fontWeight: '500' }}
                secondary={`Members: ${group.memberCount}`}
                secondaryTypographyProps={{ color: APP_MUTED_TEXT_COLOR, fontSize: '0.8rem' }}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Typography variant="h6" sx={{ mt: 2, color: APP_TEXT_COLOR, mb: 1, fontWeight: '600', px: isDrawer ? 0 : 1 }}>
        Communities
      </Typography>
      <Divider sx={{ mb: 2, backgroundColor: APP_BORDER_COLOR }} />
      {loadingGroupsAndCommunities && !communities.length ? (
         <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress color="inherit" /></Box>
      ) : communities.length === 0 ? (
        <Typography variant="body2" sx={{ color: APP_MUTED_TEXT_COLOR, textAlign: "center", my: 3, px: 1 }}>
          No communities available.
        </Typography>
      ) : (
        <List sx={{pb:1}}>
          {communities.map((community) => (
            <ListItem key={community.communityId} button sx={{
              borderRadius: 2, mb: 1, '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
              border: `1px solid transparent`,
            }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#9C27B0', color: APP_TEXT_COLOR, border: `1px solid ${APP_BORDER_COLOR}` }}>{community.communityName ? community.communityName[0].toUpperCase() : 'C'}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={community.communityName}
                primaryTypographyProps={{ color: APP_TEXT_COLOR, fontWeight: '500' }}
                secondary={`Members: ${community.memberCount}`}
                secondaryTypographyProps={{ color: APP_MUTED_TEXT_COLOR, fontSize: '0.8rem' }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );


  const ListDrawerComponent = () => (
    <Drawer
      anchor="left"
      open={listDrawerOpen}
      onClose={() => setListDrawerOpen(false)}
      PaperProps={{ sx: { backgroundColor: APP_COMPONENT_BACKGROUND, color: APP_TEXT_COLOR, width: 280, borderRight: `1px solid ${APP_BORDER_COLOR}`, p:2 } }}
    >
      <Box sx={{display: 'flex', justifyContent:'space-between', alignItems:'center', p: '0 0 8px 0', borderBottom: `1px solid ${APP_BORDER_COLOR}`, mb:1}}>
        <Typography variant="h5" sx={{ fontWeight: 'bold'}}>Menu</Typography>
        <IconButton onClick={() => setListDrawerOpen(false)} sx={{color: APP_ICON_COLOR}}>
            <ArrowBackIcon />
        </IconButton>
      </Box>
      {renderFriendList(true)}
      {renderGroupsAndCommunities(true)}
    </Drawer>
  );

  const MobileAppHeader = () => (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: APP_COMPONENT_BACKGROUND,
        borderBottom: `1px solid ${APP_BORDER_COLOR}`,
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        height: '60px',
      }}
    >
      <IconButton onClick={() => setListDrawerOpen(true)} sx={{ color: APP_ICON_COLOR, mr: 0.5 }}>
        <MenuIcon />
      </IconButton>

      <Box sx={{ flexGrow: 1, overflowX: 'auto', display: 'flex', alignItems: 'center', gap: 1.5, px:1,
        '&::-webkit-scrollbar': { height: '4px' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#555', borderRadius: '2px' }
      }}>
        {loadingFriends && friends.length === 0 ? <CircularProgress size={24} color="inherit" sx={{mx: 'auto'}}/> : 
          friends.slice(0, 10).map((friend, index) => (
          <Badge
            key={friend.userId}
            color={friend.status === 'online' ? 'success' : 'error'}
            variant="dot"
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{ '& .MuiBadge-badge': { border: `2px solid ${APP_COMPONENT_BACKGROUND}`}}}
          >
            <Avatar
              src={friend.profileImage || '/default-avatar.jpg'}
              alt={friend.name}
              onClick={() => handleSelectChat(friend)}
              sx={{
                width: index === 0 ? 40 : 36,
                height: index === 0 ? 40 : 36,
                cursor: 'pointer',
                border: `1px solid ${selectedFriend?.userId === friend.userId ? theme.palette.primary.main : APP_BORDER_COLOR}`,
                boxShadow: selectedFriend?.userId === friend.userId ? `0 0 5px ${theme.palette.primary.light}`: 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': { borderColor: theme.palette.primary.light }
              }}
            />
          </Badge>
        ))}
        {friends.length === 0 && !loadingFriends && <Typography variant="caption" sx={{color: APP_MUTED_TEXT_COLOR}}>No friends</Typography>}
      </Box>
      
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <SmartToyOutlinedIcon sx={{ color: aiActive ? theme.palette.primary.main : APP_ICON_COLOR }} />
        <Switch
            checked={aiActive}
            onChange={handleAiToggle} // Use dedicated handler
            size="small"
            color="primary"
        />
      </Stack>
    </Paper>
  );

  const DesktopAppHeader = () => (
    <Paper
      elevation={0}
      sx={{
        p: '0px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: APP_COMPONENT_BACKGROUND,
        borderBottom: `1px solid ${APP_BORDER_COLOR}`,
        height: '70px',
      }}
    >
      <Box sx={{width: '300px' }}>
         <Typography variant="h5" sx={{fontWeight: 'bold', color: APP_TEXT_COLOR}}>Friends App</Typography>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', px:2 }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: '#1c1c1c',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              color: APP_TEXT_COLOR,
              borderRadius: '8px',
              '& fieldset': { borderColor: '#555' },
              '&:hover fieldset': { borderColor: '#777' },
              '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
            },
            '& .MuiInputBase-input::placeholder': { color: APP_MUTED_TEXT_COLOR, opacity: 1 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: APP_ICON_COLOR }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
            <SmartToyOutlinedIcon sx={{ color: aiActive ? theme.palette.primary.main : APP_ICON_COLOR }} />
            <Switch
                checked={aiActive}
                onChange={handleAiToggle} // Use dedicated handler
                size="small"
                color="primary"
            />
        </Stack>
        <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 36, height: 36, border: `1px solid ${APP_BORDER_COLOR}` }}>
            {userName ? userName[0]?.toUpperCase() : <AccountCircleIcon />}
        </Avatar>
      </Stack>
    </Paper>
  );


  if (!isAuthReady) {
    return (
      <Container maxWidth={false} disableGutters sx={{ height: '100vh', backgroundColor: APP_PRIMARY_BACKGROUND, color: APP_TEXT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading application data...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false} 
      disableGutters
      sx={{
        height: '100vh',
        backgroundColor: APP_PRIMARY_BACKGROUND,
        color: APP_TEXT_COLOR,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {isMobile ? <MobileAppHeader /> : <DesktopAppHeader />}
      
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden', 
          pt: isDesktop ? 1 : 0,
          pb: isDesktop ? 1 : 0,
          px: isDesktop ? 1 : 0,
          gap: isDesktop ? 2 : 0,
        }}
      >
        {isDesktop && (
          <Paper
            elevation={0}
            sx={{
              width: 300,
              flexShrink: 0,
              overflowY: 'auto',
              backgroundColor: APP_COMPONENT_BACKGROUND,
              border: `1px solid ${APP_BORDER_COLOR}`,
              borderRadius: '12px',
              p: '8px 8px 8px 16px', 
              height: `calc(100vh - 70px - ${theme.spacing(2)})`,
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#555', borderRadius: '3px' }
            }}
          >
            {renderFriendList()}
            {renderGroupsAndCommunities()}
          </Paper>
        )}
        
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: isMobile ? `calc(100vh - 60px)` : 'auto' }}> {/* Mobile height adjusted for header */}
            {renderChatArea()}
        </Box>

      </Box>
      

      {isMobile && <ListDrawerComponent />}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled" sx={{ width: '100%', boxShadow: 6 }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
