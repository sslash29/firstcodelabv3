import { useEffect, useState } from "react";
import supabase from "../../supabase-client";

function ShowAdmin() {
  const [admins, setAdmins] = useState(null);

  useEffect(() => {
    async function fetchAdmins() {
      const { data, error } = await supabase.from("Admin").select("*");

      if (error) {
        console.error("Error occurred while fetching admins:", error);
      } else {
        console.dir(data);
        setAdmins(data);
      }
    }
    fetchAdmins();
  }, []);

  // Check if admins are available
  if (!admins) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul>
        {admins.map((admin) => (
          <li key={admin.id}>{admin.name}</li> // Display the name of each admin
        ))}
      </ul>
    </div>
  );
}

export default ShowAdmin;
