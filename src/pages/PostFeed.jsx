import React, { useState } from "react";

const emojiReactions = [
  { emoji: "😊", label: "Happy", border: "#FFD700" },
  { emoji: "😢", label: "Sad", border: "#00BFFF" },
  { emoji: "😠", label: "Angry", border: "#FF4500" },
  { emoji: "❤️", label: "Love", border: "#FF1493" },
  { emoji: "😮", label: "Surprised", border: "#8A2BE2" },
];

const postTypeColors = {
  question: {
    background: "rgba(255, 255, 200, 0.6)",
    color: "#ffffff",
  },
  comment: {
    background: "rgba(200, 200, 255, 0.6)",
    color: "#ffffff",
  },
  statement: {
    background: "rgba(200, 255, 200, 0.6)",
    color: "#ffffff",
  },
  other: {
    background: "rgba(150, 150, 150, 0.3)",
    color: "#ffffff",
  },
};

export default function PostFeed({ posts = [] }) {
  const [hoveredPostId, setHoveredPostId] = useState(null);
  const [reactions, setReactions] = useState({});
  const [thankYouMessages, setThankYouMessages] = useState({});

  const handleReaction = (postId, emoji) => {
    setReactions((prev) => ({ ...prev, [postId]: emoji }));
    setThankYouMessages((prev) => ({ ...prev, [postId]: true }));

    setTimeout(() => {
      setThankYouMessages((prev) => ({ ...prev, [postId]: false }));
    }, 2000);
  };

  const getBorderColor = (postId) => {
    const emoji = reactions[postId];
    const found = emojiReactions.find((r) => r.emoji === emoji);
    return found ? found.border : "#ccc";
  };

  if (posts.length === 0) {
    return <p style={{ color: "#aaa" }}>No posts yet. Create one!</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {posts.map((post) => {
        const showOverlay = hoveredPostId === post.id;
        const hasReacted = reactions[post.id];
        const showThankYou = thankYouMessages[post.id];

        const { background, color } = postTypeColors[post.postType] || postTypeColors.other;

        return (
          <div key={post.id}>
            <p
              style={{
                color: "#fff", // force white text for all post content
                backgroundColor: background,
                padding: "1rem",
                borderRadius: "10px",
                fontWeight: "600",
                marginBottom: "0.5rem",
                maxWidth: "600px",
                wordBreak: "break-word",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                lineHeight: "1.4",
              }}
            >
              {post.content}
            </p>

            {post.media && (
              <div
                className="media-container"
                onMouseEnter={() => setHoveredPostId(post.id)}
                onMouseLeave={() => setHoveredPostId(null)}
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "600px",
                  margin: "0 auto",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: `4px solid ${getBorderColor(post.id)}`,
                }}
              >
                {(post.mediaType === "image") ? (
                  <img
                    src={post.media}
                    alt="post"
                    style={{
                      width: "100%",
                      height: "300px",
                      display: "block",
                      objectFit: "cover",
                    }}
                  />
                ) : (post.mediaType === "video") ? (
                  <video
                    controls
                    style={{
                      width: "100%",
                      height: "300px",
                      display: "block",
                      objectFit: "cover",
                    }}
                  >
                    <source src={post.media} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "300px",
                      backgroundColor: "#444",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    Unsupported media type
                  </div>
                )}

                {(showOverlay || showThankYou) && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      backgroundColor: showThankYou
                        ? "rgba(255, 255, 255, 0.85)"
                        : "transparent",
                      pointerEvents: "none",
                    }}
                  >
                    {showThankYou ? (
                      <span
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          color: "#28a745",
                          background: "#fff",
                          padding: "0.5rem 1rem",
                          borderRadius: "10px",
                        }}
                      >
                        Thank you for your reaction! {hasReacted}
                      </span>
                    ) : (
                      emojiReactions.map(({ emoji, label }) => (
                        <button
                          key={emoji}
                          title={label}
                          onClick={() => handleReaction(post.id, emoji)}
                          style={{
                            fontSize: "1.8rem",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            pointerEvents: "auto",
                          }}
                        >
                          {emoji}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                fontSize: "0.75rem",
                color: "#aaa",
                marginTop: "0.5rem",
                textAlign: "right",
                maxWidth: "600px",
                marginLeft: "auto",
              }}
            >
              {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
