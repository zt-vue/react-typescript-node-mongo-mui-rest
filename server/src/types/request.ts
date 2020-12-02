import { Request as IRequest } from 'express';
import { Payload } from './payload';

export type Request = IRequest & Payload;
