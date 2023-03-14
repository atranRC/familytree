import { MongoClient } from "mongodb";

// Replace the uri string with your MongoDB deployment's connection string.
const uri =
    "mongodb+srv://famtree:famtree@famtree-db.vsuwrhg.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

export default async function handler(req, res) {
    try {
        const database = client.db("famtree");
        const users = database.collection("users");
        // create a document to insert
        const doc = {
            username: req.body.name,
            email: "",
            password: "",
            name: req.body.name,
            fathers_name: "",
            last_name: "",
            nicknames: [],
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
            pic_url: "",
            claimed: true,
            ancestors: [],
        };
        //console.log(req.body);

        const result = await users.insertOne(doc);

        console.log(
            `A document was inserted with the _id: ${result.insertedId}`
        );
        if (result) {
            result.acknowledged
                ? res.status(200).json({ doc: doc })
                : res.status(500).json({ message: "not created" });
        }
    } finally {
        //await client.close();
    }
}
