import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreatePostInput } from "./dto/create-post.input";
import { Post, PostDocument } from "./model/post.model";
import { v2 } from "cloudinary";
import { UserService } from "src/user/user.service";

@Injectable()
export class PostService {
  private v2: any;
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly userService: UserService
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
      .exec();
  }
}
