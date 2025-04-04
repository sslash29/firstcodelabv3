import { useState } from "react";
import Rate from "./Rate";
import supabase from "../../supabase-client";
import ShowUsers from "./ShowUsers";

function ShowRateUser({ users, userData }) {
  const [selectedUser, setselectedUser] = useState(null);
  const [ratings, setRatings] = useState({
    focus: 0,
    homework: 0,
    preformance: 0,
    additionalText: "",
  });

  async function sendInsRating() {
    if (!selectedUser) {
      console.error("No user selected");
      return;
    }

    const studentKey = `${userData.name}_${userData.id}`;

    const newRatingEntry = {
      created_at: new Date().toISOString(),
      student_id: userData.id,
      recording: ratings.record,
      explanation: ratings.explanation,
      homework: ratings.homework,
      additionalText: ratings.additionalText,
      overall: ratings.explanation + ratings.homework + ratings.record,
    };

    // Fetch existing ratings
    const { data: studentData, error: fetchError } = await supabase
      .from("Users")
      .select("ratings")
      .eq("id", selectedUser.id)
      .single();

    if (fetchError) {
      console.error("Error fetching ratings:", fetchError);
      return;
    }
    const existingRatings = studentData?.ratings || {}; // Get existing ratings or an empty object

    // Update or add the student's rating
    const updatedRatings = { ...existingRatings, [studentKey]: newRatingEntry };

    // Update in Supabase
    const { data, error } = await supabase
      .from("Users")
      .update({ ratings: updatedRatings })
      .eq("id", selectedUser.id);

    if (error) {
      console.error("Error updating rating:", error);
    } else {
      console.log("Rating updated successfully:", data);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">users:</h2>
      <div className="flex flex-col gap-3">
        <ShowUsers
          users={users}
          onClickFunc={(usr) =>
            setselectedUser((prev) => (prev === usr ? null : usr))
          }
        />
      </div>

      {selectedUser && (
        <Rate
          name={selectedUser.name}
          ratings={ratings}
          setRatings={setRatings}
          onSubmit={sendInsRating}
          first_column="focus/تركيز"
          second_column="homeworkd/الواجب"
          third_column="performance"
          // Pass submit function to Rate component
        />
      )}
    </div>
  );
}

export default ShowRateUser;
