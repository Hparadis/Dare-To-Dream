export const sendFriendInvitation = async (fromUserId, toUserId) => {
    const res = await fetch("/api/friends/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromUserId, toUserId }),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to send invitation.");
    }
  
    return res.json();
  };
  export const getInitialFriends = async (userId, problem, cause) => {
    const url = new URL("http://localhost:8000/api/friends/suggest");
    url.searchParams.append("userId", userId);
    url.searchParams.append("problem", problem);
    url.searchParams.append("cause", cause);
  
    const res = await fetch(url);
    const data = await res.json();
    return data.friends ?? [];
  };

  export const inviteFriend = async (fromUserId, toUserId, setInviteStatus) => {
    if (setInviteStatus) setInviteStatus(toUserId, 'inviting');
  
    try {
      const response = await fetch("/api/friends/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fromUserId, toUserId }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
  
      if (setInviteStatus) setInviteStatus(toUserId, 'invited');
      return result;
    } catch (error) {
      console.error("Error sending invitation:", error);
      if (setInviteStatus) setInviteStatus(toUserId, 'error');
      throw error;
    }
  };
  


export const fetchInvitations = async (userId) => {
  try {
    const res = await fetch(`http://localhost:8000/api/friends/invitations?userId=${userId}`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    return data.invitations || [];
  } catch (error) {
    console.error("Failed to fetch invitations:", error);
    return [];
  }
};
const BASE_URL = "http://127.0.0.1:8000/api/friends";

export async function getAcceptedFriends(userId) {
  const res = await fetch(`${BASE_URL}/accepted/${userId}`);
  const data = await res.json();
  return data.friends || [];
}
