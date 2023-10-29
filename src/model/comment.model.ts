import mongoose,{Document} from "mongoose";

export interface CommentAttribute {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  comment: string;
}

export const commentSchema = new mongoose.Schema<CommentAttribute>(
  {
    fullName: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model<CommentAttribute & Document>(
  "Comment",
  commentSchema
);
export default Comment;
