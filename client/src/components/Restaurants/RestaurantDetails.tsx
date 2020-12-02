import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { TextField, Typography } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Rating from '@material-ui/lab/Rating';
import MaterialTable, {
  EditCellColumnDef,
  EditComponentProps,
} from 'material-table';

import axios from 'services/axiosService';
import { Restaurant as IRestaurant, Review, RootState } from 'types';
import MultilineEdit from '../Shared/MultilineEdit';
import DetailRating from '../Shared/DetailRating';
import DatePickerEdit from '../Shared/DatePickerEdit';
import AddReviewComponent from './AddReviewComponent';
import * as coreActions from 'store/actions/core';
import { isArray } from 'lodash';

type Restaurant = IRestaurant & EditCellColumnDef;
interface Props {
  open: boolean;
  handleClose: () => void;
  handleReply: () => void;
  curRestaurant: Restaurant;
  handleReviewChange: (rest: Restaurant) => void;
}

interface ReplyDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  value: string;
}

function ReplyDialog(props: ReplyDialogProps) {
  const { onClose, open, value } = props;
  const [val, setVal] = useState<string>(value);

  const handleClick = () => {
    setVal('');
    onClose(val);
  };

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Reply to the comment</DialogTitle>
      <DialogContent>
        <TextField
          value={val}
          label="Reply Text"
          rows="4"
          multiline
          style={{ width: 400 }}
          onChange={(e) => setVal(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose('')} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClick} color="primary">
          Reply
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function RestaurantDetails(props: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState<boolean>(props.open);
  const { reviews: reviewsProp } = props.curRestaurant;

  const [reviews, setReviews] = useState<Review[]>([]);

  const [dlgOpen, setDlgOpen] = useState<boolean>(false);
  const user = useSelector(({ auth }: RootState) => auth.user);
  const [isNotRepliedOnly, setIsNotRepliedOnly] = useState(
    user.role === 'owner'
  );
  const [maxReview, setMaxReview] = useState<Review>();
  const [minReview, setMinReview] = useState<Review>();

  const curReview = useRef<any>();
  const dispatch = useDispatch();

  const isAdmin = user.role === 'admin';
  const isRegular = user.role === 'regular';
  const isOwner = user.role === 'owner';

  let customProps: any = {};

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  useEffect(() => {
    if (!isArray(reviewsProp)) return;
    let temp = reviewsProp;
    temp.sort((a, b) => {
      return b.rating - a.rating;
    });
    setMaxReview(temp[0]);
    setMinReview(temp[temp.length - 1]);
    temp = reviewsProp.sort((a, b) => b.visited.localeCompare(a.visited));
    if (isNotRepliedOnly) temp = temp.filter((item) => !item.reply);
    setReviews(temp);
  }, [reviewsProp, isNotRepliedOnly]);

  const handleAddReview = async (rating: number, comment: string) => {
    try {
      const res: { data: Restaurant } = await axios.post(
        `/api/restaurants/${props.curRestaurant._id}/reviews/`,
        {
          rating,
          comment,
          restaurantId: props.curRestaurant._id,
        }
      );
      props.handleReviewChange(res.data);
      dispatch(coreActions.showMessage({ message: 'Add review succeed.' }));
    } catch ({ response }) {
      console.log(response.data);
      const { message } = response.data;
      dispatch(coreActions.showMessage({ message }));
    }
  };

  const handleRowUpdate = async (newData: any, oldData?: any) => {
    try {
      const res: {
        data: Restaurant;
      } = await axios.post(
        `/api/restaurants/${props.curRestaurant._id}/reviews/${oldData._id}`,
        { ...newData }
      );
      props.handleReviewChange(res.data);
      dispatch(coreActions.showMessage({ message: 'Update review succeed.' }));
    } catch ({ response }) {
      console.log(response.data);
      const { message } = response.data;
      dispatch(coreActions.showMessage({ message }));
    }
  };
  const handleRowDelete = async (oldData: any) => {
    try {
      const res: { data: Restaurant } = await axios.delete(
        `/api/restaurants/${props.curRestaurant._id}/reviews/${oldData._id}`
      );
      props.handleReviewChange(res.data);
      dispatch(coreActions.showMessage({ message: 'Delete review succeed.' }));
    } catch ({ response }) {
      console.log(response.data);
      const { message } = response.data;
      dispatch(coreActions.showMessage({ message }));
    }
  };

  const handleClose = async (value: string) => {
    try {
      setDlgOpen(false);
      if (!value) return;
      const res = await axios.post(
        `/api/restaurants/${props.curRestaurant._id}/reviews/reply/`,
        {
          _id: curReview.current._id,
          reply: value,
        }
      );
      props.handleReviewChange(res.data);
      dispatch(
        coreActions.showMessage({ message: 'Reply to comment succeed.' })
      );
    } catch ({ response }) {
      console.log(response.data);
      const { message } = response.data;
      dispatch(coreActions.showMessage({ message }));
    }
  };

  if (isRegular) {
    customProps = {
      actions: [],
    };
  } else if (isAdmin) {
    customProps = {
      actions: [],
      editable: {
        onRowUpdate: handleRowUpdate,
        onRowDelete: handleRowDelete,
      },
    };
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth="lg"
      open={open}
      onClose={props.handleClose}
      PaperProps={{
        className: 'w-full',
      }}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        Restaurant Review Details
      </DialogTitle>
      <DialogContent>
        {props.curRestaurant.avgRating !== undefined && (
          <div>
            <Typography>
              <span className="text-lg">
                {props.curRestaurant.avgRating.toFixed(1)}
              </span>{' '}
              out of 5 - {reviews.length} Ratings
            </Typography>
            {reviews.length ? (
              <div className="flex justify-between mb-20">
                <DetailRating review={maxReview} label="Highest Rated Review" />
                <DetailRating review={minReview} label="Lowest Rated Review" />
              </div>
            ) : null}
            {isOwner && (
              <FormControlLabel
                control={
                  <Switch
                    checked={isNotRepliedOnly}
                    onChange={(e) => setIsNotRepliedOnly(e.target.checked)}
                    name="checkedA"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                }
                label="Pending Reply Only"
              />
            )}
            <MaterialTable
              title="Reviews List"
              className="my-8"
              columns={[
                {
                  title: 'Rating',
                  field: 'rating',
                  render: (rowData: any) => (
                    <Rating
                      name="show-review-rating"
                      value={rowData.rating}
                      readOnly
                    />
                  ),
                  editComponent: (props: EditComponentProps<any>) => (
                    <Rating
                      name="edit-review-rating"
                      onChange={(e, newVal) => props.onChange(newVal)}
                      value={props.value}
                    ></Rating>
                  ),
                },
                {
                  title: 'Rated By',
                  field: 'ratedBy.name',
                  editable: 'never',
                },
                {
                  title: 'Comment',
                  field: 'comment',
                  editComponent: MultilineEdit,
                },
                {
                  title: 'Visited',
                  field: 'visited',
                  editComponent: DatePickerEdit,
                },
                {
                  title: 'Reply',
                  field: 'reply',
                  editComponent: MultilineEdit,
                },
              ]}
              actions={[
                (rowData: any) => ({
                  icon: 'reply',
                  tooltip: 'Add reply',
                  onClick: (event, rowData) => {
                    setDlgOpen(true);
                    curReview.current = rowData;
                  },
                  hidden: rowData.reply,
                }),
              ]}
              {...customProps}
              data={reviews}
              options={{
                actionsColumnIndex: -1,
                search: false,
                sorting: false,
              }}
            />
          </div>
        )}
        {isRegular && <AddReviewComponent handleAddReview={handleAddReview} />}
        <ReplyDialog open={dlgOpen} onClose={handleClose} value="" />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
