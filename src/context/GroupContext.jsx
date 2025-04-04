import { createContext, useEffect, useState } from "react";
import supabase from "../../supabase-client";

const GroupContext = createContext(null);

function GroupProvider({ children }) {
  const [filteredGroups, setFilteredGroups] = useState([]); // For autocomplete
  const [groupList, setGroupList] = useState([]); // Store fetched groups
  useEffect(() => {
    async function fetchGroups() {
      const { data, error } = await supabase
        .from("Users")
        .select("courses")
        .not("courses", "is", null);

      if (error) {
        console.error("Error fetching groups:", error);
        return;
      }

      // Extract groups from JSON objects
      const uniqueGroups = new Set();

      data.forEach((item) => {
        const courses = item.courses;
        if (courses && typeof courses === "object") {
          Object.values(courses).forEach((course) => {
            if (course.group) {
              uniqueGroups.add(course.group);
            }
          });
        }
      });

      setGroupList([...uniqueGroups]);
    }
    fetchGroups();
  }, []);

  return (
    <GroupContext.Provider
      value={{ filteredGroups, setFilteredGroups, groupList, setGroupList }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export { GroupContext, GroupProvider };
