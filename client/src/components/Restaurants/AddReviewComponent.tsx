import React, { useState, useEffect } from 'react';
import Rating from '@material-ui/lab/Rating';
import { TextField, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

interface Props {
  handleAddReview: (rating: number, comment: string) => Promise<void>;
}

const AddReviewComponent = ({ handleAddReview }: Props) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(!rating);
  }, [rating]);

  const handleClick = () => {
    handleAddReview(rating, comment);
    setRating(0);
    setComment('');
  };

  return (
    <div className="flex flex-col mt-10 items-start w-200">
      <Typography variant="h6">Write a review</Typography>
      <Rating
        name="reply-rating"
        value={rating}
        onChange={(e, newValue) => setRating(newValue as number)}
      />
      <TextField
        name="comment"
        className="w-200"
        multiline
        rows={4}
        label="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button
        disabled={disabled}
        onClick={handleClick}
        variant="contained"
        color="secondary"
        className="mt-10 self-end"
      >
        Add
      </Button>
    </div>
  );
};
export default AddReviewComponent;
