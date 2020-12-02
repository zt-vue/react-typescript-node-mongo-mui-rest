import React from 'react';
import Rating from '@material-ui/lab/Rating';
import { Review } from 'types';
import { Typography } from '@material-ui/core';

interface Props {
  review: Review | undefined;
  label: string;
}

const DetailRating = ({ review, label }: Props) => {
  return (
    <div>
      <p>{label}</p>
      <div className="flex">
        <Rating
          name="detail-rating"
          size="small"
          value={review?.rating || 0}
          readOnly
        />
        <span className="ml-24">{review?.visited}</span>
      </div>
      <p className="mt-4 mb-0">{review?.comment}</p>
      {review?.reply ? (
        <Typography
          variant="caption"
          className="border-solid border-0 border-l border-gray-500 pl-2"
        >
          {review?.reply}
        </Typography>
      ) : null}
    </div>
  );
};
export default DetailRating;
