import type {HydratedDocument, Types} from 'mongoose';
import type {User} from './model';
import UserModel from './model';
import FreetModel, { Freet } from '../freet/model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class UserCollection {
  /**
   * Add a new user
   *
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async addOne(username: string, password: string): Promise<HydratedDocument<User>> {
    const dateJoined = new Date();
    let VSP = false;
    let interests = new Array;
    let followers = new Array;
    let following = new Array;

    const user = new UserModel({username, password, dateJoined, VSP, interests, followers, following});
    await user.save(); // Saves user to MongoDB
    return user;
  }

  /**
   * Find a user by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({_id: userId});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({username: new RegExp(`^${username?.trim()}$`, 'i')});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsernameAndPassword(username: string, password: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({
      username: new RegExp(`^${username.trim()}$`, 'i'),
      password
    });
  }

  /**
   * Retrieve recommended users to follow based on a user's interests.
   * 
   * @param {string} userId - The userId of user to generate recommendations for
   * @return {Promise<HydratedDocument<User>[]>} - The recommended accounts to follow
   */
  static async findRecommended(userId: Types.ObjectId | string): Promise<HydratedDocument<User>[]> {
      const user = await UserModel.findOne({_id: userId});
      const userInterests = user.interests;
      const userFollowing = user.following;
      const allFreets = await FreetModel.find({}).sort({dateModified: -1});
      let freetsToCheck: Freet[] = [];
      // get all freets from users the user isn't following
      for (let eachFreet of allFreets) {
        let freetAuthor = await this.findOneByUserId(eachFreet.authorId);
        if (!userFollowing.includes(freetAuthor.username)) {
          freetsToCheck.push(eachFreet);
        }
      }
      let interestingFreets: Freet[] = [];
      // check each freet for interest
      for (let eachFreet of freetsToCheck) {
        for (let eachInterest of userInterests) {
          if (eachFreet.content.includes(eachInterest as string)) {
            interestingFreets.push(eachFreet);
            break;
          }
        }
      }
      let authorsToFollow: HydratedDocument<User>[] = [];
      let authorNames: String[] = [];
      for (let eachFreet of interestingFreets) {
        let freetAuthor = await this.findOneByUserId(eachFreet.authorId);
        if (!authorNames.includes(freetAuthor.username)) {
          authorsToFollow.push(freetAuthor);
          authorNames.push(freetAuthor.username);
        }
      }
      return authorsToFollow;
    }

  /**
   * Update user's information
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated information
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async updateOne(userId: Types.ObjectId | string, userDetails: any): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    // update VSP (DO NOT REARRANGE ORDER OF IF STATEMENTS)
    if (userDetails.VSP) {
      if (userDetails.revoke) {
        user.VSP = false;
      }
      else {
        user.VSP = true;
      }
    }
    else {
      // update password
      if (userDetails.password) {
        user.password = userDetails.password as string;
      }
      // update username
      if (userDetails.username) {
        user.username = userDetails.username as string;
      }
      // add interest
      if (userDetails.interests && !userDetails.deleteInterest) {
        user.interests.push(userDetails.interests as string)
      }
      // delete interest
      if (userDetails.interests && userDetails.deleteInterest) {
        const index = user.interests.indexOf(userDetails.interests, 0); // adapted from: https://stackoverflow.com/questions/15292278/how-do-i-remove-an-array-item-in-typescript
        if (index > -1) {
          user.interests.splice(index, 1);
        }
      }
      // update following, will automatically update followers of new user
      if (userDetails.following && !userDetails.unfollow) { // should just be one new following username
        const followedUser = await UserModel.findOne({username: userDetails.following as string});
        user.following.push(userDetails.following as string);
        followedUser.followers.push(user.username);
        await followedUser.save();
      }
      // unfollow a user
      if (userDetails.following && userDetails.unfollow) { // should just be one new following username
        const followedUser = await UserModel.findOne({username: userDetails.following as string});
        const index = followedUser.followers.indexOf(user.username, 0); // adapted from: https://stackoverflow.com/questions/15292278/how-do-i-remove-an-array-item-in-typescript
        if (index > -1) {
          followedUser.followers.splice(index, 1);
        }
        const index2 = user.following.indexOf(userDetails.following as string, 0); // adapted from: https://stackoverflow.com/questions/15292278/how-do-i-remove-an-array-item-in-typescript
        if (index2 > -1) {
          user.following.splice(index2, 1);
        }
        await followedUser.save();
      }
    }
    await user.save();
    return user;
  }

  /**
   * Delete a user from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await UserModel.deleteOne({_id: userId});
    return user !== null;
  }
}


export default UserCollection;
