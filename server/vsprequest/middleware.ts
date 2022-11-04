import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import VSPRequestCollection from '../vsprequest/collection';
import UserCollection from '../user/collection';

/**
 * Checks if a user is already a VSP
 */
 const isUserAlreadyVSP = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId) {
        const user = await UserCollection.findOneByUserId(req.session.userId);
        if (!user.VSP) {
            next();
          } else {
            res.status(409).json({error: 'User is already a VSP.'});
          }
    }
  };

/**
 * Checks if a user has already submitted a VSP request
 */
 const isUserAlreadySubmittedRequest = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId) {
        const user = await UserCollection.findOneByUserId(req.session.userId);
        const vsprequest = await VSPRequestCollection.findOneByUsername(user.username);
        if (!vsprequest) {
            next();
          } else {
            res.status(409).json({error: 'User has already submitted a request.'});
          }
    }
  };

/**
 * Checks if a user has admin status
 */
 const isUserAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId) {
        const user = await UserCollection.findOneByUserId(req.session.userId);
        if (user.username === 'lola') {
            next();
          } else {
            res.status(401).json({error: 'You do not have permission to do this.'});
          }
    }
  };

/**
 * Checks if a user has admin status
 */
 const isRequestExists = async (req: Request, res: Response, next: NextFunction) => {
    const request = await VSPRequestCollection.findOneByUsername(req.body.username);
    if (request) {
        next();
        } else {
        res.status(404).json({error: 'Request not found.'});
        }
  };

/**
 * Checks if a request was already accepted
 */
 const isRequestAlreadyAccepted = async (req: Request, res: Response, next: NextFunction) => {
    const request = await VSPRequestCollection.findOneByUsername(req.body.username);
    if (!request.granted) {
        next();
        } else {
        res.status(409).json({error: 'Request already granted.'});
        }
  };

/**
 * Checks if a request has not yet been granted
 */
 const isRequestNotYetGranted = async (req: Request, res: Response, next: NextFunction) => {
    const request = await VSPRequestCollection.findOneByUsername(req.body.username);
    if (request.granted) {
        next();
        } else {
        res.status(409).json({error: 'Request has not yet been granted.'});
        }
  };

export {
    isUserAlreadyVSP,
    isUserAlreadySubmittedRequest,
    isUserAdmin,
    isRequestExists,
    isRequestAlreadyAccepted,
    isRequestNotYetGranted
};
