import mongoose, {Document, Schema} from "mongoose";

export enum UserRole {
    User = "User",
    Admin = "Admin",
}

export enum UserGender {
    male = "male",
    female = "female",
}

// Define an interface for the user document
interface IUser {
    first_name?: string;
    last_name?: string;
    parents?: string;
    children?: {
        dob: Date;
        gender: UserGender;
    }[];
    location?: string;
    images?: [];
    likes?: [];
    languages?: string[];
    tags_are?: string[];
    tags_love?: string[];
    description?: string;
    coordinates?: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    }
    country_code?: string;
    email: string;
    password?: string;
    role: UserRole;
    is_verified: boolean;
    locked: boolean;
    verification_code?: string;
    forgot_password_code?: string;
}

const userSchema = new Schema<IUserDocument>(
    {
        first_name: String,
        last_name: String,
        parents: String,
        children: {
            type: [new Schema({
                dob: {type: Date, required: true},
                gender: {type: String, enum: ['male', 'female'], required: true}
            })],
            default: undefined
        },
        location: String,
        images: {type: [], default: undefined},
        languages: {type: [String], default: undefined},
        tags_are: {type: [String], default: undefined},
        tags_love: {type: [String], default: undefined},
        likes: {type: [String], default: undefined},
        description: String,
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: true
            },
        },
        country_code: String,
        email: {type: String, required: true},
        password: {type: String},
        role: {
            type: String,
            enum: UserRole,
            default: UserRole.User,
        },
        is_verified: {type: Boolean, default: false},
        locked: {type: Boolean, default: false},
        verification_code: String,
        forgot_password_code: String
    },
    {
        timestamps: true, versionKey: false
    }
);

// Define a mongoose document interface for the user document
interface IUserDocument extends IUser, Document {
}

const UserModel = mongoose.model<IUserDocument>("User", userSchema);

export {IUser, IUserDocument, UserModel};
