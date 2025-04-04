import { useState } from "react";
import StarRating from "./StarRating";

function Rate({
  name,
  ratings,
  setRatings,
  onSubmit,
  first_column = "Explanation/شرح",
  second_column = "Homework/الواجب",
  third_column = "Record/تسجيل",
}) {
  const [text, setText] = useState("");
  const handleRatingChange = (category, rating) => {
    setRatings((prev) => ({ ...prev, [category]: rating }));
  };

  return (
    <div className="flex flex-col justify-center shadow w-fit p-7 space-y-5">
      <h1 className="text-3xl font-bold w-full mb-5 text-center">
        Rate {name}
      </h1>
      <div className="text-center">
        <p>{first_column}</p>
        <StarRating
          maxStars={5}
          onRate={(rating) => handleRatingChange("explanation", rating)}
        />
      </div>
      <div className="text-center">
        <p>{second_column}</p>
        <StarRating
          maxStars={5}
          onRate={(rating) => handleRatingChange("homework", rating)}
        />
      </div>
      <div className="text-center">
        <p>{third_column}</p>
        <StarRating
          maxStars={5}
          onRate={(rating) => handleRatingChange("record", rating)}
        />
      </div>
      <div>
        <p>
          Overall Rating{" "}
          {ratings.explanation + ratings.homework + ratings.record}
        </p>
      </div>
      <textarea
        placeholder="additional explanation(optional)s "
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          handleRatingChange("additionalText", text);
        }}
      />
      <button
        className="py-2 px-5 bg-blue-400 text-white hover:scale-90 transition-all"
        onClick={onSubmit} // Call the function from ShowInstructor
      >
        Submit
      </button>
    </div>
  );
}

export default Rate;
