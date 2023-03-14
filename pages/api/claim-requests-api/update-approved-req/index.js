import dbConnect from "../../../../lib/dbConnect";
import TreeMembers from "../../../../models/TreeMembers";
export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const famtrees = await TreeMembers.find(
                    {}
                ); /* find all the data in our database */
                res.status(200).json({ success: true, data: famtrees });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "PUT":
            try {
                const filterIdName = {
                    id: req.body.filterIdName.id,
                };
                const newDataIdName = {
                    $set: {
                        id: req.body.newDataIdName.id,
                        name: req.body.newDataIdName.name,
                    },
                };
                const filterParent = {
                    parent_id: req.body.filterParent.parent_id,
                };
                const newDataParent = {
                    $set: {
                        parent_id: req.body.newDataParent.parent_id,
                    },
                };
                console.log(
                    filterIdName,
                    newDataIdName,
                    filterParent,
                    newDataParent
                );
                const res1 = await TreeMembers.updateMany(
                    filterIdName,
                    newDataIdName
                );

                if (!res1.acknowledged) {
                    console.log(res1);
                    console.log("failed 1");
                    res.status(400).json({ success: false });
                } else {
                    const res2 = await TreeMembers.updateMany(
                        filterParent,
                        newDataParent
                    );
                    if (!res1.acknowledged) {
                        console.log(res2);
                        console.log("failed 2");
                        res.status(400).json({ success: false });
                    } else {
                        const resAll = [res1, res2];
                        res.status(201).json({
                            success: true,
                            data: resAll,
                        });
                    }
                }
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
