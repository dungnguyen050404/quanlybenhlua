import { Module } from '@nestjs/common';
import { DiseasesService } from './diseases.service';
import { DiseasesController } from './diseases.controller';
import { CheckNameDisease } from './validators/check-name-disease.validator';

@Module({
  controllers: [DiseasesController],
  providers: [DiseasesService, CheckNameDisease],
})
export class DiseasesModule {}
