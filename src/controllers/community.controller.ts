// community.controller.ts

import {Response} from "express";
import {successResponse} from "../utils/response.handler";
import {Request} from "../models/express";
import {catchAsync, parseLocation, uploadImage} from "../utils/helpers";
import CommunityService from "../services/community.service";

class CommunityController {
    getCommunities = catchAsync(async (req: Request, res: Response) => {
        const communities = await CommunityService.getCommunities(req);
        return successResponse({message: "Communities fetched successfully", data: communities, res});
    });

    addCommunity = catchAsync(async (req: Request, res: Response) => {
        const file = req.file as Express.Multer.File;

        if (!file || file.fieldname !== 'image') {
            throw new Error("Please add file and the right format for upload");
        }
        const result = await uploadImage(file);
        req.body.image = [result.secure_url];
        let creator = req.user!;
        creator.password = undefined;
        creator.forgot_password_code = undefined;
        req.body.creator = creator;
        req.body.coordinates = {
            type: 'Point', coordinates: parseLocation(req.body.coordinates)
        }

        const community = await CommunityService.createCommunity(req.body);

        return successResponse({message: "Community created successfully", data: community, res});
    });

    updateCommunity = catchAsync(async (req: Request, res: Response) => {
        const community = await CommunityService.updateCommunity(req);
        return successResponse({message: "Community updated successfully", data: community, res});
    });
    deleteCommunity = catchAsync(async (req: Request, res: Response) => {
        await CommunityService.deleteCommunity(req);
        return successResponse({message: "Community deleted successfully", res});
    });

    joinCommunity = catchAsync(async (req: Request, res: Response) => {
        const {communityId} = req.params;
        await CommunityService.joinCommunity(req);
        return successResponse({message: "Community joined successfully", data: communityId, res});
    });


    leaveCommunity = catchAsync(async (req: Request, res: Response) => {
        const {communityId} = req.params;
        await CommunityService.leaveCommunity(req);
        return successResponse({message: "Community left successfully", data: communityId, res});
    });

}

export default new CommunityController();
