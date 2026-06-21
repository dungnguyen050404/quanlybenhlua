import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  Query,
  Req,
} from '@nestjs/common';
import { DiseasesService } from './diseases.service';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ExtractIdInterceptor } from 'common/interceptors';
import { QueryDiseaseDto } from './dto/query-disease.dto';
import { Public } from 'common/decorators';
import { SearchLogDiseaseDto, StatisticsDto } from './dto/search-log-disease.dto';
import { ViewDiseaseDto } from './dto/view-disease.dto';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('Diseases')
@Controller('diseases')
export class DiseasesController {
  constructor(private readonly diseasesService: DiseasesService) {}

  @Post()
  async create(@Body() createDiseaseDto: CreateDiseaseDto) {
    delete createDiseaseDto.id;
    return await this.diseasesService.create(createDiseaseDto);
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
  async findAll(@Query() query: QueryDiseaseDto) {
    return await this.diseasesService.findAll(query);
  }

  @Get('statistics')
  async statistics() {
    return await this.diseasesService.statistics();
  }

  @Get('recent-search-log')
  async recentSearchLog() {
    return await this.diseasesService.recentSearchLog();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.diseasesService.findOne(+id);
  }

  @UseInterceptors(ExtractIdInterceptor.for('id'))
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDiseaseDto: UpdateDiseaseDto) {
    delete updateDiseaseDto.id;
    return await this.diseasesService.update(+id, updateDiseaseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.diseasesService.remove(+id);
  }

  @Public()
  @Post('search-log')
  async searchLog(@Body() body: SearchLogDiseaseDto) {
    return await this.diseasesService.searchLog(body);
  }

  @Public()
  @Post('view')
  async view(@Body() body: ViewDiseaseDto, @Req() req: Request) {
    // Nếu server chạy sau reverse-proxy, thường có header 'x-forwarded-for'
    const xff = req.headers['x-forwarded-for'] as string | undefined;
    const ipFromHeader = xff ? xff.split(',')[0].trim() : undefined;

    // Fallback: express request.ip hoặc socket remoteAddress
    const ip = ipFromHeader || req.ip || (req.socket && req.socket.remoteAddress);

    return await this.diseasesService.view(body, ip);
  }

  @Post('search-statistics')
  async searchStatistics(@Body() body: StatisticsDto) {
    return await this.diseasesService.searchStatistics(body);
  }

  @Post('view-statistics')
  async viewStatistics(@Body() body: StatisticsDto) {
    return await this.diseasesService.viewStatistics(body);
  }
}
