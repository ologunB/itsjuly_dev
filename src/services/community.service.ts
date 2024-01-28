import {CommunityModel, ICommunityDocument} from "../models/CommunitySchema";
import {Request} from "../models/express";
import {NotFoundError} from "../utils/error";
import {parseLocation} from "../utils/helpers";

class CommunityService {
    async getCommunityById(communityId: string): Promise<ICommunityDocument> {
        const community = await CommunityModel.findById(communityId).populate('creator');
        if (!community) {
            throw new NotFoundError("Community not found");
        }
        return community;
    }

    async createCommunity(payload: ICommunityDocument): Promise<ICommunityDocument> {

        return await CommunityModel.create({...payload});
    }

    async updateCommunity(req: Request) {
        const {communityId} = req.params;
        const data = req.body;
        const gotten = await this.getCommunityById(communityId);
        if (gotten.creator._id != req.userId) {
            throw new NotFoundError("You dont have permission to update community");
        }
        return CommunityModel.findByIdAndUpdate(communityId, data, {new: true});
    }

    async deleteCommunity(req: Request) {
        const {communityId} = req.params;
        const gotten = await this.getCommunityById(communityId);
        if (gotten.creator._id != req.userId) {
            throw new NotFoundError("You dont have permission to update community");
        }
        return CommunityModel.findByIdAndDelete(communityId);
    }

    async getCommunities(req: Request): Promise<ICommunityDocument[]> {
        let {languages, location, todo, page} = req.query;
        const query: any = {};
        if (languages) {
            languages = (languages || '') as string;
            const languagesArray = languages.split(',');
            query.languages = {$in: languagesArray};
        }
        if (todo) {
            todo = (todo || '') as string;
            const todoArray = todo.split(',');
            query.todo = {$in: todoArray};
        }
        if (location) {
            let parsed: string[] | undefined = parseLocation(location as string);
            if (parsed) {
                query.location = {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [parsed[0], parsed[1]]
                        },
                        $maxDistance: 1000
                    }
                }
            } else if (location == 'around-me') {
                const user = req.user!;
                query.location = {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: user.coordinates?.coordinates
                        },
                        $maxDistance: 1000
                    }
                }
            }
        }

        console.log(query);
        const pageSize = 20;
        page = (page || '1') as string;
        const pageNumber = parseInt(page, 10);

        const offset = (pageNumber - 1) * pageSize;
        return CommunityModel.find(query, {
            password: 0,
            verification_code: 0,
            forgot_password_code: 0
        }).skip(offset).limit(pageSize).populate('creator');
    }


    async joinCommunity(req: Request): Promise<boolean> {
        const {communityId} = req.params;
        const gotten = await this.getCommunityById(communityId);
        if (gotten.creator._id == req.userId) {
            throw new NotFoundError("You cant join/leave your own community");
        }
        await CommunityModel.findByIdAndUpdate(communityId, {$addToSet: {members: req.userId}}, {new: true});
        return true;
    }

    async leaveCommunity(req: Request): Promise<boolean> {
        const {communityId} = req.params;
        const gotten = await this.getCommunityById(communityId);
        if (gotten.creator._id == req.userId) {
            throw new NotFoundError("You cant join/leave your own community");
        }
        await CommunityModel.findByIdAndUpdate(communityId, {$pull: {members: req.userId}}, {new: true});
        return true;
    }
}

export default new CommunityService();
