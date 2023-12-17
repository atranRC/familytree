import { getSession } from "next-auth/react";
import dbConnect from "../../../../lib/dbConnect";
import Collabs from "../../../../models/Collabs";
import Invitations from "../../../../models/Invitations";
import { authOptions } from "../../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import TreeMembersB from "../../../../models/TreeMembersB";

export default async function handler(req, res) {
    const {
        query: { email, type, status },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const docs = await Invitations.find({
                    inviteeEmail: email,
                    invitationType: type,
                    status: status,
                });
                res.status(200).json(docs);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "PUT":
            try {
                const session = await unstable_getServerSession(
                    req,
                    res,
                    authOptions
                );
                if (!session) {
                    res.status(401).json({ message: "You must be logged in." });
                    return;
                }

                if (req.body.status === "accepted") {
                    if (req.body.invitationType === "collab") {
                        const collabDoc = await Collabs.create({
                            userId: session.user.id,
                            treeId: req.body.treeId,
                            name: session.user.name,
                            role: req.body.collabRole,
                        });
                    } else if (req.body.invitationType === "member") {
                        //edit treemembersb doc
                        const treeMemberDoc =
                            await TreeMembersB.findByIdAndUpdate(
                                req.body.treeMemberDocumentId,
                                { taggedUser: session.user.id },
                                {
                                    new: true,
                                    runValidators: true,
                                }
                            );
                    }
                }
                const invitationDoc = await Invitations.findByIdAndUpdate(
                    req.body.invitationId,
                    { status: req.body.status },
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                res.status(200).json(invitationDoc);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
