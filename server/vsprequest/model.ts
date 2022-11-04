import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type VSPRequest = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  dateRequested: Date;
  content: string;
  granted: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const VSPRequestSchema = new Schema({
  // The user's username
  username: {
    type: String,
    required: true
  },
  // The date the user requested VSP status
  dateRequested: {
    type: Date,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  granted: {
    type: Boolean,
    required: true
  }
});

const VSPRequestModel = model<VSPRequest>('VSPRequest', VSPRequestSchema);
export default VSPRequestModel;
