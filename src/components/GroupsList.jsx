// src/components/GroupsList.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import GroupCommunityAccordion from "./GroupCommunityAccordion";

const GroupsList = ({ userId }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const groupsRef = collection(db, "Groups");
        const snapshot = await getDocs(groupsRef);

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    }

    fetchGroups();
  }, []);

  const handleJoin = (group) => {
    console.log("Joining group:", group);
    // TODO: Firestore update (add user to group.members)
  };

  return (
    <div>
      {groups.length === 0 ? (
        <p style={{ color: "#fff" }}>No groups yet. Create one!</p>
      ) : (
        groups.map(group => (
          <GroupCommunityAccordion
            key={group.id}
            item={group}
            onJoin={handleJoin}
          />
        ))
      )}
    </div>
  );
};

export default GroupsList;
