import AddUserBtn from "./AddUserBtn";

function ShowInstructors({ instructors = [], onClickFunc, setIsAddUser }) {
  return (
    <div>
      {instructors?.map((ins, n) => {
        return (
          <button
            key={n}
            className="py-1 px-3 rounded hover:scale-90 transition-all cursor-pointer bg-blue-400 text-white"
            onClick={() => onClickFunc(ins)}
          >
            {ins.instructor}
          </button>
        );
      })}
      <AddUserBtn setIsAddUser={setIsAddUser} />
    </div>
  );
}

export default ShowInstructors;
