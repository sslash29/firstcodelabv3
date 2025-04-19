import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../../supabase-client";

const UsersContext = createContext(null);

function UsersProvider({ children }) {
  const [studentList, setStudentList] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [allInstructors, setAllInstructors] = useState([]);
  const [userData, setUserData] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("api/me", {
          credentials: "include", // 👈 This ensures the cookie is sent
        });

        if (res.ok) {
          const data = await res.json();
          setUserData(data); // Restore user state
        }
      } catch (error) {
        console.error("Not logged in or session expired");
      }
    }

    async function fetchStudents() {
      const { data, error } = await supabase.from("Users").select("*");
      if (!data || error) {
        console.log("Error fetching students:", error);
        return;
      }

      setStudentList(data);
    }

    async function fetchInstructor() {
      const { data, error } = await supabase
        .from("Group_users")
        .select("id, user_id(*), instructor_id(*)")
        .eq("user_id", userData.id);
      if (error) {
        console.error("Error fetching instructors:", error);
        return;
      }

      if (!data) return;

      console.log(data);

      // Map through data and extract name and id
      const formattedInstructors = data.map((ins) => {
        return {
          instructor: ins.instructor_id?.name || "Unnamed",
          id: ins.instructor_id?.id,
          rating: ins.instructor_id?.ratings,
          session: ins.instructor_id?.sessions,
          password: ins.instructor_id?.password,
          additionaldata: ins,
        };
      });

      setInstructors(formattedInstructors);
    }

    async function fetchAllInstrcutors() {
      const { data, error } = await supabase.from("Instructor").select("*");
      if (error)
        console.error("error occured while fetching all instructors", error);
      console.dir(data);
      setAllInstructors(data);
    }
    fetchUser();
    fetchAllInstrcutors();
    fetchStudents();
    fetchInstructor();
  }, []);

  return (
    <UsersContext.Provider
      value={{
        studentList,
        setStudentList,
        instructors,
        setInstructors,
        userData,
        setUserData,
        allInstructors,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export { UsersContext, UsersProvider };
