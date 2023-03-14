import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Events from "../../../../models/Events";

const EVENTS_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { id, p },
        method,
    } = req;

    const page = p || 1;
    const dbQuery = { userId: id };

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */:
            try {
                const skip = (page - 1) * EVENTS_PER_PAGE;
                const countPromise =
                    //Events.estimatedDocumentCount(dbQuery);
                    Events.countDocuments(dbQuery);
                const eventsPromise = Events.find(dbQuery)
                    .limit(EVENTS_PER_PAGE)
                    .skip(skip)
                    .sort({ eventDate: "descending" });
                const [count, events] = await Promise.all([
                    countPromise,
                    eventsPromise,
                ]);

                const pageCount = Math.floor(count / EVENTS_PER_PAGE) + 1;

                if (!count || !events) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({
                    success: true,
                    data: { pagination: { count, pageCount }, events },
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        /*case "PUT" :
            try {
                const writtenStory = await Events.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!writtenStory) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: writtenStory });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const deletedWrittenStory = await Events.deleteOne({
                    _id: id,
                });
                if (!deletedWrittenStory) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;*/

        default:
            res.status(400).json({ success: false });
            break;
    }
}
