/*
    get user id from req
    get user from db
    get anscestors array
    get users with fathers in ancestors array
    make new array with first item as the first item in ancestors array
    go through fetched result
    make an object out of each
    push to array
    return res
*/
/*
    first element of the node needs to be fetched to get the data
    implement this is an or operator in the query
*/
import { MongoClient, ObjectId } from "mongodb";

const uri =
    "mongodb+srv://famtree:famtree@famtree-db.vsuwrhg.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

export default async function handler(req, res) {
    try {
        //db and collection references
        const database = client.db("famtree");
        const users = database.collection("users");

        const query_children = { "parents.father": req.query.id };

        const cursor = users.find(query_children);
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }

        let user_children = [];

        await cursor.forEach((c, index) => {
            user_children.push(c);
        });
        //console.log(all_children_array);

        console.log(req.query);
        res.status(200).json({ children: user_children });
    } finally {
        //await client.close();
    }
}
