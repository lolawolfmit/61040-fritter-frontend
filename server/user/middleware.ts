import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';

/**
 * Checks if the current session user (if any) still exists in the database, for instance,
 * a user may try to post a freet in some browser while the account has been deleted in another or
 * when a user tries to modify an account in some browser while it has been deleted in another
 */
const isCurrentSessionUserExists = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    const user = await UserCollection.findOneByUserId(req.session.userId);

    if (!user) {
      req.session.userId = undefined;
      res.status(500).json({
        error: 'User session was not recognized.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if a username in req.body is valid, that is, it matches the username regex
 */
const isValidUsername = (req: Request, res: Response, next: NextFunction) => {
  const usernameRegex = /^\w+$/i;
  if (!usernameRegex.test(req.body.username)) {
    res.status(400).json({
      error: 'Username must be a nonempty alphanumeric string.'
    });
    return;
  }

  next();
};

/**
 * Checks if a password in req.body is valid, that is, at 6-50 characters long without any spaces
 */
const isValidPassword = (req: Request, res: Response, next: NextFunction) => {
  const passwordRegex = /^\S+$/;
  if (!passwordRegex.test(req.body.password)) {
    res.status(400).json({
      error: 'Password must be a nonempty string.'
    });
    return;
  }

  next();
};

/**
 * Checks if a user with username and password in req.body exists
 */
const isAccountExists = async (req: Request, res: Response, next: NextFunction) => {
  const {username, password} = req.body as {username: string; password: string};

  if (!username || !password) {
    res.status(400).json({error: `Missing ${username ? 'password' : 'username'} credentials for sign in.`});
    return;
  }

  const user = await UserCollection.findOneByUsernameAndPassword(
    username, password
  );

  if (user) {
    next();
  } else {
    res.status(401).json({error: 'Invalid user login credentials provided.'});
  }
};

/**
 * Checks if a username in req.body is already in use
 */
const isUsernameNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUsername(req.body.username);

  // If the current session user wants to change their username to one which matches
  // the current one irrespective of the case, we should allow them to do so
  if (!user || (user?._id.toString() === req.session.userId)) {
    next();
    return;
  }

  res.status(409).json({
    error: {
      username: 'An account with this username already exists.'
    }
  });
};

/**
 * Checks if a user is already following another user (cannot re-follow)
 */
const isUserAlreadyFollowingTargetUser = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    if (user.following.includes(req.body.following)) {
      res.status(409).json({
        error: 'You are already following this user.'
      });
      return;
    }
  }
  
  next();
};

/**
 * Checks if a user has not yet followed a certain user (cannot unfollow if never followed)
 */
 const isUserNotYetFollowingTargetUser = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    if (!user.following.includes(req.body.following)) {
      res.status(409).json({
        error: 'You cannot unfollow a user you have never followed.'
      });
      return;
    }
  }
  
  next();
};

/**
 * Checks if user is trying to follow themselves.
 */
 const isUserTryingToFollowSelf = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    if (user.username === req.body.following) {
      res.status(403).json({
        error: 'You cannot follow yourself.'
      });
      return;
    }
  }
  
  next();
};

/**
 * Checks if the user has already added a certain interest (cannot be added again)
 */
 const isUserAlreadyAddedInterest = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    if (user.interests.includes(req.body.interests)) {
      res.status(409).json({
        error: 'You have already added this interest.'
      });
      return;
    }
  }
  
  next();
};

/**
 * Checks if the user has not yet added a certain interest (cannot be deleted)
 */
 const isUserNotYetAddedInterest = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    if (!user.interests.includes(req.body.interests)) {
      res.status(409).json({
        error: 'You are trying to delete an interest you have not yet added.'
      });
      return;
    }
  }
  
  next();
};

/**
 * Checks if the user has any interests
 */
 const isUserHasInterests = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    if (user.interests.length) {
      next();
    } else {
      res.status(404).json({error: 'You do not currently have any interests added.'});
    }
  }; 
 }

/**
 * Checks if the user is logged in, that is, whether the userId is set in session
 */
const isUserLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    res.status(403).json({
      error: 'You must be logged in to complete this action.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user is signed out, that is, userId is undefined in session
 */
const isUserLoggedOut = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    res.status(403).json({
      error: 'You are already signed in.'
    });
    return;
  }

  next();
};

/**
 * Checks if a user with userId as author id in req.query exists
 */
const isAuthorExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.author) {
    res.status(400).json({
      error: 'Provided author username must be nonempty.'
    });
    return;
  }

  const user = await UserCollection.findOneByUsername(req.query.author as string);
  if (!user) {
    res.status(404).json({
      error: `A user with username ${req.query.author as string} does not exist.`
    });
    return;
  }

  next();
};


export {
  isCurrentSessionUserExists,
  isUserLoggedIn,
  isUserLoggedOut,
  isUsernameNotAlreadyInUse,
  isAccountExists,
  isAuthorExists,
  isValidUsername,
  isValidPassword,
  isUserNotYetFollowingTargetUser,
  isUserAlreadyFollowingTargetUser,
  isUserAlreadyAddedInterest,
  isUserNotYetAddedInterest,
  isUserHasInterests,
  isUserTryingToFollowSelf
};
