import express from "express";

import {isAuthenticated} from "../middlewares/auth.middleware";

import CommunityValidation from "../validation/community.validation";
import CommunityController from "../controllers/community.controller";
import {uploadImage} from "../middlewares/fileUpload";

const communityRouter = express.Router();

communityRouter.get(
    "/all",
    isAuthenticated,
    CommunityValidation.emptyValidation,
    CommunityController.getCommunities
);

communityRouter.post(
    "/create",
    isAuthenticated,
    uploadImage,
    CommunityValidation.createCommunityValidation,
    CommunityController.addCommunity
);
communityRouter.put(
    "/:communityId",
    isAuthenticated,
    CommunityValidation.checkIDValidation,
    CommunityValidation.updateCommunityValidation,
    CommunityController.updateCommunity
);

communityRouter.delete(
    "/:communityId",
    isAuthenticated,
    CommunityValidation.checkIDValidation,
    CommunityValidation.emptyValidation,
    CommunityController.deleteCommunity
);

communityRouter.post(
    "/join/:communityId",
    isAuthenticated,
    CommunityValidation.checkIDValidation,
    CommunityValidation.emptyValidation,
    CommunityController.joinCommunity
);

communityRouter.delete(
    "/leave/:communityId",
    isAuthenticated,
    CommunityValidation.checkIDValidation,
    CommunityValidation.emptyValidation,
    CommunityController.leaveCommunity
);

export default communityRouter;
