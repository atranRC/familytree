import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Articledrafts from "../../../../models/Articledrafts";
import Articles from "../../../../models/Articles";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    await dbConnect();

    switch (method) {
        case "POST" /* Get a model by its ID */:
            try {
                const articledraft = await Articledrafts.findById(id);
                //if articledraft has articleId
                if (articledraft.articleId !== null) {
                    //edit existing article
                    console.log("editing existing article");
                    const updatedArticle = await Articles.findByIdAndUpdate(
                        articledraft.articleId,
                        {
                            ...req.body,
                            authorId: session.user.id,
                            authorName: session.user.name,
                            //isPublished: true,
                            articleId: null,
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    );
                    if (!updatedArticle) {
                        return res.status(400).json({ success: false });
                    }
                    res.status(200).json({
                        success: true,
                        data: updatedArticle,
                    });
                } else if (articledraft.articleId === null) {
                    //create new article
                    console.log("creating a new article");
                    const article = await Articles.create({
                        ...req.body,
                        authorId: session.user.id,
                        authorName: session.user.name,
                        //isPublished: true,
                    }); /* create a new model in the database */

                    //update articledraft's articleId field
                    console.log("updating articledraft");
                    const updatedArticledraft =
                        await Articledrafts.findByIdAndUpdate(
                            id,
                            { articleId: article._id },
                            {
                                new: true,
                                runValidators: true,
                            }
                        );
                    if (!updatedArticledraft) {
                        return res.status(400).json({ success: false });
                    }
                    res.status(200).json({
                        success: true,
                        data: updatedArticledraft,
                    });
                    //res.status(201).json({ success: true, data: articledraft });
                } else {
                    if (!articledraft) {
                        return res.status(400).json({ success: false });
                    }
                    res.status(200).json({ success: true, data: articledraft });
                }
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;

        /*case "PUT":
            try {
                const articledraft = await Articledrafts.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!articledraft) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: articledraft });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;*/

        case "DELETE" /* Delete a model by its ID */:
            try {
                const deletedArticledraft = await Articledrafts.deleteOne({
                    _id: id,
                });
                if (!deletedArticledraft) {
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
