import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
// import typeimport { User } from './model';
import type { User } from './model';
//  {User} from './model';

// Update this if you add a property to the User type!
type UserResponse = {
  _id: string;
  username: string;
  dateJoined: string;
  VSP: boolean;
  interests: [String];
  followers: [String];
  following: [String];
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<User>} user - A user object
 * @returns {UserResponse} - The user object without the password
 */
const constructUserResponse = (user: HydratedDocument<User>): UserResponse => {
  const userCopy: User = {
    ...user.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  delete userCopy.password;
  return {
    ...userCopy,
    _id: userCopy._id.toString(),
    dateJoined: formatDate(user.dateJoined)
  };
};

export {
  constructUserResponse
};
