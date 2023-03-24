import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { AuthenticatedGuard } from 'src/auth/guards';
import { UseRole } from 'src/user/decorator';
import { Role } from 'src/user/enum';
import { BlogService } from './blog.service';
import { BaseBlogDto } from './dto/base-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly _blogService: BlogService) {}

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.USER)
  @Post()
  public async create(
    @GetUser('userId') userId: string,
    @Body() creationData: any,
  ): Promise<any> {
    const blogCreationData: BaseBlogDto = {
      title: creationData.title,
      description: creationData.description,
      creator: userId,
    };
    return await this._blogService.createBlog(blogCreationData);
  }

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.USER)
  @Get()
  public async accessAllUserBlogs(
    @GetUser('userId') userId: string,
  ): Promise<any> {
    return await this._blogService.getBlogsByUser(userId);
  }

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.USER)
  @Patch(':blogId')
  public async update(
    @Param('blogId') blogId: string,
    @GetUser('userId') userId: string,
    @Body() modifiedBlogData: UpdateBlogDto,
  ) {
    return this._blogService.updateBlog(blogId, userId, modifiedBlogData);
  }

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.USER)
  @Delete(':blogId')
  public async deleteUserBlog(
    @Param('blogId') blogId: string,
    @GetUser('userId') userId: string,
  ): Promise<any> {
    return await this._blogService.deleteBlog(blogId, userId);
  }
}
