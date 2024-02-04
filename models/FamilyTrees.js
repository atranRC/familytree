import mongoose from "mongoose";
//const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

/* usersSchema will correspond to a collection in your MongoDB database. */
const FamilyTreesSchema = mongoose.Schema(
    {
        owner: {
            type: String,
            required: [true, "Please provide your name."],
        },
        tree_name: {
            type: String,
            required: [true, "tree name can not be empty"],
        },
        /*members: { type: Array },
    collaborators: { type: Array },
    structure: { type: Array },*/
        description: { type: String },
        privacy: {
            type: String,
            required: [true, "tree privacy can not be empty"],
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

//UsersSchema.plugin(mongoose_fuzzy_searching, { fields: ["username"] });

export default mongoose.models.FamilyTrees ||
    mongoose.model("FamilyTrees", FamilyTreesSchema);
