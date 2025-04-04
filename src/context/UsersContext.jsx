import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../../supabase-client";
import { GroupContext } from "./GroupContext";

const UsersContext = createContext(null);

function UsersProvider({ children }) {
  const [studentList, setStudentList] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const { groupList } = useContext(GroupContext);

  useEffect(() => {
    async function fetchStudents(eqGroup) {
      const { data, error } = await supabase.from("Users").select("*");
      if (!data || error) {
        console.log("Error fetching students:", error);
        return;
      }

      const uniqueStudents = new Map(); // To track unique users by their ID
      const newStudentList = []; // Temporary array to store students

      data.forEach((student) => {
        const studentDetails = student ? Object.values(student) : [];
        studentDetails.forEach((stuKeys) => {
          if (typeof stuKeys === "object") {
            const courses = stuKeys ? Object.values(stuKeys) : [];
            courses.forEach((course) => {
              if (eqGroup) {
                if (course.group && groupList.includes(course.group)) {
                  if (!uniqueStudents.has(student.id)) {
                    uniqueStudents.set(student.id, student);
                    newStudentList.push(student);
                  }
                }
              } else {
                if (!uniqueStudents.has(student.id)) {
                  uniqueStudents.set(student.id, student);
                  newStudentList.push(student);
                }
              }
            });
          }
        });
      });
      setStudentList(newStudentList);
    }
    async function fetchInstructor() {
      const { data, error } = await supabase
        .from("Instructor")
        .select("id, name, ratings, sessions,password");
      if (error) {
        console.error("Error fetching instructors:", error);
        return;
      }

      if (!data) return;

      // Map through data and extract name and id
      const formattedInstructors = data.map((ins) => {
        console.log(ins);
        return {
          instructor: ins.name,
          id: ins.id,
          rating: ins.ratings,
          session: ins.sessions,
          password: ins.password,
          additionaldata: ins,
        };
      });

      setInstructors(formattedInstructors);
    }

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
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export { UsersContext, UsersProvider };
