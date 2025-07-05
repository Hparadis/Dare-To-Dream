// src/api.js

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : import.meta.env.VITE_BACKEND_URL;
    console.log(import.meta.env.VITE_BACKEND_URL);



/**
 * Generic helper function to handle API responses.
 * Checks if the response is OK, parses JSON, and throws an error if not.
 * @param {Response} response - The fetch API response object.
 * @returns {Promise<Object>} - The parsed JSON data.
 * @throws {Error} - If the response is not OK or if JSON parsing fails.
 */
async function handleApiResponse(response) {
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorData = { message: `HTTP error! status: ${response.status}` };
    if (contentType && contentType.includes("application/json")) {
      try {
        errorData = await response.json();
      } catch (e) {
        console.error("Failed to parse error JSON:", e);
        errorData.message = await response.text();
      }
    } else {
      errorData.message = await response.text();
    }
    const errorMessage = errorData.message || `An unknown error occurred (Status: ${response.status})`;
    console.error(`API Error: ${response.url} - ${errorMessage}`);
    throw new Error(errorMessage);
  }

  if (!contentType || !contentType.includes("application/json")) {
    console.warn(`Response for ${response.url} was OK but not JSON. Content-Type: ${contentType}`);
    return null;
  }

  try {
    return await response.json();
  } catch (e) {
    console.error(`Failed to parse JSON response from ${response.url}:`, e);
    throw new Error(`Invalid JSON response from server: ${e.message}`);
  }
}

/**
 * Submits survey data to the backend.
 * @param {Object} surveyData - The survey data object.
 * @returns {Promise<Object>} - The success message from the backend.
 * @throws {Error} - If the API call fails.
 */
export const submitSurvey = async (surveyData) => {
  try {
    const response = await fetch(`${BASE_URL }/submit-survey`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(surveyData),
    });
    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error("Error submitting survey:", error);
    throw error;
  }
};

/**
 * Triggers the backend grouping algorithm.
 * This is typically for administrative or scheduled use.
 * @returns {Promise<Object>} - The success message from the backend.
 * @throws {Error} - If the API call fails.
 */
export const runGrouping = async () => {
  try {
    const response = await fetch(`${BASE_URL }/run-grouping`);
    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error("Error running grouping:", error);
    throw error;
  }
};

/**
 * Fetches initial friend suggestions for a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array<Object>>} - An array of suggested friend user profile objects.
 * @throws {Error} - If the API call fails.
 */
export const getInitialFriends = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL }/initial-friends/${userId}`);
    const data = await handleApiResponse(response);
    return data.suggestedFriends || [];
  } catch (error) {
    console.error(`Error fetching initial friends for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Fetches the list of all available groups.
 * @returns {Promise<Array<Object>>} - An array of group objects.
 * @throws {Error} - If the API call fails.
 */
export const fetchGroups = async () => {
  try {
    const response = await fetch(`${BASE_URL }/groups/list`);
    const data = await handleApiResponse(response);
    return data.groups || [];
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }
};

/**
 * Fetches the list of all available communities.
 * @returns {Promise<Array<Object>>} - An array of community objects.
 * @throws {Error} - If the API call fails.
 */
export const fetchCommunities = async () => {
  try {
    const response = await fetch(`${BASE_URL }/communities/list`);
    const data = await handleApiResponse(response);
    return data.communities || [];
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
};

/**
 * Fetches user profiles by a list of user IDs.
 * @param {Array<string>} userIds - An array of user IDs.
 * @returns {Promise<Array<Object>>} - An array of user profile objects.
 * @throws {Error} - If the API call fails.
 */
export const fetchUserProfilesByIds = async (userIds) => {
  if (!userIds || userIds.length === 0) {
    return [];
  }
  try {
    const response = await fetch(`${BASE_URL }/users/profiles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: userIds }),
    });
    const data = await handleApiResponse(response);
    return data.profiles || [];
  } catch (error) {
    console.error("Error fetching user profiles by IDs:", error);
    throw error;
  }
};

/**
 * Sends content to the AI moderation endpoint.
 * @param {string} text - The content to be moderated.
 * @returns {Promise<Object>} - The moderation result from the AI.
 * @throws {Error} - If the API call fails.
 */
export const moderateContent = async (text) => {
  try {
    const response = await fetch(`${BASE_URL }/api/moderate-content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text }),
    });
    const data = await handleApiResponse(response);
    return data.moderation_result;
  } catch (error) {
    console.error("Error moderating content:", error);
    throw error;
  }
};

/**
 * Sends a chat message to the backend.
 * @param {Object} messagePayload - The message object containing senderId, receiverId, content, timestamp.
 * @returns {Promise<Object>} - Success confirmation from backend.
 * @throws {Error} - If the API call fails.
 */
export const sendMessage = async (messagePayload) => {
  try {
    const response = await fetch(`${BASE_URL }/chat/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messagePayload),
    });
    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};

/**
 * Retrieves chat messages between two users.
 * @param {string} user1Id - The ID of the first user.
 * @param {string} user2Id - The ID of the second user.
 * @returns {Promise<Array<Object>>} - An array of message objects.
 * @throws {Error} - If the API call fails.
 */
export const getChatMessages = async (user1Id, user2Id) => {
  try {
    const response = await fetch(`${BASE_URL }/chat/get-messages/${user1Id}/${user2Id}`);
    const data = await handleApiResponse(response);
    return data.messages || [];
  } catch (error) {
    console.error("Error retrieving chat messages:", error);
    throw error;
  }
};
