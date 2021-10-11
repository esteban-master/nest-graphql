import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreatePostInput } from "./dto/create-post.input";
import { Post, PostDocument } from "./model/post.model";
import { v2 } from "cloudinary";
import { UserService } from "src/user/user.service";
import { FollowService } from "src/follow/follow.service";
import { CreateCommentInput } from "./dto/createCommentInput";
import { User } from "src/user/model/user.model";
import { DeleteCommentInput } from "./dto/deleteCommentInput";

@Injectable()
export class PostService {
  private v2: any;
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly userService: UserService,
    private readonly followService: FollowService
  ) {
    v2.config({
      cloud_name: "dlsuecuz3",
      api_key: "357627664775429",
      api_secret: "YtCflfjqfW7yY-QqN6OBB7uwgK8",
    });
    this.v2 = v2;
  }

  public async create(createPost: CreatePostInput) {
    try {
      const uploadResponse = await this.v2.uploader.upload(createPost.photo, {
        upload_preset: "ml_default",
      });
      const post = new this.postModel({
        text: createPost.text,
        photo: uploadResponse.url,
        postedBy: createPost.postedBy,
      });
      const newPost = await (await post.save()).populate("postedBy");
      return newPost;
    } catch (error) {
      throw new InternalServerErrorException("Error al subir la post");
    }
  }

  public async postsByUsername(username: string): Promise<Post[]> {
    const user = await this.userService.findByUsername(username);
    return await this.postModel
      .find({ postedBy: user._id })
      .sort({ createdAt: -1 })
      .populate("postedBy")
      .populate("likes")
      .populate("comments.postedBy")
      .exec();
  }

  public async feedTimeline(idUser: string, cursor?: string) {
    const ids = await this.followService.getFollowingNoPaginate(idUser);
    const condicion = cursor
      ? {
          postedBy: { $in: ids },
          _id: { $lt: new Types.ObjectId(cursor) },
        }
      : { postedBy: { $in: ids } };
    return await this.postModel
      .find(condicion)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("postedBy")
      .populate("likes")
      .populate("comments.postedBy");
  }

  public async likePost(idPost: string, userRequest: User) {
    try {
      const postUpdate = await this.postModel
        .findOneAndUpdate(
          { _id: idPost },
          {
            $addToSet: {
              likes: userRequest,
            },
          },
          {
            new: true,
          }
        )
        .populate("likes");
      return postUpdate;
    } catch (error) {
      throw new InternalServerErrorException("Error al dar like al post");
    }
  }
  public async dislikePost(idPost: string, userRequest: User) {
    try {
      return await this.postModel
        .findOneAndUpdate(
          { _id: idPost },
          {
            $pull: {
              likes: userRequest._id,
            },
          },
          {
            new: true,
          }
        )
        .populate("likes");
    } catch (error) {
      throw new InternalServerErrorException("Error al dar dislike al post");
    }
  }

  public async commentPost(
    { idPost, text }: CreateCommentInput,
    userRequest: User
  ) {
    try {
      const postUpdate = await this.postModel
        .findOneAndUpdate(
          { _id: idPost },
          {
            $push: {
              comments: {
                text,
                postedBy: userRequest._id,
                createdAt: new Date(),
              },
            },
          },
          {
            new: true,
          }
        )
        .populate("likes")
        .populate("comments.postedBy")
        .populate("postedBy");

      return postUpdate;
    } catch (error) {
      throw new InternalServerErrorException("Error al comentar el post");
    }
  }

  public async deleteCommentPost(
    { idComment, idPostedBy, idPost }: DeleteCommentInput,
    userRequest: User
  ) {
    const isOwner = idPostedBy === userRequest._id.toString();
    if (!isOwner) {
      return false;
    }
    try {
      await this.postModel.findOneAndUpdate(
        { _id: idPost },
        {
          $pull: {
            comments: {
              _id: idComment,
            },
          },
        },
        { new: true }
      );

      return true;
    } catch (error) {
      throw new InternalServerErrorException("Error al comentar el post");
    }
  }
}
