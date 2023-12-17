import dbConnect from "../../../lib/dbConnect";
import Invitations from "../../../models/Invitations";
import { InviteTemplate } from "../../../components/v2/email-templates/EmailTemplates";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default async function handler(req, res) {
    const { method } = req;

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
        case "POST":
            try {
                const doc = await Invitations.create(req.body);
                //send email
                const { data, error } = await resend.emails.send({
                    from: "Family Tree <noreply@tigraywiki.com>",
                    to: [doc.inviteeEmail],
                    subject: "You have been invited",
                    react: InviteTemplate({
                        treeName: doc.treeName,
                        invitationType: doc.invitationType,
                        inviterName: doc.inviterName,
                    }),
                });

                if (error) {
                    console.log(error);
                    res.status(400).json({ error });
                }
                res.status(201).json(doc, data);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
