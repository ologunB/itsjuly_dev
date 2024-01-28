import { ProjectionType } from "mongoose";
import { Model, FilterQuery } from "mongoose";
interface IPaginationOptions<T> {
  model: Model<T>;
  filterQuery: FilterQuery<T>;
  page: number;
  limit: number;
  populate?: any[]; // Adjusted to accept an array of objects for complex populate configurations
  projection?: ProjectionType<T>;
}
export async function paginate<T>({
  model,
  filterQuery,
  page,
  limit,
  populate,
  projection,
}: IPaginationOptions<T>) {
  // Convert page and limit to numbers (in case they're passed as strings)
  const parsedPage = Number(page) > 0 ? Number(page) : 1;
  const parsedLimit = Number(limit) > 0 ? Number(limit) : 20;

  // Calculate the number of documents to skip
  const skip = (parsedPage - 1) * parsedLimit;

  const totalItems = await model.countDocuments(filterQuery);

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalItems / parsedLimit);

  let dataQuery = model.find(filterQuery, projection, {
    sort: { createdAt: -1 },
    limit: parsedLimit,
    skip: skip,
  });

  // Populate fields if provided
  if (populate?.length) {
    for (const popConfig of populate) {
      dataQuery = dataQuery.populate(popConfig) as unknown as typeof dataQuery;
    }
  }

  const data = await dataQuery;

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
}
