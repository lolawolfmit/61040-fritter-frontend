import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';

/**
 * Checks if a freet with freetId in req.body exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.body.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: `Freet with freet ID ${req.body.freetId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId in req.params exists
 */
 const isFreetIdExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.params.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: `Freet with freet ID ${req.params.freetId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Freet content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Freet content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freets.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user has already endorsed the freet
 */
 const isUserAlreadyEndorsed = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.body.freetId);
  const user = await UserCollection.findOneByUserId(req.session.userId);
  if (freet.endorsements.includes(user.username)) {
    res.status(409).json({
      error: 'You have already endorsed this freet.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user has already denounced the freet
 */
 const isUserAlreadyDenounced = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.body.freetId);
  const user = await UserCollection.findOneByUserId(req.session.userId);
  if (freet.denouncements.includes(user.username)) {
    res.status(409).json({
      error: 'You have already denounced this freet.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user has not yet endorsed the freet
 */
 const isUserNotYetEndorsed = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.body.freetId);
  const user = await UserCollection.findOneByUserId(req.session.userId);
  if (!freet.endorsements.includes(user.username)) {
    res.status(409).json({
      error: 'You have not yet endorsed this freet.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user has not yet denounced the freet
 */
 const isUserNotYetDenounced = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.body.freetId);
  const user = await UserCollection.findOneByUserId(req.session.userId);
  if (!freet.denouncements.includes(user.username)) {
    res.status(409).json({
      error: 'You have not yet denounced this freet.'
    });
    return;
  }

  next();
};

/**
 * Checks if the freet is a fact
 */
 const isFreetAFact = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.body.freetId);
  if (!freet.fact) {
    res.status(403).json({
      error: 'You cannot endorse or denounce a freet that is an opinion.'
    });
    return;
  }

  next();
};

/**
 * Checks if the boolean is valid
 */
 const isValidBoolean = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.fact !== "true" && req.body.fact !== "false") {
    res.status(409).json({
      error: 'Freet is not a fact or opinion.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user is a VSP
 */
 const isUserVSP = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.session.userId);
  if (!user.VSP) {
    res.status(403).json({
      error: 'You cannot endorse or denounce a freet if you are not a VSP.'
    });
    return;
  }

  next();
};

export {
  isValidFreetContent,
  isFreetExists,
  isValidFreetModifier,
  isUserAlreadyDenounced,
  isUserAlreadyEndorsed,
  isUserNotYetDenounced,
  isUserNotYetEndorsed,
  isFreetAFact,
  isUserVSP,
  isFreetIdExists,
  isValidBoolean
};
