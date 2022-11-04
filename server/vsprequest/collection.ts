import type {HydratedDocument, Types} from 'mongoose';
import type {VSPRequest} from './model';
import type {User} from '../user/model';
import VSPRequestModel from './model';
import UserModel from '../user/model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class VSPRequestCollection {
  /**
   * Add a new request
   *
   * @param {string} username - The username of the user
   * @param {string} content - The justification for becoming a VSP
   * @return {Promise<HydratedDocument<VSPRequest>>} - The newly created VSP request
   */
  static async addOne(username: string, content: string): Promise<HydratedDocument<VSPRequest>> {
    const dateRequested = new Date();
    let granted = false;

    const vsprequest = new VSPRequestModel({username, dateRequested, content, granted});
    await vsprequest.save(); // Saves request to MongoDB
    return vsprequest;
  }

  /**
   * Find a request by username (case insensitive).
   *
   * @param {string} username - The username associated with the request to find
   * @return {Promise<HydratedDocument<VSPRequest>> | Promise<null>} - The user with the given username, if any
   */
     static async findOneByUsername(username: string): Promise<HydratedDocument<VSPRequest>> {
      return VSPRequestModel.findOne({username: new RegExp(`^${username?.trim()}$`, 'i')});
    }

  /**
   * Accept a request
   * 
   * @param {string} username - The username of the user
   * @return {Promise<HydratedDocument<VSPRequest>>} - The updated VSP request
   */
   static async acceptOne(username: string): Promise<HydratedDocument<VSPRequest>> {
    const vsprequest = await VSPRequestModel.findOne({username: username});
    vsprequest.granted = true;
    await vsprequest.save(); // Saves request to MongoDB
    return vsprequest;
  }

  /**
   * Ungrant a request
   * 
   * @param {string} username - The username of the user
   * @return {Promise<HydratedDocument<VSPRequest>>} - The updated VSP request
   */
     static async ungrantOne(username: string): Promise<HydratedDocument<VSPRequest>> {
      const vsprequest = await VSPRequestModel.findOne({username: username});
      vsprequest.granted = false;
      await vsprequest.save(); // Saves request to MongoDB
      return vsprequest;
    }

  /**
   * Retrieve all requests that have not been approved.
   * 
   * @return {Promise<HydratedDocument<VSPRequest>>[]} // fix this?
   */
  static async getAll(): Promise<Array<HydratedDocument<VSPRequest>>> {
      const vsprequests = await VSPRequestModel.find({granted: false});
      return vsprequests;
    }


  /**
   * Delete a request from the collection.
   *
   * @param {string} username - The username of the user associated with the request to delete
   * @return {Promise<Boolean>} - true if the request has been deleted, false otherwise
   */
  static async deleteOne(username: string): Promise<boolean> {
    const vsprequest = await VSPRequestModel.deleteOne({username: username});
    return vsprequest !== null;
  }

  /**
   * Retrieve all requests that have not been approved.
   * 
   * @return {Promise<HydratedDocument<User>>[]} // fix this?
   */
     static async getAllVSPs(): Promise<Array<HydratedDocument<User>>> {
      const VSPs = await UserModel.find({VSP: true});
      return VSPs;
    }
}


export default VSPRequestCollection;
