import {Request as ExpressRequest} from "express";
import {IUserDocument} from "./UserSchema";

export interface Request extends ExpressRequest {
    userId?: string; // Or whichever type you're expecting for userId
    user?: IUserDocument;
}
