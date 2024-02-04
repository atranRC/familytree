import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../lib/dbConnect";
import Articledrafts from "../../../models/Articledrafts";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const articledrafts = await Articledrafts.find({});
                res.status(200).json({ success: true, data: articledrafts });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
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
                const articledraft = await Articledrafts.create({
                    ...req.body,
                    authorId: session.user.id,
                    authorName: session.user.name,
                    isPublished: false,
                    articleId: null,
                });
                res.status(201).json({
                    success: true,
                    data: articledraft,
                });
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
