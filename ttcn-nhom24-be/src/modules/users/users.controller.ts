import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChangePasswordUserDto, CreateUserDto, QueryUserDto, StatusUserDto, UpdateUserDto } from './dto';
import { ExtractIdInterceptor } from 'common/interceptors';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
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
  @Get()
  async findAll(@Query() query: QueryUserDto) {
    return await this.usersService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.usersService.findById(id);
  }

  @UseInterceptors(ExtractIdInterceptor.for('id'))
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }

  @Patch('status/:id')
  async updateStatus(@Param('id') id: number, @Body() statusUserDto: StatusUserDto) {
    return await this.usersService.updateStatus(id, statusUserDto);
  }

  @Patch('change-password/:id')
  async updatePassword(@Param('id') id: number, @Body() passwordUserDto: ChangePasswordUserDto) {
    return await this.usersService.updatePassword(id, passwordUserDto);
  }
}
