import dbConnect from "../../../lib/dbConnect";
import Events from "../../../models/Events";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const events = await Events.find(
                    {}
                ); /* find all the data in our database */
                res.status(200).json({ success: true, data: events });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const event = await Events.create(
                    req.body
                ); /* create a new model in the database */
                res.status(201).json({ success: true, data: event });
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
