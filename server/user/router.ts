import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
* Get the signed in user
* TODO: may need better route and documentation
* (so students don't accidentally delete this when copying over)
*
* @name GET /api/users/session
*
* @return - currently logged in user, or null if not logged in
*/
router.get(
  '/session',
  [],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    res.status(200).json({
      message: 'Your session info was found successfully.',
      user: user ? util.constructUserResponse(user) : null
    });
  }
);

/**
 * Sign in user.
 *
 * @name POST /api/users/session
 *
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @return {UserResponse} - An object with user's details
 * @throws {403} - If user is already signed in
 * @throws {400} - If username or password is  not in the correct format,
 *                 or missing in the req
 * @throws {401} - If the user login credentials are invalid
 *
 */
router.post(
  '/session',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isValidPassword,
    userValidator.isAccountExists
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsernameAndPassword(
      req.body.username, req.body.password
    );
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: 'You have logged in successfully',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Sign out a user
 *
 * @name DELETE /api/users/session
 *
 * @return - None
 * @throws {403} - If user is not logged in
 *
 */
router.delete(
  '/session',
  [
    userValidator.isUserLoggedIn
  ],
  (req: Request, res: Response) => {
    req.session.userId = undefined;
    res.status(200).json({
      message: 'You have been logged out successfully.'
    });
  }
);

/**
 * Create a user account.
 *
 * @name POST /api/users
 *
 * @param {string} username - username of user
 * @param {string} password - user's password
 * @return {UserResponse} - The created user
 * @throws {403} - If there is a user already logged in
 * @throws {409} - If username is already taken
 * @throws {400} - If password or username is not in correct format
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.addOne(req.body.username, req.body.password);
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: `Your account was created successfully. You have been logged in as ${user.username}`,
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Update a user's profile.
 *
 * @name PUT /api/users
 *
 * @param {string} username - The user's new username
 * @param {string} password - The user's new password
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If username already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.updateOne(userId, req.body);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Follow a user.
 * 
 * @name PATCH /api/users/followers
 * 
 * @param following - The username of the user to follow
 * 
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in or trying to follow themselves
 * @throws {409} - If user is already following the user they are requesting to follow
 */
 router.patch(
  '/followers',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserAlreadyFollowingTargetUser,
    userValidator.isUserTryingToFollowSelf
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.updateOne(userId, req.body); // req.body should contain {following: username of user this user wants to follow}
    res.status(200).json({
      message: 'Successfully followed.',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Unfollow a user.
 * 
 * @name DELETE /api/users/followers
 * 
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If user is not yet following the user they are requesting to unfollow
 */
 router.delete(
  '/followers',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserNotYetFollowingTargetUser
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    req.body.unfollow = true;
    const user = await UserCollection.updateOne(userId, req.body); // req.body should contain {following: username of user this user wants to unfollow}
    res.status(200).json({
      message: 'Successfully unfollowed.',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Add an interest.
 * 
 * @name PATCH /api/users/interests
 * 
 * @param interests - The interest to add to the user's profile
 * 
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If user already has that interest
 */
router.patch(
  '/interests',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserAlreadyAddedInterest
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.updateOne(userId, req.body); // req.body should contain {following: username of user this user wants to unfollow}
    res.status(200).json({
      message: 'Successfully added interest.',
      user: util.constructUserResponse(user)
    });
  }
)

/**
 * Delete an interest.
 * 
 * @name DELETE /api/users/interests
 * 
 * @param interests - The interest to delete from the user's profile
 * 
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If user does not already have that interest
 */
 router.delete(
  '/interests',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserNotYetAddedInterest
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    req.body.deleteInterest = true;
    const user = await UserCollection.updateOne(userId, req.body); // req.body should contain {following: username of user this user wants to unfollow}
    res.status(200).json({
      message: 'Successfully deleted interest.',
      user: util.constructUserResponse(user)
    });
  }
)

/**
 * Delete a user.
 *
 * @name DELETE /api/users
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await UserCollection.deleteOne(userId);
    await FreetCollection.deleteMany(userId);
    req.session.userId = undefined;
    res.status(200).json({
      message: 'Your account has been deleted successfully.'
    });
  }
);

/**
 * Retrieve recommended users to follow based on a user's interests.
 * 
 * @name GET /api/users/recommended
 * 
 * @return {UserResponse[]} - An array of recommended users
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user does not have any interests
 */
 router.get(
  '/recommended',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserHasInterests
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const allUsers = await UserCollection.findRecommended(userId);
    res.status(200).json({
      message: 'Accounts have been retrieved successfully.',
      users: allUsers
    });
  }
);

export {router as userRouter};
