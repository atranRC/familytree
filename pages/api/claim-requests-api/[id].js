import { ObjectId } from "mongodb";

import dbConnect from "../../../lib/dbConnect";
import ClaimRequests from "../../../models/ClaimRequests";
export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET" /* get all users that are collaborators*/:
            try {
                const claimRequest = await ClaimRequests.findById(ObjectId(id));
                if (!claimRequest) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: claimRequest });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT" /* Edit a model by its ID */:
            try {
                const claimReq = await ClaimRequests.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!claimReq) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: claimReq });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE" /* Delete a model by its ID */:
            try {
                const deletedClaimRequest = await ClaimRequests.deleteOne({
                    _id: id,
                });
                if (!deletedClaimRequest) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
