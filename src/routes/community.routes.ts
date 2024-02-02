import express from "express";

import {isAuthenticated} from "../middlewares/auth.middleware";

import CommunityValidation from "../validation/community.validation";
import CommunityController from "../controllers/community.controller";
import {uploadImage} from "../middlewares/fileUpload";

const communityRouter = express.Router();

/**
 * @openapi
 * '/community/all':
 *   get:
 *     tags:
 *       - Community
 *     summary: Get communities
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: languages
 *         schema:
 *           type: string
 *         required: false
 *         description: The languages
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         required: false
 *         description: The location (around-me or [lng,lat])
 *       - in: query
 *         name: todos
 *         schema:
 *           type: string
 *         required: false
 *         description: The todos
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */
communityRouter.get(
    "/all",
    isAuthenticated,
    CommunityValidation.emptyValidation,
    CommunityController.getCommunities
);
/**
 * @openapi
 * '/community/create':
 *  post:
 *     tags:
 *       - Community
 *     summary: Create a community
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *           schema:
 *            type: object
 *            required:
 *              - title
 *              - description
 *              - tag_todo
 *              - time
 *              - location
 *              - coordinates
 *              - max_families
 *              - image
 *            properties:
 *              image:
 *                type: string
 *                format: binary
 *                description: File to upload
 *              title:
 *                type: string
 *                default: title
 *              description:
 *                type: string
 *                default: description
 *              tag_todo:
 *                type: string
 *                default: tag_todo
 *              time:
 *                type: string
 *                default: 2022-11-22
 *              location:
 *                type: string
 *                default: location
 *              coordinates:
 *                type: string[]
 *                default: [lng,lat]
 *              max_families:
 *                type: string
 *                default: 3
 *     responses:
 *      200:
 *        description: OK
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
communityRouter.post(
    "/create",
    isAuthenticated,
    uploadImage,
    CommunityValidation.createCommunityValidation,
    CommunityController.addCommunity
);

/**
 * @openapi
 * '/community/{communityId}':
 *   put:
 *     tags:
 *       - Community
 *     summary: Update a community
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Community to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - tag_todo
 *               - time
 *               - location
 *               - coordinates
 *               - max_families
 *             properties:
 *               title:
 *                 type: string
 *                 default: 'title'
 *               description:
 *                 type: string
 *                 default: 'description'
 *               tag_todo:
 *                 type: string
 *                 default: 'tag_todo'
 *               time:
 *                 type: string  # Changed from Date to string for correct Swagger format
 *                 default: '2022-11-22'
 *               location:
 *                 type: string
 *                 default: 'location'
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *                 default: [22, 22]
 *               max_families:
 *                 type: integer  # Assuming max_families should be an integer
 *                 default: 3
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */

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
