import {CommunityModel, ICommunityDocument} from "../models/CommunitySchema";
import {Request} from "../models/express";
import {NotFoundError} from "../utils/error";
import {parseLocation} from "../utils/helpers";

class CommunityService {
    async getCommunityById(communityId: string): Promise<ICommunityDocument> {
        const community = await CommunityModel.findById(communityId);
        if (!community) {
            throw new NotFoundError("Community not found");
        }
        return community;
    }

    async createCommunity(payload: ICommunityDocument): Promise<ICommunityDocument> {
        return await CommunityModel.create({...payload});
    }

    async updateCommunity(communityId: string, updatedData: Partial<ICommunityDocument>) {
        await this.getCommunityById(communityId);

        return CommunityModel.findByIdAndUpdate(communityId, updatedData, {new: true});
    }

    async deleteCommunity(communityId: string) {
        await this.getCommunityById(communityId);

        return CommunityModel.findByIdAndDelete(communityId);
    }

    async getCommunities(req: Request): Promise<ICommunityDocument[]> {
        let {languages, location, todo} = req.query;
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
        return CommunityModel.find(query, {new: true});
    }


    async joinCommunity(req: Request): Promise<boolean> {
        const {communityId} = req.params;

        await this.getCommunityById(communityId);
        await CommunityModel.findByIdAndUpdate(communityId, {$addToSet: {likes: req.userId}}, {new: true});
        return true;
    }

    async leaveCommunity(req: Request): Promise<boolean> {
        const {communityId} = req.params;

        await this.getCommunityById(communityId);
        await CommunityModel.findByIdAndUpdate(communityId, {$pull: {likes: req.userId}}, {new: true});
        return true;
    }
}

export default new CommunityService();
