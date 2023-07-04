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
import { ObjectId } from "mongodb";
import dbConnect from "../../../../lib/dbConnect";
import Events from "../../../../models/Events";
import Users from "../../../../models/Users";

export default async function handler(req, res) {
    const {
        query: { email },
        method,
    } = req;
    const options = {
        new: true,
        runValidators: true,
    };
    console.log(req.body, email);
    await dbConnect();

    if (method === "PUT") {
        try {
            const updatedUser = Users.findOneAndUpdate(
                { email: email },
                { $set: req.body },
                options,
                async (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                        return res.status(400).json({ success: false });
                    }
                    console.log(doc);
                    if (doc) {
                        //add events instance here
                        const event = await Events.create({
                            userId: ObjectId(doc._id.toString()),
                            userName: doc.name,
                            authorId: ObjectId(doc._id.toString()),
                            authorName: req.body.name,
                            type: "birth",
                            description: "Birthday",
                            location: req.body.birth_place,
                            eventDate: req.body.birthday,
                        });
                        res.status(200).json({ success: true, data: doc });
                    } else {
                        res.status(400).json({ success: false });
                    }
                }
            );
        } catch (error) {
            console.log(error);
            res.status(400).json({ success: false });
        }
    } else {
        res.status(400).json({ success: false });
    }
}
