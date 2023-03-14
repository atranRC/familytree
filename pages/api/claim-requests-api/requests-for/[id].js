import { ObjectId } from "mongodb";
import dbConnect from "../../../../lib/dbConnect";
import ClaimRequests from "../../../../models/ClaimRequests";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET" /* get all users that are collaborators*/:
            try {
                const claimRequests = await ClaimRequests.find({
                    targetId: id,
                });
                if (!claimRequests) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: claimRequests });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT" /* Edit a model by its ID */:
            try {
                const tree = "under construction";
                if (!tree) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: tree });
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
