import { useContext } from "react";
import { GroupContext } from "../context/GroupContext";

function Groups({ handleShowGroupDetails }) {
  const { groupList } = useContext(GroupContext);

  return (
    <div className="flex flex-col gap-1.5">
      {groupList?.map((group, index) => {
        console.log(group);
        return (
          <button
            className="py-2 px-2 text-white rounded hover:scale-105 bg-blue-400 cursor-pointer"
            key={index}
            onClick={() => handleShowGroupDetails(group)}
          >
            {group.Group.group_name}
          </button>
        );
      })}
    </div>
  );
}

export default Groups;
