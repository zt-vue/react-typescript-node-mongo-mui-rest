import { Response } from 'express';
import { Request, UserRoles } from '../types';
import {
  Restaurant,
  RestaurantDocument,
  Review,
  ReviewDocument,
} from '../models/restaurant';
import { isValidObjectId, IPaginateResult } from 'mongoose';
import asyncHandler from 'express-async-handler';
import { HttpStatus, ErrorStatus } from '../util/HttpStatus';
import { check, validationResult, query } from 'express-validator';

export default {
  getRestaurants: asyncHandler(async (req: Request, res: Response) => {
    try {
      await query('page', 'Page is not valid').isInt().run(req);
      await query('perPage', 'perPage is not valid').isInt().run(req);
      await query('filter', 'filter is not valid')
        .isFloat({ min: 1, max: 5 })
        .run(req);
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: true, message: errors.array()[0].msg });
      let user = req.user;
      const page: number = Number(req.query.page) + 1;
      const perPage: number = Number(req.query.perPage) || 2;
      const filter: number = Number(req.query.filter) || 5;
      const condition: any = {
        avgRating: { $lte: filter },
      };
      const options = {
        perPage: parseInt(perPage.toString()),
        sort: { avgRating: -1 },
        page: parseInt(page.toString()),
        populate: [
          {
            path: 'user',
            select: 'name',
          },
          {
            path: 'reviews.ratedBy',
            select: 'name',
          },
        ],
      };
      if (user.role === UserRoles.owner) {
        condition.user = user._id;
      }
      const totalCount = await Restaurant.countDocuments(condition);
      const resP: IPaginateResult<RestaurantDocument> = await Restaurant.paginate(
        condition,
        options
      );
      let pageNum: number = resP.pagination.page;
      if (pageNum * resP.data.length > totalCount) {
        pageNum = totalCount / resP.data.length;
      }
      res.status(HttpStatus.OK).json({
        restaurants: resP.data,
        totalCount,
        page: pageNum - 1,
      });
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }),

  addRestaurant: asyncHandler(async (req: Request, res: Response) => {
    try {
      await check('name', 'Name cannot be blank').isLength({ min: 1 }).run(req);
      await check('address', 'Address cannot be blank')
        .isLength({ min: 1 })
        .run(req);
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: true, message: errors.array()[0].msg });

      const reqUser = req.user;

      const id = reqUser._id;
      const restaurant = new Restaurant({
        ...req.body,
        user: id,
      });
      await restaurant.save();
      res.status(200).json(restaurant);
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }),

  updateRestaurant: asyncHandler(async (req: Request, res: Response) => {
    if (!isValidObjectId(req.params.id))
      throw new ErrorStatus('Restaurant not found!');
    const restaurant: RestaurantDocument = await Restaurant.findById(
      req.params.id
    );
    if (!restaurant) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Restaurant Not Found!' });
    }

    await check('name', 'Name cannot be blank').isLength({ min: 1 }).run(req);
    await check('address', 'Address cannot be blank')
      .isLength({ min: 1 })
      .run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: true, message: errors.array()[0].msg });

    restaurant.name = req.body.name;
    restaurant.address = req.body.address;
    await restaurant.save();
    res.status(HttpStatus.OK).json(restaurant);
  }),

  deleteRestaurant: asyncHandler(async (req: Request, res: Response) => {
    try {
      if (!isValidObjectId(req.params.id))
        throw new ErrorStatus('Restaurant not Found!');
      let restaurant: RestaurantDocument = await Restaurant.findById(
        req.params.id
      );
      if (!restaurant) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Restaurant Not Found!' });
      }
      await Restaurant.findOneAndRemove({ _id: req.params.id });
      res.status(HttpStatus.OK).json();
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }),

  addReview: asyncHandler(async (req: Request, res: Response) => {
    if (!isValidObjectId(req.params.restId))
      throw new ErrorStatus('Restaurant not Found!');
    const user = req.user;
    let restaurant: RestaurantDocument = await Restaurant.findById(
      req.params.restId
    );
    if (!restaurant) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Restaurant Not Found!' });
    }

    await check('rating', 'Rating is not valid')
      .isInt({ min: 1, max: 5 })
      .run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: true, message: errors.array()[0].msg });

    const { rating, comment } = req.body;
    restaurant.reviews.push(
      new Review({
        rating,
        comment,
        ratedBy: user._id,
        visited: new Date().toLocaleDateString(),
      })
    );
    await restaurant.save();
    restaurant = await Restaurant.populate(restaurant, {
      path: 'reviews.ratedBy',
      select: 'name',
    });
    res.status(200).json(restaurant);
  }),

  replyReview: asyncHandler(async (req: Request, res: Response) => {
    if (!isValidObjectId(req.params.restId))
      throw new ErrorStatus('Restaurant not Found!');
    let restaurant: RestaurantDocument = await Restaurant.findById(
      req.params.restId
    );
    if (!restaurant) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Restaurant Not Found!' });
    }

    await check('reply', 'Reply cannot be blank').isLength({ min: 1 }).run(req);
    await check('_id', 'Review id is not valid').isMongoId().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: true, message: errors.array()[0].msg });

    const { reply, _id } = req.body;

    restaurant.reviews.forEach((review: ReviewDocument) => {
      if (review._id == _id) review.reply = reply;
    });
    await restaurant.save();
    restaurant = await Restaurant.populate(restaurant, {
      path: 'reviews.ratedBy',
      select: 'name',
    });
    res.status(200).json(restaurant);
  }),

  updateReview: asyncHandler(async (req: Request, res: Response) => {
    if (!isValidObjectId(req.params.restId))
      throw new ErrorStatus('Restaurant not Found!');
    if (!isValidObjectId(req.params.id))
      throw new ErrorStatus('Review not Found!');
    let restaurant: RestaurantDocument = await Restaurant.findById(
      req.params.restId
    );
    if (!restaurant) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Restaurant Not Found!' });
    }
    await check('rating', 'Rating is not valid')
      .isInt({ min: 1, max: 5 })
      .run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: true, message: errors.array()[0].msg });

    const { reply, comment, visited, rating } = req.body;

    restaurant.reviews.forEach((review: ReviewDocument) => {
      if (review._id == req.params.id) {
        review.reply = reply;
        review.comment = comment;
        review.visited = visited;
        review.rating = rating;
      }
    });
    await restaurant.save();
    restaurant = await Restaurant.populate(restaurant, {
      path: 'reviews.ratedBy',
      select: 'name',
    });
    res.status(200).json(restaurant);
  }),

  deleteReview: asyncHandler(async (req: Request, res: Response) => {
    if (!isValidObjectId(req.params.restId))
      throw new ErrorStatus('Restaurant not Found!');
    if (!isValidObjectId(req.params.id))
      throw new ErrorStatus('Review not Found!');
    let restaurant: RestaurantDocument = await Restaurant.findById(
      req.params.restId
    );
    if (!restaurant) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Restaurant Not Found!' });
    }
    restaurant.reviews = restaurant.reviews.filter(
      (review: ReviewDocument) => review._id != req.params.id
    );
    await restaurant.save();
    restaurant = await Restaurant.populate(restaurant, {
      path: 'reviews.ratedBy',
      select: 'name',
    });
    res.status(200).json(restaurant);
  }),
};
