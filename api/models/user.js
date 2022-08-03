const mongoose = require("mongoose");

const userSchema = mongoose.Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
      type: String,
      required: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: false },
    first_name: { type: String, required: false },
    user_name: { type: String, required: true },
    last_name: { type: String, required: false },
    phone_num: { type: String, require: false },
    country: { type: String, required: false },
    created_at: { type: Date, required: true },
    temporaryToken: { type: String, required: true},
    resetPasswordToken: { type: String, required: false},
    token: { type: String, required: false }
});

module.exports = mongoose.model("User", userSchema);