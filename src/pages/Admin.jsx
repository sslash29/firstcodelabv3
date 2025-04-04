import { useState, useContext } from "react";
import ShowInstructors from "../components/ShowInstructors";
import ShowUsers from "../components/ShowUsers";
import { UsersContext } from "../context/UsersContext";
import Messages from "../components/Messages";
import ShowInstructorDetails from "../components/ShowInstructorDetails";
import ShowUserDetails from "../components/ShowUserDetails"; // ✅ Import ShowUserDetails
import AddUser from "../components/AddUser";
import AddUserBtn from "../components/AddUserBtn";

function Admin({ userData }) {
  const [showInstructorDetails, setShowInstructorDetails] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isAddUser, setIsAddUser] = useState(false);
  const { studentList, instructors } = useContext(UsersContext);

  const handleShowInstructorDetails = (instructorDetails) => {
    setShowInstructorDetails(true);
    setSelectedInstructor(instructorDetails);
  };

  const handleShowUserDetails = (userDetails) => {
    setShowUserDetails(true);
    setSelectedUser(userDetails);
  };

  return (
    <div>
      {showInstructorDetails ? (
        <ShowInstructorDetails instructorDetails={selectedInstructor} />
      ) : showUserDetails ? (
        <ShowUserDetails userDetails={selectedUser} />
      ) : isAddUser ? (
        <AddUser />
      ) : (
        <div className="flex justify-between flex-wrap">
          <div>
            <h2 className="text-4xl font-bold">Users:</h2>
            <div className="p-2">
              <ShowUsers
                users={studentList}
                onClickFunc={(usr) => handleShowUserDetails(usr)}
                flex={true}
                gap={"4"}
                setIsAddUser={setIsAddUser}
              />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold">Instructors:</h2>
            <div className="p-2">
              <ShowInstructors
                instructors={instructors}
                setIsAddUser={setIsAddUser}
                onClickFunc={(ins) => handleShowInstructorDetails(ins)}
              />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold">Messages:</h2>
            <div className="p-2">
              <Messages
                instructors={instructors}
                handleShowInstructorDetails={handleShowInstructorDetails}
              />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold">
              Admin
              <AddUserBtn setIsAddUser={setIsAddUser} />
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
