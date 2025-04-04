function AddUserBtn({ setIsAddUser }) {
  return (
    <button
      className="px-4 py-2 bg-blue-200 rounded cursor-pointer"
      onClick={() => setIsAddUser(true)}
    >
      Add+
    </button>
  );
}

export default AddUserBtn;
