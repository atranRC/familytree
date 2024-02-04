import mongoose from "mongoose";
//const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

/* usersSchema will correspond to a collection in your MongoDB database. */
const UsersSchema = mongoose.Schema(
    {
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
            value: {
                type: String,
            },
            lon: {
                type: mongoose.Types.Decimal128,
            },
            lat: {
                type: mongoose.Types.Decimal128,
            },
        },
        birthday: {
            type: Date,
        },
        owner: {
            type: String,
            required: [true, "Please provide your name."],
        },

        current_residence: {
            value: {
                type: String,
            },
            lon: {
                type: mongoose.Types.Decimal128,
            },
            lat: {
                type: mongoose.Types.Decimal128,
            },
        },

        fathers_name: {
            type: String,
        },

        last_name: {
            type: String,
        },
        shortBio: {
            type: String,
            default: "-",
        },

        sex: {
            type: String,
            required: [true, "Please provide your name."],
        },

        nicknames: {
            type: String,
            default: "-",
        },

        isHistorian: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        isPrivate: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
        died: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

//UsersSchema.plugin(mongoose_fuzzy_searching, { fields: ["username"] });

export default mongoose.models.Users || mongoose.model("Users", UsersSchema);
