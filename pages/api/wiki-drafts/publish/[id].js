import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Wikidrafts from "../../../../models/Wikidrafts";
import Wikis from "../../../../models/Wikis";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "POST" /* Get a model by its ID */:
            try {
                const wikidraft = await Wikidrafts.findById(id);
                //if wikidraft has wikiId
                if (wikidraft.wikiId !== null) {
                    //edit existing wiki
                    const updatedWiki = await Wikis.findByIdAndUpdate(
                        wikidraft.wikiId,
                        req.body,
                        {
                            new: true,
                            runValidators: true,
                        }
                    );
                    if (!updatedWiki) {
                        return res.status(400).json({ success: false });
                    }
                    res.status(200).json({
                        success: true,
                        data: updatedWiki,
                    });
                } else if (wikidraft.wikiId === null) {
                    //create new wiki
                    const wiki = await Wikis.create(
                        req.body
                    ); /* create a new model in the database */

                    //update wikidraft's wikiId field
                    const updatedWikidraft = await Wikidrafts.findByIdAndUpdate(
                        id,
                        { wikiId: wiki._id },
                        {
                            new: true,
                            runValidators: true,
                        }
                    );
                    if (!updatedWikidraft) {
                        return res.status(400).json({ success: false });
                    }
                    res.status(200).json({
                        success: true,
                        data: updatedWikidraft,
                    });
                    //res.status(201).json({ success: true, data: wikidraft });
                } else {
                    if (!wikidraft) {
                        return res.status(400).json({ success: false });
                    }
                    res.status(200).json({ success: true, data: wikidraft });
                }
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        /*case "PUT":
            try {
                const wikidraft = await Wikidrafts.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!wikidraft) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: wikidraft });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;*/

        case "DELETE" /* Delete a model by its ID */:
            try {
                const deletedWikidraft = await Wikidrafts.deleteOne({
                    _id: id,
                });
                if (!deletedWikidraft) {
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
