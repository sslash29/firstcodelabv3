import { useContext, useEffect, useState } from "react";
import ShowCourses from "../components/ShowCourses";
import ShowHomework from "../components/ShowHomework";
import ShowRateInstructor from "../components/ShowRateInstructor";
import { UsersContext } from "../context/UsersContext";

function User({ userData }) {
  const courses = userData.courses ? Object.keys(userData.courses) : [];
  const coursesDetail = userData.courses ? Object.values(userData.courses) : [];
  const { instructors, setInstructors } = useContext(UsersContext);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!setInstructors) {
      console.error(
        "setInstructors is undefined! Make sure it's in GroupContext.Provider."
      );
      return;
    }

    if (!coursesDetail.length) return;

    // Extract all groups
    const extractedGroups = coursesDetail.map((course) => course.group);
    setGroups(extractedGroups);

    // Update instructors excluding group key
    const updatedInstructors = coursesDetail.map(
      ({ group, ...course }) => course
    );
    setInstructors(updatedInstructors);

    console.log("Extracted Groups:", extractedGroups);
    console.log("Updated Instructors:", updatedInstructors);
  }, []);

  return (
    <div className="flex justify-between">
      <ShowCourses courses={courses} />
      <ShowHomework group={groups} />
      <ShowRateInstructor instructors={instructors} userData={userData} />
    </div>
  );
}

export default User;
