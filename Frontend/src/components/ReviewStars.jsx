import { useState } from "react";
import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";

const ReviewStars = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <Stack spacing={1.5} alignItems="flex-start">
      <Stack direction="row" spacing={0.25}>
        {[1, 2, 3, 4, 5].map((value) => {
          const active = value <= (hover || rating);

          return (
            <Tooltip key={value} title={`${value} star${value > 1 ? "s" : ""}`}>
              <IconButton
                color={active ? "warning" : "default"}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(0)}
                size="small"
              >
                {active ? <Star /> : <StarBorder />}
              </IconButton>
            </Tooltip>
          );
        })}
      </Stack>

      <Button
        variant="contained"
        size="small"
        onClick={() => {
          if (rating === 0) {
            alert("Please select a rating");
            return;
          }
          onSubmit(rating);
        }}
      >
        Submit Review
      </Button>
    </Stack>
  );
};

export default ReviewStars;
