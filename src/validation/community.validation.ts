import Joi from "joi";
import validate from "./validate";

const createCommunitySchema = Joi.object({
    title: Joi.string().required().messages({
        "any.required": "Title is required",
        "string.empty": "Title cannot be empty",
    }),
    description: Joi.string().required().messages({
        "any.required": "Description is required",
        "string.empty": "Description cannot be empty",
    }),
    tag_todo: Joi.string().required().messages({
        "any.required": "Todo is required",
        "string.empty": "Todo cannot be empty",
    }),
    time: Joi.date().required().messages({
        "any.required": "Time is required",
        "string.pattern.base": "Time is not a valid Date Object",
    }),

    location: Joi.string().required().messages({
        "any.required": "Location is required",
        "string.empty": "Location cannot be empty",
    }),
    coordinates: Joi.string()
        .pattern(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/).required().messages({
            "any.required": "Coordinates is required",
            "string.empty": "Coordinates is needed",
        }),
    max_families: Joi.string().required().messages({
        "any.required": "Max families is required",
        "string.empty": "Max families cannot be empty",
    }),
});

const updateCommunitySchema = Joi.object({
    title: Joi.string().messages({
        "any.required": "Title is required",
        "string.empty": "Title cannot be empty",
    }),
    description: Joi.string().messages({
        "any.required": "Description is required",
        "string.empty": "Description cannot be empty",
    }),
    tag_todo: Joi.string().messages({
        "any.required": "Todo is required",
        "string.empty": "Todo cannot be empty",
    }),
    location: Joi.string().messages({
        "any.required": "Location is required",
        "string.empty": "Location cannot be empty",
    }),
    coordinates: Joi.string()
        .pattern(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/).messages({
            "any.required": "Coordinates is required",
            "string.empty": "Coordinates is needed",
        }),
    time: Joi.date().messages({
        "any.required": "Time is required",
        "string.pattern.base": "Time is not a valid Date Object",
    }),
    max_families: Joi.number().messages({
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
