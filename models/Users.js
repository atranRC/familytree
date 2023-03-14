import mongoose from "mongoose";
//const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

/* usersSchema will correspond to a collection in your MongoDB database. */
const UsersSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name."],
        maxlength: [60, "Name cannot be more than 60 characters"],
    },
    email: {
        type: String,
    },
    image: {
        type: String,
    },
    emailVerified: {
        type: Boolean,
    },
    birth_place: {
        type: String,
    },
    birthday: {
        type: Date,
    },
    children: {
        sons: { type: Array },
        daughters: { type: Array },
        step_sons: { type: Array },
        step_daughters: { type: Array },
    },
    owner: {
        type: String,
        required: [true, "Please provide your name."],
    },

    current_location: {
        type: String,
    },

    current_residence: {
        type: String,
    },

    fathers_name: {
        type: String,
    },

    last_name: {
        type: String,
    },

    nicknames: {
        type: String,
    },
    parents: {
        father: { type: String },
        mother: { type: String },
        step_father: { type: String },
        step_mother: { type: String },
    },
    path: {
        type: String,
    },
    relatives: {
        type: Array,
    },
    ancestors: {
        type: Array,
    },
    isHistorian: {
        type: Boolean,
        default: false,
    },
});

//UsersSchema.plugin(mongoose_fuzzy_searching, { fields: ["username"] });

export default mongoose.models.Users || mongoose.model("Users", UsersSchema);
