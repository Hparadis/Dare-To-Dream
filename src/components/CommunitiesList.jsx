// src/components/CommunitiesList.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import GroupCommunityAccordion from "./GroupCommunityAccordion";

const CommunitiesList = ({ userId }) => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    async function fetchCommunities() {
      try {
        const communitiesRef = collection(db, "Communities");
        const snapshot = await getDocs(communitiesRef);

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCommunities(data);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    }

    fetchCommunities();
  }, []);

  const handleJoin = (community) => {
    console.log("Joining community:", community);
    // TODO: Firestore update (add user to community.members)
  };

  return (
    <div>
      {communities.length === 0 ? (
        <p style={{ color: "#fff" }}>No communities yet. Create one!</p>
      ) : (
        communities.map(community => (
          <GroupCommunityAccordion
            key={community.id}
            item={community}
            onJoin={handleJoin}
          />
        ))
      )}
    </div>
  );
};

export default CommunitiesList;
