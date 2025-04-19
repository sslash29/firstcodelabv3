import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../../supabase-client";
import { GroupContext } from "./GroupContext";

const UsersContext = createContext(null);

function UsersProvider({ children }) {
  const [studentList, setStudentList] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [allInstructors, setAllInstructors] = useState([]);
  const [userData, setUserData] = useState(() => {
    const storedData = localStorage.getItem("userData");
    return storedData ? JSON.parse(storedData) : "";
  });

  const { groupList } = useContext(GroupContext);

  useEffect(() => {
    async function fetchStudents() {
      const { data, error } = await supabase.from("Users").select("*");
      if (!data || error) {
        console.log("Error fetching students:", error);
        return;
      }

      // const uniqueStudents = new Map(); // To track unique users by their ID
      // const newStudentList = []; // Temporary array to store students

      // data.forEach((student) => {
      //   const studentDetails = student ? Object.values(student) : [];
      //   studentDetails.forEach((stuKeys) => {
      //     if (typeof stuKeys === "object") {
      //       const courses = stuKeys ? Object.values(stuKeys) : [];
      //       courses.forEach((course) => {
      //         if (eqGroup) {
      //           if (course.group && groupList.includes(course.group)) {
      //             if (!uniqueStudents.has(student.id)) {
      //               uniqueStudents.set(student.id, student);
      //               newStudentList.push(student);
      //             }
      //           }
      //         } else {
      //           if (!uniqueStudents.has(student.id)) {
      //             uniqueStudents.set(student.id, student);
      //             newStudentList.push(student);
      //           }
      //         }
      //       });
      //     }
      //   });
      // });
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
