import { ObjectId } from "mongodb";
import dbConnect from "../../../../lib/dbConnect";
import WrittenStories from "../../../../models/WrittenStories";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const writtenstories = await WrittenStories.find(
                    { userId: ObjectId(id) },
                    "_id title location"
                ); /* find all the data in our database */
                res.status(200).json({ success: true, data: writtenstories });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        /*case "POST":
            try {
                const event = await Events.create(
                    req.body
                ); 
                res.status(201).json({ success: true, data: event });
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;*/
        default:
            res.status(400).json({ success: false });
            break;
    }
}
