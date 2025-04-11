import AddUserBtn from "./AddUserBtn";

function ShowUsers({ users = [], onClickFunc, flex, gap, setIsAddUser }) {
  return (
    <div
      className={`${flex ? "flex flex-col" : ""} ${gap ? `gap-${gap}` : ""}`}
    >
      {users?.map((usr, n) => (
        <button
          key={n}
          className=" w-fit py-1 px-3 rounded hover:scale-90 transition-all cursor-pointer bg-blue-400 text-white"
          onClick={() => onClickFunc(usr)}
        >
          {usr.name}
        </button>
      ))}
      <AddUserBtn setIsAddUser={setIsAddUser} />
    </div>
  );
}

export default ShowUsers;
