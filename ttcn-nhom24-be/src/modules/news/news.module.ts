import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { CheckTitleNew } from './validators/check-title-new.validator';

@Module({
  controllers: [NewsController],
  providers: [NewsService, CheckTitleNew],
})
export class NewsModule {}
