/*import { MongoClient, ObjectId } from "mongodb";

// Replace the uri string with your MongoDB deployment's connection string.
const uri =
    "mongodb+srv://famtree:famtree@famtree-db.vsuwrhg.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

export default async function handler(req, res) {
    try {
        const database = client.db("famtree");
        const users = database.collection("users");
        // create a document to insert

        const filter = { email: req.body.email };
        //console.log(req.body);
        const options = { upsert: false, returnDocument: "after" };
        const updateDoc = {
            $set: {
                name: req.body.name,
                nicknames: req.body.nicknames,
                fathers_name: "",
                last_name: "",
                current_location: "",
                birth_place: "",
                birthday: "",
                parents: {
                    father: "",
                    mother: "",
                    step_father: [],
                    step_mother: [],
                },
                path: "",
                children: {
                    sons: [],
                    daughters: [],
                    step_sons: [],
                    step_daughters: [],
                },
                relatives: [],
                claimed: true,
            },
        };

        const result = await users.findOneAndUpdate(filter, updateDoc, options);

        /*console.log(
            `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
        );*/ /*
        console.log(result.value);
        res.status(200).json({ updatedUser: result.value });
    } finally {
        //await client.close();
    }
}
*/
import dbConnect from "../../../../lib/dbConnect";
import Users from "../../../../models/Users";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    try {
        const user = await Users.create(
            req.body
        ); /* create a new model in the database */
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
    }
}
