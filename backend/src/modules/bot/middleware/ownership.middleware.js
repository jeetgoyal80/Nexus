import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";

export const requireResourceOwner = (resourceOwnerId, currentUserId) => {
  if (resourceOwnerId.toString() !== currentUserId.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "You do not have access to this resource");
  }
};
