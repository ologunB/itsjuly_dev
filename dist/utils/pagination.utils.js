"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
function paginate({ model, filterQuery, page, limit, populate, projection, }) {
    return __awaiter(this, void 0, void 0, function* () {
        // Convert page and limit to numbers (in case they're passed as strings)
        const parsedPage = Number(page) > 0 ? Number(page) : 1;
        const parsedLimit = Number(limit) > 0 ? Number(limit) : 20;
        // Calculate the number of documents to skip
        const skip = (parsedPage - 1) * parsedLimit;
        const totalItems = yield model.countDocuments(filterQuery);
        // Calculate the total number of pages
        const totalPages = Math.ceil(totalItems / parsedLimit);
        let dataQuery = model.find(filterQuery, projection, {
            sort: { createdAt: -1 },
            limit: parsedLimit,
            skip: skip,
        });
        // Populate fields if provided
        if (populate === null || populate === void 0 ? void 0 : populate.length) {
            for (const popConfig of populate) {
                dataQuery = dataQuery.populate(popConfig);
            }
        }
        const data = yield dataQuery;
        const hasPrevious = parsedPage > 1;
        const hasNext = parsedPage < totalPages;
        // Return structured response
        return {
            data: data,
            meta: {
                currentPage: parsedPage,
                totalItems: totalItems,
                itemsPerPage: parsedLimit,
                totalPages: totalPages,
                hasPrevious,
                hasNext,
            },
        };
    });
}
exports.paginate = paginate;
