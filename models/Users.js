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
    owner: {
        type: String,
        required: [true, "Please provide your name."],
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
    isHistorian: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
});

//UsersSchema.plugin(mongoose_fuzzy_searching, { fields: ["username"] });

export default mongoose.models.Users || mongoose.model("Users", UsersSchema);
