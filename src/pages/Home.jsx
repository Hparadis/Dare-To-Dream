// src/pages/Home.jsx
import { auth } from "../config/firebase"; 
import React, { useState, useEffect } from "react";
import {
  useTheme,
  useMediaQuery,
  Container,
  Box,
  Fab,
  Modal,
  Backdrop,
  Snackbar,
  Alert,
  Avatar,
  Typography,
  Button,
  Dialog,         
  DialogTitle,    
  DialogContent,  
  DialogActions,  
  TextField,               
} from "@mui/material";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";
import PostFeed from "./PostFeed";
import MotivationalContent from "./MotivationalContent";
import MobileNavigation from "./MobileNavigation";
import MobileMemberListModal from "./MobileMemberListModal";
// --- CRITICAL IMPORT PATH FIX HERE ---
import CreateGroupCommunityModal from "./CreateGroupCommunityModal";
import InboxIcon from "@mui/icons-material/Inbox";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import PostCreator from "./PostCreator";
import tracker from "../tracker";
import { fetchGroups, fetchCommunities } from '../api';
import { useNavigate, useLocation } from "react-router-dom";
import { createGroup, joinGroup, createCommunity, joinCommunity } from '../api/firebaseApi';
import { inviteFriend as sendFriendInvitation ,getInitialFriends} from "../services/friends";
import { useUser } from "../context/UserContext";



// --- SharedOverlayContent component (no changes needed here) ---
const SharedOverlayContent = ({ title, items, onItemClick, emptyMessage, type, inviteStatus = {} }) => (
  <Box>
    <Typography variant="h5" sx={{ color: "#fff", marginBottom: '1rem', marginTop: 0, fontWeight: 'bold' }}>
      {title}
    </Typography>
    {items.length === 0 ? (
      <Box sx={{ color: "red", p: 1, textAlign: 'center' }}>{emptyMessage}</Box>
    ) : (
      items.map((item, index) => {
        const status = inviteStatus[item.userId] || 'idle';

        let buttonText = type === "friends" ? "Invite" : "Join";
        let disabled = false;

        if (type === "friends") {
          if (status === 'loading') buttonText = "Inviting...";
          else if (status === 'invited') buttonText = "Invited";
          else if (status === 'error') buttonText = "Retry Invite";

          disabled = (status === 'loading' || status === 'invited');
        }
        

        return (
          <Box
            key={item.id ?? item.userId ?? item.groupId ?? item.communityId ?? `item-${index}`}
            sx={{
              p: 2,
              backgroundColor: "#444",
              mb: 1,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              "&:hover": { backgroundColor: "#555" }
            }}
          >
            {type === "friends" && (
              <Avatar src={item.profileImage || '/default-avatar.jpg'} sx={{ width: 56, height: 56 }}>
                {item.name ? item.name[0]?.toUpperCase() : 'U'}
              </Avatar>
            )}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ color: "#fff" }}>{item.name}</Typography>
              {type === "friends" && item.description && (
                <Typography variant="body2" sx={{ color: "#ccc" }}>{item.description}</Typography>
              )}
              {(type === "groups" || type === "communities") && item.memberCount !== undefined && (
                <Typography variant="body2" sx={{ color: "#ccc" }}>Members: {item.memberCount}</Typography>
              )}
            </Box>
            <Button
              variant="contained"
              size="small"
              disabled={status === 'loading' || status === 'invited'}
              onClick={() => onItemClick(item)}
              sx={{
                backgroundColor: status === 'invited' ? 'gray' : '#2196f3',
                '&:hover': {
                  backgroundColor: status === 'invited' ? 'gray' : '#1976d2',
                },
                color: '#fff',
                borderRadius: 1,
                px: 2,
                py: 1,
              }}
            >
              {status === 'loading' ? 'Inviting...' : status === 'invited' ? 'Invited' : 'Invite'}
            </Button>


            {status === 'error' && (
              <Typography variant="caption" sx={{ color: "red", ml: 2 }}>
                Failed to send invite.
              </Typography>
            )}
          </Box>
        );
      })
    )}
  </Box>
);
function InvitationsList({ userId }) {
  const [invitations, setInvitations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadInvites = async () => {
      const invites = await fetchInvitations(userId);
      setInvitations(invites);
      setLoading(false);
    };
    loadInvites();
  }, [userId]);

  const handleResponse = async (inviteId, accept) => {
    const endpoint = accept ? 'accept' : 'decline';
    try {
      const res = await fetch(`/api/friends/invitations/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId }),
      });
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      setInvitations((prev) => prev.filter(inv => inv.id !== inviteId));
    } catch (error) {
      console.error(`Failed to ${accept ? 'accept' : 'decline'} invitation:`, error);
    }
  };

  if (loading) return <div>Loading invitations...</div>;

  if (invitations.length === 0) return <div>No pending invitations</div>;
 
  return (
    <div>
      <h3>Pending Invitations</h3>
      {invitations.map(invite => (
        <div key={invite.id} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#eee', borderRadius: 6 }}>
          <p>From User: {invite.from}</p>
          <button onClick={() => handleResponse(invite.id, true)}>Accept</button>
          <button onClick={() => handleResponse(invite.id, false)}>Decline</button>
        </div>
      ))}
    </div>
  );
}


const GroupManager = () => {
  const { userId } = useUser();
  const [groupName, setGroupName] = useState('');
  const [groupId, setGroupId] = useState('');
  const [message, setMessage] = useState('');

  const handleCreate = async () => {
    try {
      const res = await createGroup(userId, groupName);
      setMessage(`✅ Group created with ID: ${res.groupId}`);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  const handleJoin = async () => {
    try {
      const res = await joinGroup(userId, groupId);
      setMessage(`✅ Joined group: ${res.message}`);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Groups</h2>

      <div>
        <input
          type="text"
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <button onClick={handleCreate}>Create Group</button>
      </div>

      <div style={{ marginTop: 16 }}>
        <input
          type="text"
          placeholder="Group ID to join"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        />
        <button onClick={handleJoin}>Join Group</button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};
const showSnack = (setMsg, setSev, setOpen) => (msg, sev = "error") => {
  setMsg(msg);
  setSev(sev);
  setOpen(true);
};

export default function Home() {
  const { userId, userName, isAuthReady } = useUser();

  const navigate = useNavigate();

  const location = useLocation();

  const [friends, setFriends] = useState([]);

  const [inviteStatus, setInviteStatus] = useState({});

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [memberListType, setMemberListType] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [joinedGroup, setJoinedGroup] = useState(false);
  const [joinedCommunity, setJoinedCommunity] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [showGroups, setShowGroups] = useState(false);
  const [showCommunities, setShowCommunities] = useState(false);
  const [showFriends, setShowFriends] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openSuggestionDialog, setOpenSuggestionDialog] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);
  const [recommendedGroups, setRecommendedGroups] = useState([]);


  
   

  const errorSnack = showSnack(setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen);

  useEffect(() => {
    if (!isAuthReady) return; // wait for Firebase auth
    if (!userId) {
      errorSnack("User ID not found. Please complete the survey.", "warning");
      return;
    }
  
    (async () => {
      try {
        // 🔥 Step 1: Fetch latest survey for user
        const surveyRes = await fetch(`http://localhost:8000/api/survey?userId=${userId}`);
        const { surveys = [] } = await surveyRes.json();
  
        if (surveys.length === 0) {
          errorSnack("No survey found for this user.", "warning");
          return;
        }
  
        // ✅ Get latest survey by createdAt timestamp
        const latestSurvey = surveys.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        const { problem, cause } = latestSurvey;
  
        // ✅ Step 2: Fetch friends with similarity
        const [friendsRes, groupsRes, commRes] = await Promise.all([
          getInitialFriends(userId, problem, cause),
          fetchGroups(),
          fetchCommunities()
        ]);
  
        setFriends(friendsRes ?? []);
        setGroups(groupsRes ?? []);
        setCommunities(commRes ?? []);
      } catch (err) {
        console.error("Initial‑data load error", err);
        errorSnack(err.message || "Failed loading initial data");
      }
    })();
  }, [isAuthReady, userId]);

  
  
  const handleNavChange = async (view) => {
    console.log("handleNavChange →", view);
    setShowGroups(false);
    setShowCommunities(false);
    setShowFriends(false);
  
    try {
      switch (view) {
        case "groups":
          setShowGroups(true);
          if (groups.length === 0 && recommendedGroups.length === 0) {
            const fetched = await fetchGroups();
            const token = await auth.currentUser.getIdToken();
            const res = await fetch(`http://localhost:8000/groups/user?userId=${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await res.json();
            setGroups(data.joinedGroups || []);
            setRecommendedGroups(data.recommendedGroups || []);
          }
          break;

  
        case "communities":
          setShowCommunities(true);
          if (communities.length === 0) setCommunities(await fetchCommunities());
          break;
  
        case "friends":
          setShowFriends(true);
          if (friends.length === 0) {
            // Refetch survey for dynamic filtering
            const surveyRes = await fetch(`http://localhost:8000/api/survey?userId=${userId}`);
            const { surveys = [] } = await surveyRes.json();
            const latest = surveys.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
            const { problem, cause } = latest;
  
            const f = await getInitialFriends(userId, problem, cause);
            setFriends(f);
            if (f.length === 0)
              errorSnack("No friend suggestions found yet.", "info");
          }
          break;
  
        default:
          break;
      }
    } catch (err) {
      console.error(`Error fetching ${view}`, err);
      errorSnack(`Error loading ${view}: ${err.message}`);
    }
  };
  
  useEffect(() => {
    if (location.state?.fromSurvey) handleNavChange("groups");
  }, [location.state?.fromSurvey]);
  

  const handleSuggestClick = () => {
    setOpenSuggestionDialog(true);
  };
  const handleCloseSuggestionDialog = () => {
    setOpenSuggestionDialog(false);
    setSuggestionText(""); 
    setSnackbarOpen(false);
  };
  const submitSuggestionApi = async (suggestion, userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (suggestion.length > 5) { 
          console.log("Suggestion submitted:", suggestion, "by user:", userId);
          resolve({ success: true, message: "Thank you for your suggestion!" });
        } else {
          resolve({ success: false, message: "Suggestion is too short." });
        }
      }, 1000);
    });
  };
 
  const handleSubmitSuggestion = async () => {
    if (!suggestionText.trim()) {
      setSnackbarMessage("Suggestion cannot be empty.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setIsSubmittingSuggestion(true);
    const userId = auth.currentUser ? auth.currentUser.uid : "anonymous"; // Get user ID
    try {
      // Replace submitSuggestionApi with your actual API call
      const response = await submitSuggestionApi(suggestionText, userId);
      setSnackbarMessage(response.message);
      setSnackbarSeverity(response.success ? "success" : "error");
      setSnackbarOpen(true);
      if (response.success) {
        setSuggestionText(""); // Clear the input field
        setTimeout(() => {
          handleCloseSuggestionDialog(); // Close dialog after successful submission
        }, 1500); // Give user time to read success message
      }
    } catch (error) {
      setSnackbarMessage("Failed to submit suggestion. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error submitting suggestion:", error);
    } finally {
      setIsSubmittingSuggestion(false);
    }
  };

  

  const handleCloseOverlay = () => {
    setShowGroups(false);
    setShowCommunities(false);
    setShowFriends(false);
  };

  const handleFeatureClick = (featureName) => {
    tracker.trackEvent("feature_clicked", { feature: featureName });
  };

  const handleShowMembers = (type) => setMemberListType(type);
  const handleCloseMembers = () => {
      setMemberListType(null);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    console.log("Create Modal Open state set to true. isCreateModalOpen:", true);
  };
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    console.log("Create Modal Open state set to false. isCreateModalOpen:", false);
  };
  
  console.log("Friend clicked:", friends);
  const inviteFriend = async (fromUserId, toUserId, setInviteStatus) => {
    console.log("Sending invite with:", { fromUserId, toUserId });
  
    setInviteStatus(prev => ({ ...prev, [toUserId]: 'loading' }));
  
    try {
      const response = await fetch('http://localhost:8000/api/friends/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fromUserId, toUserId }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      setInviteStatus(prev => ({ ...prev, [toUserId]: 'invited' }));
    } catch (error) {
      console.error("Error sending invitation:", error);
      setInviteStatus(prev => ({ ...prev, [toUserId]: 'error' }));
    }
  };
  
  const fetchInvitations = async (userId) => {
    try {
      const res = await fetch(`/api/friends/invitations?userId=${userId}`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      return data.invitations || [];
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
      return [];
    }
  };
  const handleInvite = async (friend) => {
    const toUserId = friend.userId;
    const fromUserId = userId;
  
    if (!toUserId || !fromUserId) return;
  
    try {
      await inviteFriend(fromUserId, toUserId, setInviteStatus);
    } catch (err) {
      console.error("Invite failed", err);
    }
  };
        
  
  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    console.log("Post created:", newPost);
  };

  const handleNavigation = (type, item) => {
    if (type === "group") navigate("/group", { state: { group: item } });
    if (type === "community") navigate("/community", { state: { community: item } });
    handleCloseOverlay();
  };
  const useUserId = () => localStorage.getItem("userId");


  useEffect(() => {
    const getAllData = async () => {
      try {
        const [fetchedGroups, fetchedCommunities] = await Promise.all([
          fetchGroups(),
          fetchCommunities(),
        ]);
        
        setGroups(fetchedGroups || []);
        setCommunities(fetchedCommunities || []);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setGroups([]);
        setCommunities([]);
        setFriends([]);
        setSnackbarMessage(`Error loading initial data: ${error.message}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    getAllData();
  }, []);



  console.log("Home render", { showGroups, showCommunities, showFriends, isCreateModalOpen });

  const handleCreateGroup = async (groupName, description) => {
    const userId = useUserId();
    if (userId && groupName) {
      try {
        await fetch('/api/groups/create', {
          method: 'POST',
          body: JSON.stringify({ userId, name: "Creators Club" }),
          headers: { 'Content-Type': 'application/json' }
        });
        console.log("Attempting to create group:", { groupName, description, userId });
        await createGroup(groupName, description, userId);
        setSnackbarMessage("Group created successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setIsCreateModalOpen(false);
        
        
        const updatedGroups = await fetchGroups();
        console.log("Groups after creation and refresh:", updatedGroups);
        setGroups(updatedGroups || []);
      } catch (error) {
        console.error("Error creating group:", error);
        setSnackbarMessage(`Error creating group: ${error.message}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };
  const handleCreateCommunity = async (communityName, description) => {
    const userId = useUserId();
    if (userId && communityName) {
      try {
        console.log("Attempting to create community:", { communityName, description, userId });
        await createCommunity(communityName, description, userId);
        setSnackbarMessage("Community created successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setIsCreateModalOpen(false);

        const updatedCommunities = await fetchCommunities();
        console.log("Communities after creation and refresh:", updatedCommunities);
        setCommunities(updatedCommunities || []);
      } catch (error) {
        console.error("Error creating community:", error);
        setSnackbarMessage(`Error creating community: ${error.message}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };
  const handleJoinGroup = async (groupId) => {
    const userId = useUserId();
    if (userId && groupId) {
      try {
        await fetch('/api/groups/join', {
          method: 'POST',
          body: JSON.stringify({ userId, groupId }),
          headers: { 'Content-Type': 'application/json' }
        });
        await joinGroup(userId, groupId);
        setJoinedGroup(true);
        const updatedGroups = await fetchGroups();
        setGroups(updatedGroups || []);
        setSnackbarMessage("Successfully joined group!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
         if (showGroups) {
            setGroups(refreshedGroups || []);
        }
      } catch (error) {
        console.error("Error joining group:", error);
        setSnackbarMessage(`Failed to join group: ${error.message}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleJoinCommunity = async (communityId) => {
    const userId = useUserId();
    if (userId && communityId) {
      try {
        await joinCommunity(userId, communityId);
        setJoinedCommunity(true);
        const updatedCommunities = await fetchCommunities();
        setCommunities(updatedCommunities || []);
        setSnackbarMessage("Successfully joined community!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        if (showCommunities) {
            const refreshedCommunities = await fetchCommunities();
            setCommunities(refreshedCommunities || []);
        }
      } catch (error) {
        console.error("Error joining community:", error);
        setSnackbarMessage(`Failed to join community: ${error.message}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const isOverlayOpen = showGroups || showCommunities || showFriends;

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  
  
  return (
    <Container
       data-testid="home-page"
      maxWidth="lg"
      sx={{ p: 0, backgroundColor: "#333", minHeight: "100vh", color: "#fff", position: 'relative' }}
    >
      <AppHeader /> 

      <Box sx={{ display: "flex", mt: 2, filter: isOverlayOpen ? 'blur(4px)' : 'none', transition: 'filter 0.3s ease-out' }}>
        {isDesktop && (
          <Box sx={{ width: "25%", pr: 1 }}>
            <Sidebar
              groups={groups}
              communities={communities}
              friends={friends}
              joinedGroup={joinedGroup}
              joinedCommunity={joinedCommunity}
              onJoinGroup={handleJoinGroup}
              onJoinCommunity={handleJoinCommunity}
              onCreateClick={handleOpenCreateModal}
              onGroupClick={(group) => handleNavigation("group", group)}
              onCommunityClick={(community) => handleNavigation("community", community)}
              onShowAllGroups={() => handleNavChange("groups")}
              onShowAllCommunities={() => handleNavChange("communities")}
              onShowAllFriends={() => handleNavChange("friends")}
            />
          </Box>
        )}
        <Box sx={{ width: isDesktop ? "75%" : "100%", p: isDesktop ? 1 : 2 }}>
          <PostFeed posts={posts} />
          <MotivationalContent />
        </Box>
      </Box>

      <Modal
        open={isOverlayOpen}
        onClose={handleCloseOverlay}
        aria-labelledby="overlay-title"
        aria-describedby="overlay-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: {
            backgroundColor: 'rgba(0,0,0,0.7)',
          }
        }}
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '700px',
            maxHeight: '70vh',
            backgroundColor: '#282828',
            color: '#fff',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: { xs: 2, sm: 3 },
            overflowY: 'auto',
            boxShadow: '0px -5px 15px rgba(0,0,0,0.3)',
          }}
        >
          {showGroups && (
            <SharedOverlayContent
              title="Groups"
              items={groups}
              onItemClick={(group) => handleNavigation("group", group)}
              emptyMessage="No groups available. Why not create one?"
              type="groups"
            />
          )}
          {showCommunities && (
            <SharedOverlayContent
              title="Communities"
              items={communities}
              onItemClick={(community) => handleNavigation("community", community)}
              emptyMessage="No communities found. Start a new one!"
              type="communities"
            />
          )}
          {showFriends && (
            <SharedOverlayContent
            title="Suggested Friends"
            items={friends}
            onItemClick={handleInvite}
            type="friends"
            inviteStatus={inviteStatus}
          />          
          )}
        </Box>
      </Modal>

      {/* Mobile Navigation (Bottom Bar) */}
      {!isDesktop && (
        <MobileNavigation
          onNavClick={handleNavChange}
          setShowGroups={setShowGroups}
          setShowCommunities={setShowCommunities}
          setShowFriends={setShowFriends}
          onCreateClick={handleOpenCreateModal}
          onGroupClick={(group) => handleNavigation("group", group)}
          onCommunityClick={(community) => handleNavigation("community", community)}
          setPostModalOpen={setPostModalOpen}
          sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1301, 
          }}
        />
      )}

      {memberListType && (
        <MobileMemberListModal
          open={Boolean(memberListType)}
          onClose={handleCloseMembers}
          type={memberListType}
        />
      )}

      {/* Floating Action Buttons Container (Desktop) */}
      {isDesktop && (
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1350,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          {/* Suggest Button */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography component="span" sx={{ display: "block", mb: 0.5, fontSize: "0.75rem", color: "#fff" }}>
              Suggest
            </Typography>
            <Fab
              onClick={handleSuggestClick}
              sx={{ backgroundColor: "#fbc02d", color: "#fff", "&:hover": { backgroundColor: "#f9a825" } }}
              size="medium"
            >
              <LightbulbIcon />
            </Fab>
          </Box>
          {/* Create Button */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography component="span" sx={{ display: "block", mb: 0.5, fontSize: "0.75rem", color: "#fff" }}>
              Create
            </Typography>
            <Fab
              onClick={handleOpenCreateModal}
              sx={{ backgroundColor: "#2196f3", color: "#fff", "&:hover": { backgroundColor: "#1976d2" } }}
              size="medium"
            >
              <AddIcon />
            </Fab>
          </Box>
          {/* Post Button */}
           <Box sx={{ textAlign: 'center' }}>
             <Typography component="span" sx={{ display: "block", mb: 0.5, fontSize: "0.75rem", color: "#fff" }}>
                Post
             </Typography>
            <Fab
              color="primary"
              onClick={() => setPostModalOpen(true)}
              size="large"
              sx={{ backgroundColor: theme.palette.secondary.main, "&:hover": {backgroundColor: theme.palette.secondary.dark} }}
            >
              <EditIcon />
            </Fab>
          </Box>
        </Box>
      )}

      <Modal
        open={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1400 }}
      >
        <Box sx={{ backgroundColor: "#222", p: {xs: 2, sm: 3}, borderRadius: 2, width: "90%", maxWidth: 450 }}>
          <PostCreator
            onPost={(post) => {
              handleNewPost(post);
              setPostModalOpen(false);
            }}
          />
        </Box>
      </Modal>

      <CreateGroupCommunityModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onCreateGroup={handleCreateGroup}
        onCreateCommunity={handleCreateCommunity}
        sx={{ zIndex: 1600 }}
      />

      {/* Snackbar for feedback */}
      <Dialog open={openSuggestionDialog} onClose={handleCloseSuggestionDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: "#fbc02d", color: "#fff" }}>Submit a Suggestion</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            id="suggestion"
            label="Your Suggestion"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={suggestionText}
            onChange={(e) => setSuggestionText(e.target.value)}
            placeholder="Tell us what you think or what new features you'd like to see!"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuggestionDialog} color="primary" disabled={isSubmittingSuggestion}>
            Cancel
          </Button>
          <Button onClick={handleSubmitSuggestion} color="primary" variant="contained" disabled={isSubmittingSuggestion}>
            {isSubmittingSuggestion ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for submission feedback */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
