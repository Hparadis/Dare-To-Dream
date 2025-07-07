export const API_ROUTES = {
    submitSurvey: "/submit-survey",
    runGrouping: "/run-grouping",
    initialFriends: (userId) => `/api/friends/initial-friends/${userId}`,
    suggestedFriend: "/api/friends/suggested",
    groups: "/groups/list",
    communities: "/communities/list",
    userProfiles: "/users/profiles",
    moderateContent: "/api/moderate-content",
    sendMessage: "/chat/send-message",
    getMessages: (user1Id, user2Id) => `/chat/get-messages/${user1Id}/${user2Id}`,
  };
  