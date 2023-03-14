// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MongoClient, ObjectId } from "mongodb";

const uri =
    "mongodb+srv://famtree:famtree@famtree-db.vsuwrhg.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

export default async function handler(req, res) {
    try {
        //db and collection references
        const database = client.db("famtree");
        const users = database.collection("users");

        const cursor = users.find([
            {
                $search: {
                    index: "searchUsers",
                    text: {
                        query: '{"username": {&eq: "samuser1"}}',
                        path: {
                            wildcard: "*",
                        },
                    },
                },
            },
        ]);

        // print a message if no documents were found
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }

        //go through return item and push to a new array
        let res_array = [];
        await cursor.forEach((user) => res_array.push(user));

        console.log(req.query);
        res.status(200).json({ users: res_array });
    } finally {
        //await client.close();
    }
}
