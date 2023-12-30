import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../../lib/dbConnect";
import Collabs from "../../../../models/Collabs";
import FamilyTrees from "../../../../models/FamilyTrees";
import TreeMembersB from "../../../../models/TreeMembersB";
import { authOptions } from "../../auth/[...nextauth]";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    let {
        query: { userId, filter, searchTerm, page, pageSize },
        method,
    } = req;

    /**
     * if filter = my trees
     *  get all FamilyTrees where owner is userId and tree_name is searchTerm
     *
     * if filter = mycollabs,
     *  get treeId of collabs docs where userId is userId
     *  create array of collab.treeId's
     *  get all FamilyTrees where _id is in the array and tree_name is searchTerm
     *
     * if filter = treesImIn,
     *  get treeId of TreemembersB docs where taggedUser is userId
     *  create array of treemembersb.treeId's
     *  get all FamilyTrees where _id is in the array and tree_name is searchTerm
     */

    /*let dbQuery = {};
    dbQuery = {
        tree_name: { $regex: new RegExp(searchTerm, "i") },
    };*/

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                page = parseInt(page, 10) || 1;
                pageSize = parseInt(pageSize, 10) || 10;

                if (filter === "myTrees") {
                    const trees = await FamilyTrees.aggregate([
                        {
                            $facet: {
                                metadata: [{ $count: "totalCount" }],
                                data: [
                                    {
                                        $match: {
                                            owner: userId,
                                            tree_name: {
                                                $regex: new RegExp(
                                                    searchTerm,
                                                    "i"
                                                ),
                                            },
                                        },
                                    },
                                    { $skip: (page - 1) * pageSize },
                                    { $limit: pageSize },
                                ],
                                count: [
                                    {
                                        $match: {
                                            owner: userId,
                                            tree_name: {
                                                $regex: new RegExp(
                                                    searchTerm,
                                                    "i"
                                                ),
                                            },
                                        },
                                    },
                                    { $count: "total" },
                                ],
                            },
                        },
                        { $unwind: "$count" },
                        {
                            $addFields: {
                                count: "$count.total",
                            },
                        },
                    ]);
                    res.status(200).json(trees);
                } else if (filter === "myCollabs") {
                    //const collabs = await Collabs.find({userId: userId}).select('treeId');
                    const collabs = await Collabs.find({
                        userId: userId,
                    }).select("treeId");
                    const treesIdArray = collabs.map((t) => ObjectId(t.treeId));

                    const trees = await FamilyTrees.aggregate([
                        {
                            $facet: {
                                metadata: [{ $count: "totalCount" }],
                                data: [
                                    {
                                        $match: {
                                            _id: { $in: treesIdArray },
                                            tree_name: {
                                                $regex: new RegExp(
                                                    searchTerm,
                                                    "i"
                                                ),
                                            },
                                        },
                                    },
                                    { $skip: (page - 1) * pageSize },
                                    { $limit: pageSize },
                                ],
                                count: [
                                    {
                                        $match: {
                                            _id: { $in: treesIdArray },
                                            tree_name: {
                                                $regex: new RegExp(
                                                    searchTerm,
                                                    "i"
                                                ),
                                            },
                                        },
                                    },
                                    { $count: "total" },
                                ],
                            },
                        },
                        { $unwind: "$count" },
                        {
                            $addFields: {
                                count: "$count.total",
                            },
                        },
                    ]);
                    res.status(200).json(trees);
                } else if (filter === "treesImIn") {
                    const treeMemberships = await TreeMembersB.find({
                        taggedUser: userId,
                    }).select("treeId");
                    const membershipsArray = treeMemberships.map((t) =>
                        ObjectId(t.treeId)
                    );

                    const trees = await FamilyTrees.aggregate([
                        {
                            $facet: {
                                metadata: [{ $count: "totalCount" }],
                                data: [
                                    {
                                        $match: {
                                            _id: { $in: membershipsArray },
                                            tree_name: {
                                                $regex: new RegExp(
                                                    searchTerm,
                                                    "i"
                                                ),
                                            },
                                        },
                                    },
                                    { $skip: (page - 1) * pageSize },
                                    { $limit: pageSize },
                                ],
                                count: [
                                    {
                                        $match: {
                                            _id: { $in: membershipsArray },
                                            tree_name: {
                                                $regex: new RegExp(
                                                    searchTerm,
                                                    "i"
                                                ),
                                            },
                                        },
                                    },
                                    { $count: "total" },
                                ],
                            },
                        },
                        { $unwind: "$count" },
                        {
                            $addFields: {
                                count: "$count.total",
                            },
                        },
                    ]);
                    res.status(200).json(trees);
                } else {
                    res.status(200).json([]);
                }
            } catch (error) {
                //console.log(error);
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const session = await unstable_getServerSession(
                    req,
                    res,
                    authOptions
                );
                if (!session) {
                    res.status(401).json({ message: "You must be logged in." });
                    return;
                }

                const tree = await FamilyTrees.create({
                    owner: session.user.id,
                    tree_name: req.body.tree_name,
                    description: req.body.description,
                    privacy: req.body.privacy,
                });

                res.status(200).json(tree);
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
