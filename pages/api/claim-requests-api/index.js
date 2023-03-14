import dbConnect from "../../../lib/dbConnect";
import ClaimRequests from "../../../models/ClaimRequests";
export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const claimRequests = await ClaimRequests.find(
                    {}
                ); /* find all the data in our database */
                res.status(200).json({ success: true, data: claimRequests });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const existingClaim = await ClaimRequests.exists({
                    userId: req.body.userId,
                    targetId: req.body.targetId,
                    targetOwnerId: req.body.targetOwnerId,
                });
                if (existingClaim) {
                    console.log("already exists");
                    res.status(400).json({ success: false });
                } else {
                    const newClaimRequest = await ClaimRequests.create(
                        req.body
                    );
                    res.status(201).json({
                        success: true,
                        data: newClaimRequest,
                    });
                }
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
