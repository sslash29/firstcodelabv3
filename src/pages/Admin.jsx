import { useState, useContext } from "react";
import ShowInstructors from "../components/ShowInstructors";
import ShowUsers from "../components/ShowUsers";
import { UsersContext } from "../context/UsersContext";
import Messages from "../components/Messages";
import ShowInstructorDetails from "../components/ShowInstructorDetails";
import ShowUserDetails from "../components/ShowUserDetails"; // ✅ Import ShowUserDetails
import AddUser from "../components/AddUser";
import AddUserBtn from "../components/AddUserBtn";
import Groups from "../components/Groups";
import ShowGroupData from "../components/ShowGroupData";
import { logEvent } from "../utils/logEvent";

function Admin() {
  const [showInstructorDetails, setShowInstructorDetails] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isAddUser, setIsAddUser] = useState(false);
  const [isShowGroup, setIsShowGroup] = useState(false);
  const { studentList, instructor, userData } = useContext(UsersContext);

  const handleShowInstructorDetails = (instructorDetails) => {
    setShowInstructorDetails(true);
    setSelectedInstructor(instructorDetails);
    logEvent(`Viewed instructor ${instructorDetails.name}`, userData.id);
  };

  const handleShowUserDetails = (userDetails) => {
    setShowUserDetails(true);
    setSelectedUser(userDetails);
    logEvent(`Viewed user ${userDetails.name}`, userData.id);
  };

  const handleShowGroupDetails = (groupDetails) => {
    setIsShowGroup(true);
    setSelectedGroup(groupDetails);
    logEvent(`Viewed group ${groupDetails.name || groupDetails}`, userData.id);
  };

  return (
    <div>
      {showInstructorDetails ? (
        <ShowInstructorDetails instructorDetails={selectedInstructor} />
      ) : showUserDetails ? (
        <ShowUserDetails userDetails={selectedUser} />
      ) : isAddUser ? (
        <AddUser />
      ) : isShowGroup ? (
        <ShowGroupData
          group_data={selectedGroup}
          setUserDetails={setSelectedUser}
          showUserDetails={setShowUserDetails}
          setShowInstructorDetails={setShowInstructorDetails}
          setInstrcutorDetails={setSelectedInstructor}
        />
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
          <div>
            <h2 className="text-4xl font-bold">Groups:</h2>
            <Groups handleShowGroupDetails={handleShowGroupDetails} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
