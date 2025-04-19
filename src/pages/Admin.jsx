import { useState, useContext } from "react";
import ShowInstructors from "../components/ShowInstructors";
import ShowUsers from "../components/ShowUsers";
import { UsersContext } from "../context/UsersContext";
import Messages from "../components/Messages";
import ShowInstructorDetails from "../components/ShowInstructorDetails";
import ShowUserDetails from "../components/ShowUserDetails";
import AddUser from "../components/AddUser";
import AddUserBtn from "../components/AddUserBtn";
import Groups from "../components/Groups";
import ShowGroupData from "../components/ShowGroupData";
import { logEvent } from "../utils/logEvent";
import ShowAdmin from "../components/ShowAdmin";

function Admin() {
  const [showInstructorDetails, setShowInstructorDetails] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isAddUser, setIsAddUser] = useState(false);
  const [isShowGroup, setIsShowGroup] = useState(false);
  const { studentList, allInstructors, userData } = useContext(UsersContext);

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
    <div className="p-4">
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
        <div className="flex flex-wrap gap-8">
          {/* Users Section */}
          <div className="flex-1 min-w-[300px]">
            <h2 className="text-4xl font-bold mb-4">Users:</h2>
            <div className="p-2 border rounded-lg shadow-sm">
              <ShowUsers
                users={studentList}
                onClickFunc={(usr) => handleShowUserDetails(usr)}
                flex={true}
                gap={"4"}
                setIsAddUser={setIsAddUser}
              />
            </div>
          </div>

          {/* Instructors Section */}
          <div className="flex-1 min-w-[300px]">
            <h2 className="text-4xl font-bold mb-4">Instructors:</h2>
            <div className="p-2 border rounded-lg shadow-sm">
              <ShowInstructors
                instructors={allInstructors}
                setIsAddUser={setIsAddUser}
                onClickFunc={(ins) => handleShowInstructorDetails(ins)}
              />
            </div>
          </div>

          {/* Messages Section */}
          <div className="flex-1 min-w-[300px]">
            <h2 className="text-4xl font-bold mb-4">Messages:</h2>
            <div className="p-2 border rounded-lg shadow-sm">
              <Messages
                instructors={allInstructors}
                handleShowInstructorDetails={handleShowInstructorDetails}
              />
            </div>
          </div>

          {/* Admin Section */}
          <div className="flex-1 min-w-[300px]">
            <h2 className="text-4xl font-bold mb-4">Admins:</h2>
            <div className="p-2 border rounded-lg shadow-sm">
              <ShowAdmin />
              <AddUserBtn setIsAddUser={setIsAddUser} />
            </div>
          </div>

          {/* Groups Section */}
          <div className="flex-1 min-w-[300px]">
            <h2 className="text-4xl font-bold mb-4">Groups:</h2>
            <div className="p-2 border rounded-lg shadow-sm">
              <Groups handleShowGroupDetails={handleShowGroupDetails} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
