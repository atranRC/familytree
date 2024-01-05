import dbConnect from "../../../lib/dbConnect";
import Invitations from "../../../models/Invitations";
import { InviteTemplate } from "../../../components/v2/email-templates/EmailTemplates";
import { Resend } from "resend";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getSessionTreeRelationUtil } from "../../../utils/dbUtils";
import FamilyTrees from "../../../models/FamilyTrees";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default async function handler(req, res) {
    const {
        query: { treeId },
        method,
    } = req;

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const docs = await Invitations.find(
                    {}
                ); /* find all the data in our database */
                res.status(200).json(docs);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        /**
         * inviterId, inviterName
         * inviteeEmail, invitationType, treeId, treeMemberDocumentId
         * status
         *
         * post allowed only if session is tree onwer or collab
         */
        case "POST":
            try {
                const isOwnerPromise = getSessionTreeRelationUtil(
                    session,
                    treeId, //treeId
                    "owner"
                );
                const isCollabPromise = getSessionTreeRelationUtil(
                    session,
                    treeId, //treeId
                    "collaborator"
                );
                const [isOwner, isCollab] = await Promise.all([
                    isOwnerPromise,
                    isCollabPromise,
                ]);
                if (!(isOwner === "owner" || isCollab === "collaborator")) {
                    res.status(400).json({ success: false });
                    return;
                }

                //get tree name and id
                const tree = await FamilyTrees.findById(treeId).select(
                    "tree_name"
                );
                //create invitation

                const doc = await Invitations.create({
                    ...req.body,
                    inviterId: session.user.id,
                    inviterName: session.user.name,
                    treeId: tree._id,
                    treeName: tree.tree_name,
                    status: "pending",
                });
                //send email
                const { data, error } = await resend.emails.send({
                    from: "Family Tree <noreply@tigraywiki.com>",
                    to: [doc.inviteeEmail],
                    subject: "Family Tree Invitation",
                    react: InviteTemplate({
                        treeName: doc.treeName,
                        invitationType: doc.invitationType,
                        inviterName: doc.inviterName,
                    }),
                });

                if (error) {
                    //console.log(error);
                    res.status(400).json({ error });
                }
                res.status(201).json(doc, data);
            } catch (error) {
                //console.log(error);
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
