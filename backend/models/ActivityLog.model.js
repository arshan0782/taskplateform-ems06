import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    meta: {
      type: Object,   
      default: {}
    }
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);