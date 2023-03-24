import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogType } from 'src/transaction/enum';
import { TransactionService } from 'src/transaction/transaction.service';
import { BaseBlogDto, UpdateBlogDto } from './dto';
import { Blog, BlogDocument } from './schema';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly _blogModel: Model<BlogDocument>,
    private readonly _transactionService: TransactionService,
  ) {}

  public async createBlog(
    creationData: BaseBlogDto,
  ): Promise<Blog | any | null> {
    const blog = await new this._blogModel(creationData).save();
    const transaction = await this._transactionService.createLog(
      blog._id,
      blog.creator,
      LogType.CREATE,
    );

    if (!blog) {
      throw new InternalServerErrorException(
        'Blog Cannot Be Created Due To An Unknown Error!',
      );
    }
    if (!transaction) {
      throw new InternalServerErrorException(
        'Transaction Cannot Be Created Due to An Unknown Error!',
      );
    }

    return {
      status: 201,
      message: 'Blog Created Successfully!',
    };
  }

  public async getAllBlogs(): Promise<Blog[] | any | null> {
    return await this._blogModel.find({}).exec();
  }

  public async getBlogsByUser(userId: string): Promise<Blog[] | any | null> {
    return await this._blogModel.find({ creator: userId }).exec();
  }

  public async getBlogById(
    blogId: string,
    userId: string,
  ): Promise<Blog | any | null> {
    const blog$ = await this._blogModel
      .findOne({ _id: blogId, creator: userId })
      .exec();

    if (!blog$) {
      throw new NotFoundException('Blog Does Not Exist!');
    }

    return blog$;
  }

  public async updateBlog(
    blogId: string,
    userId: string,
    modificationData: UpdateBlogDto,
  ): Promise<Blog | any | null> {
    const blog$ = await this._blogModel
      .findOne({ _id: blogId, creator: userId })
      .exec();

    if (!blog$) {
      throw new NotFoundException('Blog Does Not Exist!');
    }

    const transaction$ = await this._transactionService.createLog(
      blogId,
      userId,
      LogType.UPDATE,
    );
    const updatedBlog$ = await blog$.update(modificationData).exec();

    if (!updatedBlog$) {
      throw new InternalServerErrorException(
        'Blog Cannot Be Updated Due To An Unknown Error!',
      );
    }
    if (!transaction$) {
      throw new InternalServerErrorException(
        'Transaction Cannot Be Created Due To An Unknown Error!',
      );
    }

    return {
      status: 200,
      message: 'Blog Updated Successfully!',
    };
  }

  public async deleteBlog(
    blogId: string,
    userId: string,
  ): Promise<Blog | any | null> {
    const blog$ = await this._blogModel.findById(blogId);

    if (!blog$) {
      throw new NotFoundException('Blog Does Not Exist!');
    }

    const transaction$ = await this._transactionService.createLog(
      blogId,
      userId,
      LogType.DELETE,
    );
    const deletedBlog$ = await blog$.delete();

    if (!deletedBlog$) {
      throw new InternalServerErrorException(
        'Blog Cannot Be Deleted Due To An Unknown Error!',
      );
    }
    if (!transaction$) {
      throw new InternalServerErrorException(
        'Transaction Cannot Be Created Due To An Unknown Error!',
      );
    }

    return {
      status: 200,
      message: 'Blog Deleted Successfully!',
    };
  }
}
