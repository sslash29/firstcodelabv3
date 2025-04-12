import { useEffect } from "react";
import supabase from "../../supabase-client";

function Test() {
  useEffect(() => {
    async function fetchInsconst() {
      const { data, error } = await supabase
        .from("Instructor")
        .select("groups")
        .contains("groups", ["wow"]);
      if (error) console.error("Error fetching groups", error);
      console.log(data);
    }
    fetchInsconst();
  }, []);
  return <div>this is a test page</div>;
}

export default Test;
