import { useEffect, useState } from "react";
import supabase from "../../supabase-client";

function ShowHomework({ group }) {
  const [homeworks, setHomeworks] = useState([]);
  const [noMatch, setNoMatch] = useState(false);

  useEffect(() => {
    async function fetchHomeworks() {
      if (!group || group.length === 0) {
        console.log("No group provided yet. Waiting...");
        return;
      }

      const { data, error } = await supabase.from("Homeworks").select("*");

      if (error) {
        console.error("Error fetching homeworks:", error);
        return;
      }

      if (!data || data.length === 0) {
        console.log("No homeworks found.");
        setNoMatch(true);
        return;
      }

      console.log("Fetched Homeworks:", data);
      console.log("Groups to match:", group);

      // Filter homeworks that match any group in the `group` array
      const filteredHomeworks = data.filter((hw) => group.includes(hw.group));

      if (filteredHomeworks.length === 0) {
        console.log("No matching homeworks found.");
        setNoMatch(true);
      } else {
        setHomeworks(filteredHomeworks);
        setNoMatch(false);
      }
    }

    if (Array.isArray(group) && group.length > 0) {
      fetchHomeworks();
    }
  }, [group]);

  return (
    <div className="ml-6">
      <h2 className="text-xl font-semibold">Homeworks:</h2>
      {noMatch ? (
        <p>No matching homeworks found.</p>
      ) : (
        <ul>
          {homeworks.map((hw) => (
            <div key={hw.id} className="flex gap-3 ml-2 items-center">
              <li>
                {hw.name} - deadline: {hw.deadline}
              </li>
              <button className="py-2 px-5 bg-blue-400 rounded hover:scale-90 transition-all cursor-pointer">
                <a target="_blank" href={hw.file_url}>
                  homework
                </a>
              </button>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ShowHomework;
