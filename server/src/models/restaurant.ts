import mongoose, { PaginateModel } from 'mongoose';
import { mongoosePagination } from 'ts-mongoose-pagination';
const Schema = mongoose.Schema;
import Joi from '@hapi/joi';

// Use native promises.
mongoose.Promise = global.Promise;

export type ReviewDocument = mongoose.Document & {
  rating: number;
  comment?: string;
  ratedBy: mongoose.Schema.Types.ObjectId;
  visited: string;
  reply?: string;
};

const ReviewSchema = new Schema({
  rating: { type: Number, required: true },
  comment: { type: String },
  visited: { type: String, required: true },
  reply: { type: String },
  ratedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export type RestaurantDocument = mongoose.Document & {
  name: string;
  address: string;
  user: mongoose.Schema.Types.ObjectId;
  reviews: ReviewDocument[];
  avgRating: number;
};

const RestaurantSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  reviews: [ReviewSchema],
  avgRating: { type: Number, default: 0 },
});

RestaurantSchema.plugin(mongoosePagination);

const validateRestaurant = async (restaurant: RestaurantDocument) => {
  const schema = Joi.object({
    address: Joi.string().min(1).required(),
    name: Joi.string().min(1).required(),
  })
    .options({ presence: 'required' })
    .unknown(true);

  await schema.validateAsync(restaurant);
  return true;
};

export const Average = (reviews: ReviewDocument[]) => {
  return reviews.reduce((sum, val) => sum + val.rating, 0) / reviews.length;
};

RestaurantSchema.pre('validate', async function save(next) {
  const restaurant = this as RestaurantDocument;
  await validateRestaurant(restaurant);
});
RestaurantSchema.pre('save', function (next) {
  // Make sure certain fields are blank depending on the User type.
  // Make sure the password is hashed before being stored.
  const restaurant = this as RestaurantDocument;
  restaurant.avgRating = Average(restaurant.reviews);
  next();
});

export const Restaurant: PaginateModel<RestaurantDocument> = mongoose.model(
  'Restaurant',
  RestaurantSchema
);
export const Review = mongoose.model<ReviewDocument>('Review', ReviewSchema);
