// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MongoClient, ObjectId } from "mongodb";
//get userid from req.query
//fetch user from mongodb
//return user data
const uri =
    "mongodb+srv://famtree:famtree@famtree-db.vsuwrhg.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

export default async function handler(req, res) {
    try {
        //db and collection references
        const database = client.db("famtree");
        const users = database.collection("users");
        // look for user by id
        const query = { _id: ObjectId(req.query.id) };
        const options = {
            // sort matched documents in descending order by rating
            sort: { "imdb.rating": -1 },
            // Include only the `title` and `imdb` fields in the returned document
            projection: { _id: 0, title: 1, imdb: 1 },
        };
        const user = await users.findOne(query);
        // since this method returns the matched document, not a cursor, print it directly
        console.log(user);
        console.log(req.query);
        res.status(200).json({ user: user });
    } finally {
        //await client.close();
    }
}
