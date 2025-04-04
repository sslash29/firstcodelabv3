import { useContext } from "react";
import { GroupContext } from "../context/GroupContext";

function ShowGroups({ selectGroup }) {
  const { filteredGroups } = useContext(GroupContext);
  return (
    <div>
      {filteredGroups.length > 0 && (
        <ul className="absolute bg-white border rounded w-48 shadow-md mt-1 z-10">
          {filteredGroups.map((g, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => selectGroup(g)}
            >
              {g}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ShowGroups;
