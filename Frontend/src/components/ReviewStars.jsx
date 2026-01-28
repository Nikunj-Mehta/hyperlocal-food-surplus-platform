import { useState } from "react";

const ReviewStars = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div>
      <div className="flex gap-1 text-2xl">
        {[1, 2, 3, 4, 5].map((value) => (
          <i
            key={value}
            className={`bi ${
              value <= (hover || rating)
                ? "bi-star-fill text-yellow-400"
                : "bi-star text-gray-400"
            } cursor-pointer`}
            onClick={() => setRating(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
          />
        ))}
      </div>

      <button
        onClick={() => {
          if (rating === 0) {
            alert("Please select a rating");
            return;
          }
          onSubmit(rating);
        }}
        className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
      >
        Submit Review
      </button>
    </div>
  );
};

export default ReviewStars;