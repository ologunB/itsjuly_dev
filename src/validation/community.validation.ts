import Joi from "joi";
import validate from "./validate";

const createCommunitySchema = Joi.object({
    title: Joi.string().required().messages({
        "any.required": "Title is required",
        "string.empty": "Title cannot be empty",
    }),
    tag_todo: Joi.string().required().messages({
        "any.required": "Todo is required",
        "string.empty": "Todo cannot be empty",
    }),
    location: Joi.string().required().messages({
        "any.required": "Location is required",
        "string.empty": "Location cannot be empty",
    }),
    description: Joi.string().required().messages({
        "any.required": "Description is required",
        "string.empty": "Description cannot be empty",
    }),
    time: Joi.date().required().messages({
        "any.required": "Time is required",
        "string.pattern.base": "Time is not a valid Date Object",
    }),
    max_families: Joi.number().required().messages({
        "any.required": "Max families is required",
        "string.empty": "Max families cannot be empty",
    }),
});

const updateCommunitySchema = Joi.object({
    tag_todo: Joi.string().required().messages({
        "any.required": "Todo is required",
        "string.empty": "Todo cannot be empty",
    }),
    location: Joi.string().required().messages({
        "any.required": "Location is required",
        "string.empty": "Location cannot be empty",
    }),
    description: Joi.string().required().messages({
        "any.required": "Description is required",
        "string.empty": "Description cannot be empty",
    }),
    time: Joi.date().required().messages({
        "any.required": "Time is required",
        "string.pattern.base": "Time is not a valid Date Object",
    }),
    max_families: Joi.number().required().messages({
        "any.required": "Max families is required",
        "string.empty": "Max families cannot be empty",
    }),
});


const checkIDSchema = Joi.object({
    communityId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            "any.required": "Community ID is required",
            "string.pattern.base": "Community ID is not a valid ObjectID",
        }),
});

const emptySchema = Joi.object({});

export default {
    createCommunityValidation: validate(createCommunitySchema),
    updateCommunityValidation: validate(updateCommunitySchema),
    emptyValidation: validate(emptySchema),
    checkIDValidation: validate(checkIDSchema, "params"),
};
