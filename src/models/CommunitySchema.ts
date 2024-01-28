import mongoose, {Document, Schema} from "mongoose";
import {IUserDocument} from "./UserSchema";

interface ICommunity {
    title: string;
    tag_todo: string;
    location: string;
    description: string;
    coordinates?: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    },
    time: Date;
    max_families: string;
    image: string[];
    creator: IUserDocument;
    members?: IUserDocument[];
}

export interface IMember {
    images: [];
    last_name: string;
    _id: string;
}

const communitySchema = new Schema<ICommunityDocument>(
    {
        title: {type: String},
        tag_todo: {type: String},
        location: {type: String},
        description: {type: String},
        image: {type: [String]},
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        time: {type: Date},
        max_families: String,
        creator: {type: mongoose.Types.ObjectId, ref: "User"},
        members: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true, versionKey: false
    }
);

// Define a mongoose document interface for the user document
interface ICommunityDocument extends ICommunity, Document {
}

const CommunityModel = mongoose.model<ICommunityDocument>("Community", communitySchema);

export {ICommunity, ICommunityDocument, CommunityModel};
