import { API_ROUTES } from "./routes";

const BASE_URL =
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


export const fetchGroups = async () => {
  // const response = await fetch(`${BASE_URL}${API_ROUTES.groups}`);
  // const data = await handleApiResponse(response);
  return data.groups || [];
};

export const fetchCommunities = async () => {
  // const response = await fetch(`${BASE_URL}${API_ROUTES.communities}`);
  // const data = await handleApiResponse(response);
  return data.communities || [];
};

export const fetchUserProfilesByIds = async (userIds) => {
  if (!userIds || userIds.length === 0) return [];
  const response = await fetch(`${BASE_URL}${API_ROUTES.userProfiles}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userIds }),
  });
  const data = await handleApiResponse(response);
  return data.profiles || [];
};

export const moderateContent = async (text) => {
  const response = await fetch(`${BASE_URL}${API_ROUTES.moderateContent}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const data = await handleApiResponse(response);
  return data.moderation_result;
};

export const sendMessage = async (messagePayload) => {
  const response = await fetch(`${BASE_URL}${API_ROUTES.sendMessage}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messagePayload),
  });
  return await handleApiResponse(response);
};

export const getChatMessages = async (user1Id, user2Id) => {
  const response = await fetch(`${BASE_URL}${API_ROUTES.getMessages(user1Id, user2Id)}`);
  const data = await handleApiResponse(response);
  return data.messages || [];
};
