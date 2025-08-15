
import React, { useState } from 'react';
import { StarIcon } from './icons';

interface RatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const Rating: React.FC<RatingProps> = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="p-0.5 bg-transparent border-none cursor-pointer"
        >
          <StarIcon
            className={`w-5 h-5 transition-colors duration-200 ${
              (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default Rating;
