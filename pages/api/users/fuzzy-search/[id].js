import dbConnect from "../../../../lib/dbConnect";
import Users from "../../../../models/Users";

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const users = await Users.fuzzySearch("new");
                console.log("new", users);
                /*const regex = new RegExp(escapeRegex("nw"), "");
                const users = await Users.find(
                    { name: regex },
                    function (err, foundUsers) {
                        if (err) {
                            console.log(err);
                        } else {
                            //res.render("users/index", { jobs: foundjobs });
                            /*res.status(200).json({
                                success: "oi",
                                data: foundUsers,
                            });*/
                /* console.log(foundUsers);
                        }
                    }
                );*/ /* find all the data in our database */
                console.log(users);
                res.status(200).json({ success: "oi", data: users });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            /*try {
                const user = await Users.create(req.body); // create a new model in the database
                res.status(201).json({ success: true, data: user });
            } catch (error) {
                res.status(400).json({ success: false });
            }*/
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
