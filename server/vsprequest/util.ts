import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type { VSPRequest } from './model';

type VSPRequestResponse = {
  _id: string;
  username: string;
  dateRequested: string;
  content: string;
  granted: boolean;
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
 * @param {HydratedDocument<VSPRequest>} vsprequest- A request object
 * @returns {VSPRequestResponse} - The user object without the password
 */
const constructVSPRequestResponse = (vsprequest: HydratedDocument<VSPRequest>): VSPRequestResponse => {
  const VSPRequestCopy: VSPRequest= {
    ...vsprequest.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...VSPRequestCopy,
    _id: VSPRequestCopy._id.toString(),
    dateRequested: formatDate(VSPRequestCopy.dateRequested)
  };
};

export {
  constructVSPRequestResponse
};
