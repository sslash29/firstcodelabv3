function ShowGroupData({
  group_data,
  setUserDetails,
  showUserDetails,
  setShowInstructorDetails,
  setInstrcutorDetails,
}) {
  const handleShowUserDetails = (userDetails) => {
    setUserDetails(userDetails);
    showUserDetails(true);
  };
  const handleShowInsDetails = (insDetails) => {
    setInstrcutorDetails(insDetails);
    setShowInstructorDetails(true);
  };
  console.log(group_data);
  return (
    <div>
      <h1 className="text-4xl font-bold">{group_data.Group.group_name}:</h1>
      <div className="pl-4">
        <h3 className="text-2xl font-semibold">Users:</h3>
        <p
          className="bg-blue-300 rounded border text-white text-lg hove:scale-105 w-fit p-2 cursor-pointer"
          onClick={() => handleShowUserDetails(group_data.Users)}
        >
          {group_data.Users.name}
        </p>
        <h3 className="text-2xl font-semibold">Instructors:</h3>
        <p
          className="bg-blue-300 rounded border text-white text-lg hove:scale-105 w-fit p-2 cursor-pointer"
          onClick={() => handleShowInsDetails(group_data.Instructor)}
        >
          {group_data.Instructor.name}
        </p>
      </div>
    </div>
  );
}

export default ShowGroupData;
