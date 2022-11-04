import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FreetCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @param {boolean} fact - True if fact, false if opinion
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, content: string, fact: boolean): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const endorsements = new Array;
    const denouncements = new Array;
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      endorsements,
      denouncements,
      fact
    });
    await freet.save(); // Saves freet to MongoDB
    return freet.populate('authorId');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({_id: freetId}).populate('authorId');
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetModel.find({authorId: author._id}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    freet.content = content;
    freet.dateModified = new Date();
    await freet.save();
    return freet.populate('authorId');
  }

  /**
   * Update a freet with an endorsement
   * 
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} userId - The id of the user endorsing the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async addOneEndorsement(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    const user = await UserCollection.findOneByUserId(userId as string);
    const freet = await FreetModel.findOne({_id: freetId});
    freet.endorsements.push(user.username);
    await freet.save();
    return freet;
  }

  /**
   * Delete an endorsement from a freet
   * 
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} userId - The id of the user unendorsing the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
     static async deleteOneEndorsement(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
      const user = await UserCollection.findOneByUserId(userId as string);
      const freet = await FreetModel.findOne({_id: freetId});
      const index = freet.endorsements.indexOf(user.username, 0); // adapted from: https://stackoverflow.com/questions/15292278/how-do-i-remove-an-array-item-in-typescript
        if (index > -1) {
          freet.endorsements.splice(index, 1);
        }
      await freet.save();
      return freet;
    }

  /**
   * Update a freet with a denouncement
   * 
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} userId - The id of the user endorsing the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
   static async addOneDenouncement(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    const user = await UserCollection.findOneByUserId(userId as string);
    const freet = await FreetModel.findOne({_id: freetId});
    freet.denouncements.push(user.username);
    await freet.save();
    return freet;
  }

  /**
   * Delete an denouncement from a freet
   * 
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} userId - The id of the user unendorsing the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
     static async deleteOneDenouncement(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
      const user = await UserCollection.findOneByUserId(userId as string);
      const freet = await FreetModel.findOne({_id: freetId});
      const index = freet.denouncements.indexOf(user.username, 0); // adapted from: https://stackoverflow.com/questions/15292278/how-do-i-remove-an-array-item-in-typescript
        if (index > -1) {
          freet.denouncements.splice(index, 1);
        }
      await freet.save();
      return freet;
    }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetModel.deleteOne({_id: freetId});
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({authorId});
  }
}

export default FreetCollection;
