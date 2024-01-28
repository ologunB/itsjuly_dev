import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import {BadRequestError} from "../utils/error";

type ValidationSource = "body" | "query" | "params";

const validate = (
    schema: Joi.ObjectSchema<unknown>,
    source: ValidationSource = "body"
) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const input = {...req[source]};

        const {error} = schema.validate(input);
        if (error) {
            next(new BadRequestError(error.details[0].message));
        }
        next();
    };
};

export default validate;
