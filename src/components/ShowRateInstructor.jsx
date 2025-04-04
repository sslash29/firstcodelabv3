import { useState } from "react";
import Rate from "./Rate";
import supabase from "../../supabase-client";
import ShowInstructors from "./ShowInstructors";

function ShowRateInstructor({ instructors, userData }) {
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [ratings, setRatings] = useState({
    explanation: 0,
    homework: 0,
    record: 0,
    additionalText: "",
  });

  async function sendInsRating() {
    if (!selectedInstructor) {
      console.error("No instructor selected");
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
    const { data: instructorData, error: fetchError } = await supabase
      .from("Instructor")
      .select("ratings")
      .eq("id", selectedInstructor.instructor_id)
      .single();

    if (fetchError) {
      console.error("Error fetching ratings:", fetchError);
      return;
    }
    const existingRatings = instructorData?.ratings || {}; // Get existing ratings or an empty object

    // Update or add the student's rating
    const updatedRatings = { ...existingRatings, [studentKey]: newRatingEntry };

    // Update in Supabase
    const { data, error } = await supabase
      .from("Instructor")
      .update({ ratings: updatedRatings })
      .eq("id", selectedInstructor.instructor_id);

    if (error) {
      console.error("Error updating rating:", error);
    } else {
      console.log("Rating updated successfully:", data);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Instructors:</h2>
      <div className="flex flex-col gap-3">
        <ShowInstructors
          instructors={instructors}
          onClickFunc={(ins) =>
            setSelectedInstructor((prev) => (prev === ins ? null : ins))
          }
        />
      </div>

      {selectedInstructor && (
        <Rate
          name={selectedInstructor.instructor}
          ratings={ratings}
          setRatings={setRatings}
          onSubmit={sendInsRating} // Pass submit function to Rate component
        />
      )}
    </div>
  );
}

export default ShowRateInstructor;
