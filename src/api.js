// src/api.js
import { API_ROUTES } from "./routes";
import { auth } from "./config/firebase";
import { getToken } from "./authHelpers";

export const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://127.0.0.1:8000"
    : import.meta.env.VITE_BACKEND_URL;

console.log(import.meta.env.VITE_BACKEND_URL);

async function handleApiResponse(response) {
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorData = { message: `HTTP error! status: ${response.status}` };
    if (contentType && contentType.includes("application/json")) {
      try {
        errorData = await response.json();
      } catch (e) {
        errorData.message = await response.text();
      }
    } else {
      errorData.message = await response.text();
    }
    throw new Error(errorData.message || `Unknown error (${response.status})`);
  }

  if (!contentType || !contentType.includes("application/json")) {
    return null;
  }

  return await response.json();
}

export const submitSurvey = async (surveyData) => {
  const response = await fetch(`${BASE_URL}${API_ROUTES.submitSurvey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(surveyData),
  });
  return await handleApiResponse(response);
};

export const runGrouping = async () => {
  const response = await fetch(`${BASE_URL}${API_ROUTES.runGrouping}`);
  return await handleApiResponse(response);
};

export const getInitialFriends = async (userId) => {
  const response = await fetch(`${BASE_URL}/api/friends/initial-friends?userId=${userId}`);
  const data = await handleApiResponse(response);
  return data.friend ? [data.friend] : [];  // note: backend returns single friend, wrap in array here
};


export async function fetchGroups() {
  const token = await getToken();
  const res = await fetch("http://127.0.0.1:8000/api/groups/recommend", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch groups");
  return res.json();
}



export async function fetchCommunities() {
  const token = await getToken();
  const res = await fetch("http://127.0.0.1:8000/api/communities/recommend", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch communities");
  return res.json();
}

export const fetchUserProfilesByIds = async (userIds) => {
  if (!userIds || userIds.length === 0) return [];
  const response = await fetch(`${BASE_URL}/api/users/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userIds }),
  });
  const data = await handleApiResponse(response);
  return data.profiles || [];
};


export const moderateContent = async (text) => {
  if (!text?.trim()) return null;

  const token = await getToken(); // if auth is needed
  const response = await fetch(`${BASE_URL}${API_ROUTES.moderateContent}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify({ text }),
  });

  const data = await handleApiResponse(response);
  return data?.moderation_result ?? null;
};


export async function sendMessage(conversationId, { senderId, receiverId, content, timestamp }) {
  const res = await fetch(
    `${BASE_URL}/api/friends/chats/${conversationId}/send`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: content,
        senderId,
        receiverId,
        timestamp
      })
    }
  );
  return await handleApiResponse(res);
}


export const getChatMessages = async (user1Id, user2Id) => {
  const conversationId = conversationIdFor(user1Id, user2Id);
  const response = await fetch(
    `${BASE_URL}/api/friends/chats/${conversationId}/messages`
  );
  const data = await handleApiResponse(response);
  return data.messages || [];
};


export const getSuggestedFriends = async (userId) => {
  const response = await fetch(`${BASE_URL}${API_ROUTES.suggestedFriend}?userId=${userId}`);
  const data = await handleApiResponse(response);
  return data.suggested || [];
};
export const sendFriendInvitation = async (fromUserId, toUserId) => {
  const response = await fetch(`/api/friends/invite`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromUserId, toUserId })
  });

  if (!response.ok) {
    throw new Error("Failed to send invitation");
  }
  return await response.json();
};
export const conversationIdFor = (a, b) => [a, b].sort().join('_');





