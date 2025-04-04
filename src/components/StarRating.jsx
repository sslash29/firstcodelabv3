import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

function StarRating({
  maxStars = 5,
  onRate,
  filledColor = "#FFD700",
  emptyColor = "#D1D5DB",
}) {
  const [hoveredStars, setHoveredStars] = useState(0);
  const [selectedStars, setSelectedStars] = useState(0);

  const handleRate = (rating) => {
    setSelectedStars(rating);
    if (onRate) onRate(rating); // Send rating to parent
  };

  return (
    <div className="flex space-x-1">
      {Array.from({ length: maxStars }, (_, i) => {
        const starIndex = i + 1;
        return (
          <motion.div
            key={starIndex}
            onMouseEnter={() => setHoveredStars(starIndex)}
            onMouseLeave={() => setHoveredStars(0)}
            onClick={() => handleRate(starIndex)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="cursor-pointer"
          >
            <Star
              size={30}
              color={
                starIndex <= (hoveredStars || selectedStars)
                  ? filledColor
                  : emptyColor
              }
              fill={
                starIndex <= (hoveredStars || selectedStars)
                  ? filledColor
                  : "none"
              }
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export default StarRating;
