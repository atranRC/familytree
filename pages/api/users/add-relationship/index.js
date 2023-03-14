import { MongoClient, ObjectId } from "mongodb";

// Replace the uri string with your MongoDB deployment's connection string.
const uri =
    "mongodb+srv://famtree:famtree@famtree-db.vsuwrhg.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

export default async function handler(req, res) {
    try {
        const database = client.db("famtree");
        const users = database.collection("users");
        // create a document to insert

        const filter = { _id: ObjectId(req.body.uid) };
        //console.log(req.body);
        const options = { upsert: false, returnDocument: "after" };
        const updateDoc = {
            $set: {
                "parents.father": req.body.newFather,
                ancestors: req.body.newAncestors,
            },
        };

        const result = await users.findOneAndUpdate(filter, updateDoc, options);

        /*console.log(
            `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
        );*/
        console.log(result.value);
        res.status(200).json({ updatedUser: result.value });
    } finally {
        //await client.close();
    }
}
