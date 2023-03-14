import dbConnect from "../../../lib/dbConnect";
import FamilyTrees from "../../../models/FamilyTrees";
import { ObjectId } from "mongodb";
import Users from "../../../models/Users";
import TreeMembers from "../../../models/TreeMembers";
export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */:
            try {
                const familyTree = await FamilyTrees.findById(id);
                if (!familyTree) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: familyTree });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT" /* Edit a model by its ID */:
            try {
                //req.body = {
                //rtype
                //tree_member_id
                //new_member_id
                //}
                //FamilyTrees.findOneAndUpdate(
                //  { _id: id, 'structure.id': tree_member_id },
                //	{
                //	    $set: {
                //		    'structure.$.parent_id': new_member_id,
                //      }
                //  },
                //);
                //create_user
                //create_fields: {

                //}
                //let familyTree = null;
                if (req.body.create_user) {
                    try {
                        const user = Users.create(req.body.create_fields).then(
                            async function (data) {
                                //id = data._id.toString()

                                //
                                console.log("user created", data);
                                if (req.body.rtype === "father") {
                                    //
                                    try {
                                        const new_member = {
                                            treeId: req.body.treeId,
                                            id: data._id.toString(),
                                            name: data.name,
                                            parent_id: "",
                                            attributes: {
                                                spouse: "",
                                                status: "",
                                            },
                                            canPost: false,
                                        };
                                        const treeMembers = TreeMembers.create(
                                            new_member
                                        ).then(function (err, data) {
                                            console.log("hiiiiiii", err);
                                            TreeMembers.findByIdAndUpdate(
                                                req.body.tree_member_id,
                                                {
                                                    parent_id: err.id,
                                                }
                                            ).then(function (err) {
                                                console.log("imhere");
                                                if (err) {
                                                    console.log();
                                                    res.status(200).json({
                                                        success: true,
                                                        data: err,
                                                    });
                                                } else {
                                                    res.status(400).json({
                                                        success: false,
                                                    });
                                                }
                                            });
                                        });
                                        /*const familyTree =
                                            FamilyTrees.findOneAndUpdate(
                                                { _id: ObjectId(id) },
                                                {
                                                    $push: {
                                                        structure: new_member,
                                                    },
                                                }
                                            ).then(function (err, data) {
                                                FamilyTrees.findOneAndUpdate(
                                                    {
                                                        _id: ObjectId(id),
                                                        "structure.id":
                                                            req.body
                                                                .tree_member_id,
                                                    },
                                                    {
                                                        $set: {
                                                            "structure.$.parent_id":
                                                                new_member.id,
                                                        },
                                                    }
                                                ).then(function (err) {
                                                    console.log("imhere");
                                                    if (err) {
                                                        console.log();
                                                        res.status(200).json({
                                                            success: true,
                                                            data: err,
                                                        });
                                                    } else {
                                                        res.status(400).json({
                                                            success: false,
                                                        });
                                                    }
                                                });
                                            });*/
                                    } catch {
                                        res.status(400).json({
                                            success: false,
                                        });
                                    }
                                } else if (req.body.rtype === "child") {
                                    console.log(
                                        "creating child",
                                        req.body.rtype
                                    );

                                    try {
                                        const new_member = {
                                            treeId: req.body.treeId,
                                            id: data._id.toString(),
                                            name: data.name,
                                            parent_id:
                                                req.body
                                                    .selected_tree_member_id,
                                            attributes: {
                                                spouse: "",
                                                status: "",
                                            },
                                            canPost: false,
                                        };

                                        const treeMembers =
                                            await TreeMembers.create(
                                                new_member
                                            );
                                        if (!treeMembers) {
                                            console.log(
                                                "error hereee",
                                                treeMembers
                                            );
                                            return res
                                                .status(400)
                                                .json({ success: false });
                                        }
                                        res.status(200).json({
                                            success: true,
                                            data: treeMembers,
                                        });
                                    } catch (error) {
                                        console.log("er here", error);
                                        res.status(400).json({
                                            success: false,
                                        });
                                    }
                                }
                            }
                        ); /* create a new model in the database */
                    } catch (error) {
                        res.status(400).json({ success: false });
                    }
                } else {
                    //if adding an existing user
                    if (req.body.rtype === "father") {
                        //
                        const treeMembers = TreeMembers.create(
                            req.body.new_member
                        ).then(function (err) {
                            TreeMembers.findByIdAndUpdate(
                                req.body.tree_member_id,
                                {
                                    parent_id: err.id,
                                }
                            ).then(function (err) {
                                console.log("imhere");
                                if (err) {
                                    console.log();
                                    res.status(200).json({
                                        success: true,
                                        data: err,
                                    });
                                } else {
                                    res.status(400).json({
                                        success: false,
                                    });
                                }
                            });
                        });
                    } else if (req.body.rtype === "child") {
                        console.log("adding child from users");
                        try {
                            const familyTree2 = await TreeMembers.create(
                                req.body.new_member
                            );
                            if (!familyTree2) {
                                console.log("error hereee", familyTree2);
                                return res.status(400).json({ success: false });
                            }
                            res.status(200).json({
                                success: true,
                                data: familyTree2,
                            });
                        } catch (error) {
                            console.log("er here", error);
                            res.status(400).json({
                                success: false,
                            });
                        }
                    }
                }

                /*const familyTree = await FamilyTrees.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );*/
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE" /* Delete a model by its ID */:
            try {
                const deletedFamilyTree = await FamilyTrees.deleteOne({
                    _id: id,
                });
                if (!deletedFamilyTree) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "PATCH" /* Delete a model by its ID */:
            try {
                const updatedData = await FamilyTrees.findByIdAndUpdate(
                    id,
                    req.body
                );
                if (!updatedData) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: updatedData });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
