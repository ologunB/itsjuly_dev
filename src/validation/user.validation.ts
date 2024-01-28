import Joi from "joi";
import validate from "./validate";

const registrationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

const verifyOTPSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(4).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const sendForgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

const verifyForgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(4).required(),
});

const resetForgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(4).required(),
    password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
    password: Joi.string().required(),
    old_password: Joi.string().required(),
});

const emptySchema = Joi.object({});

const updateAccountSchema = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    parents: Joi.string(),
    children: Joi.array().items(Joi.object({
        dob: Joi.date().required(),
        gender: Joi.string().valid('male', 'female').required()
    })),
    location: Joi.string(),
    languages: Joi.array().items(Joi.string()),
    tags_are: Joi.array().items(Joi.string()),
    tags_love: Joi.array().items(Joi.string()),
    description: Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    country_code: Joi.string(),
});

const deleteAccountSchema = Joi.object({
    password: Joi.string().required()
});

const likeUserSchema = Joi.object({
    id: Joi.string().required(),
    like: Joi.boolean().required()
});

export default {
    registrationValidation: validate(registrationSchema),
    verifyOTPValidation: validate(verifyOTPSchema),
    loginValidation: validate(loginSchema),
    sendForgotPasswordValidation: validate(sendForgotPasswordSchema),
    verifyForgotPasswordValidation: validate(verifyForgotPasswordSchema),
    resetForgotPasswordValidation: validate(resetForgotPasswordSchema),
    emptyValidation: validate(emptySchema),
    changePasswordValidation: validate(changePasswordSchema),
    updateAccountValidation: validate(updateAccountSchema),
    deleteAccountValidation: validate(deleteAccountSchema),
    likeUserValidation: validate(likeUserSchema),
};
