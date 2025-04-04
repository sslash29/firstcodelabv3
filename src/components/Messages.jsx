  function Messages({ instructors, handleShowInstructorDetails }) {
  return ( 
    <div>
      {
        instructors
          .map((ins) => {
            // Ensure rating exists and is an object
            
            const ratings = ins.rating ? Object.values(ins.rating) : [];

            // Extract overall ratings separately
            const overallRatings = ratings
              .map((rateObj) => rateObj.overall)
              .filter((val) => typeof val === "number");

            // Extract all numerical ratings, excluding `student_id`
            const allRatings = ratings.flatMap((rateObj) =>
              Object.entries(rateObj)
                .filter(
                  ([key, val]) =>
                    key !== "student_id" && typeof val === "number"
                )
                .map(([_, val]) => val)
            );

            // Check if any overall rating is below 10
            const hasLowOverall = overallRatings.some((rate) => rate < 10);

            // Check if any rating (except `student_id`) is 2 or below
            const hasVeryLowRating = allRatings.some((rate) => rate <= 2);

            // Only return instructors with low ratings
            if (hasLowOverall || hasVeryLowRating) {
              return (
                <div key={ins.id} className="cursor-pointer" onClick={() => {handleShowInstructorDetails(ins);}}>
                  <span className="text-red-500 font-semibold">
                    {ins.instructor}
                    {hasLowOverall && <p>overall rating is below 10</p>}
                    {hasVeryLowRating && (
                      <p>Some ratings are dangerously low</p>
                    )}
                  </span>
                </div>
              );
            }

            return null; // Exclude instructors with good ratings
          })
          .filter(Boolean) // Remove null values from the map
      }
    </div>
  );
}

export default Messages;
