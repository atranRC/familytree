import dbConnect from "../../../../lib/dbConnect";
import Users from "../../../../models/Users";
export default async function handler(req, res) {
    const {
        query: { email },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const user = await Users.findOne({ email: email });
                /*if (!user) {
                    return res.status(400).json({ success: false });
                }*/
                res.status(200).json({ success: true, data: user });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        /*
        case "PUT" :
            try {
                const user = await Users.findByIdAndUpdate(email, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!user) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: user });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE" :
            try {
                const deletedUser = await Users.deleteOne({ email: email });
                if (!deletedPet) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
*/
        default:
            res.status(400).json({ success: false });
            break;
    }
}
