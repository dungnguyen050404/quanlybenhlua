import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'common/decorators';
import { QueryNewsDto } from './dto/query-news.dto';
import { ExtractIdInterceptor } from 'common/interceptors';

@ApiBearerAuth()
@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  async create(@Body() createDiseaseDto: CreateNewsDto) {
    delete createDiseaseDto.id;
    return await this.newsService.create(createDiseaseDto);
  }

  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Số trang bắt đầu cho phân trang (bắt đầu từ 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'per_page',
    required: false,
    type: Number,
    description: 'Số lượng bản ghi trên mỗi trang',
    example: 20,
  })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Từ khóa tìm kiếm theo tên hoặc khái niệm',
  })
  @ApiQuery({
    name: 'sort_field',
    required: false,
    type: String,
    description: 'Trường để sắp xếp',
    example: 'name',
  })
  @ApiQuery({
    name: 'sort_order',
    required: false,
    type: String,
    description: 'Thứ tự sắp xếp (asc hoặc desc)',
    example: 'desc',
  })
  @Public()
  @Get()
  async findAll(@Query() query: QueryNewsDto) {
    return await this.newsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.newsService.findOne(id);
  }

  @UseInterceptors(ExtractIdInterceptor.for('id'))
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateNewsDto: UpdateNewsDto) {
    delete updateNewsDto.id;
    return await this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.newsService.remove(+id);
  }
}
