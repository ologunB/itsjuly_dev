// community.controller.ts

import {Response} from "express";
import {successResponse} from "../utils/response.handler";
import {Request} from "../models/express";
import {catchAsync} from "../utils/helpers";
import CommunityService from "../services/community.service";

class CommunityController {
    getCommunities = catchAsync(async (req: Request, res: Response) => {
        const communities = await CommunityService.getCommunities(req);
        return successResponse({message: "Communities fetched successfully", data: communities, res});
    });

    addCommunity = catchAsync(async (req: Request, res: Response) => {
        const community = await CommunityService.createCommunity({
            ...req.body,
            user: req.user,
        });

        return successResponse({message: "Community created successfully", data: community, res});
    });

    updateCommunity = catchAsync(async (req: Request, res: Response) => {
        const {communityId} = req.params;
        const data = req.body;
        const community = await CommunityService.updateCommunity(
            communityId as string,
            data
        );
        return successResponse({message: "Community updated successfully", data: community, res});
    });
    deleteCommunity = catchAsync(async (req: Request, res: Response) => {
        const {communityId} = req.params;

        const community = await CommunityService.deleteCommunity(
            communityId as string
        );
        return successResponse({message: "Community deleted successfully", data: community, res});
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
