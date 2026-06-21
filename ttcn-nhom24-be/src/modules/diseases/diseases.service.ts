import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';
import { GraphqlService } from 'graphql/graphql.service';
import {
  getDiseasesPage,
  getDiseasesWhere,
  getRecentSearchLog,
  getSearchLogWhere,
  getTotalSearchLog,
  getTotalView,
  getViewWhere,
} from 'graphql/query';
import { createDiseases, createSearchLogDisease, createViewDisease, updateDiseases } from 'graphql/mutation';
import { QueryDiseaseDto } from './dto/query-disease.dto';
import { SearchLogDiseaseDto, StatisticsDto } from './dto/search-log-disease.dto';
import { ViewDiseaseDto } from './dto/view-disease.dto';

@Injectable()
export class DiseasesService {
  constructor(private readonly graphqlService: GraphqlService) {}

  async create(createDiseaseDto: CreateDiseaseDto) {
    const create: any = await this.graphqlService.query(createDiseases, {
      object: createDiseaseDto,
    });

    return create.insert_diseases_one;
  }

  async findAll(query: QueryDiseaseDto) {
    const { q, per_page, page, sort_field, sort_order } = query;
    const offset = (page - 1) * per_page;

    // Điều kiện where
    const where: any = {
      deleted_at: { _is_null: true },
      ...(q && {
        _or: [{ name: { _ilike: `%${q}%` } }, { definition: { _ilike: `%${q}%` } }],
      }),
    };

    const order_by: any = {
      created_at: 'desc',
      ...(sort_field && sort_order ? { [sort_field]: sort_order } : {}),
    };

    const result: any = await this.graphqlService.query(getDiseasesPage, {
      where,
      limit: per_page,
      offset,
      order_by,
    });

    return {
      page,
      per_page,
      total: result.diseases_aggregate.aggregate.count,
      diseases: result.diseases,
    };
  }

  async findOne(id: number) {
    const result: any = await this.graphqlService.query(getDiseasesWhere, {
      where: { deleted_at: { _is_null: true }, id: { _eq: id } },
    });

    return result?.diseases?.[0];
  }

  async update(id: number, updateDiseaseDto: UpdateDiseaseDto) {
    const update: any = await this.graphqlService.query(updateDiseases, {
      id,
      _set: updateDiseaseDto,
    });
    const disease = update.update_diseases.returning[0];

    if (!disease) {
      throw new NotFoundException('Bệnh lúa đã bị xóa hoặc không tồn tại.');
    }

    return disease;
  }

  async remove(id: number) {
    const update: any = await this.graphqlService.query(updateDiseases, {
      id,
      _set: { deleted_at: 'now' },
    });
    const disease = update.update_diseases.returning[0];

    if (!disease) {
      throw new NotFoundException('Bệnh lúa đã bị xóa hoặc không tồn tại.');
    }

    return disease;
  }

  async isNameDiseaseUnique(name: string, id?: number) {
    const variables = {
      deleted_at: { _is_null: true },
      name: { _eq: name },
      ...(id && { id: { _neq: id } }),
    };

    const result: any = await this.graphqlService.query(getDiseasesWhere, {
      where: variables,
    });

    return result?.diseases?.[0];
  }

  async searchLog(searchLogDiseaseDto: SearchLogDiseaseDto) {
    const create: any = await this.graphqlService.query(createSearchLogDisease, {
      object: searchLogDiseaseDto,
    });

    return create.insert_search_logs_one;
  }

  async view(viewDiseaseDto: ViewDiseaseDto, ip: string) {
    const create: any = await this.graphqlService.query(createViewDisease, {
      object: {
        disease_id: viewDiseaseDto.disease_id,
        user_ip: ip,
      },
    });

    return create.insert_disease_views_one;
  }

  async searchStatistics(statisticsDto: StatisticsDto) {
    const where: any = { deleted_at: { _is_null: true } };
    if (statisticsDto.start_date || statisticsDto.end_date) {
      where.created_at = {};
      if (statisticsDto.start_date) {
        where.created_at._gte = new Date(statisticsDto.start_date).toISOString();
      }
      if (statisticsDto.end_date) {
        // end_date lấy đến 23:59:59.999 để bao gồm toàn bộ ngày
        const endDate = new Date(statisticsDto.end_date);
        endDate.setUTCHours(23, 59, 59, 999);
        where.created_at._lte = endDate.toISOString();
      }
    }

    const result: any = await this.graphqlService.query(getSearchLogWhere, {
      where,
    });

    return result?.search_logs;
  }

  async viewStatistics(statisticsDto: StatisticsDto) {
    const where: any = { deleted_at: { _is_null: true } };
    if (statisticsDto.start_date || statisticsDto.end_date) {
      where.created_at = {};
      if (statisticsDto.start_date) {
        where.created_at._gte = new Date(statisticsDto.start_date).toISOString();
      }
      if (statisticsDto.end_date) {
        // end_date lấy đến 23:59:59.999 để bao gồm toàn bộ ngày
        const endDate = new Date(statisticsDto.end_date);
        endDate.setUTCHours(23, 59, 59, 999);
        where.created_at._lte = endDate.toISOString();
      }
    }

    const result: any = await this.graphqlService.query(getViewWhere, {
      where,
    });

    return result?.disease_views;
  }

  async statistics() {
    const searchLog: any = await this.graphqlService.query(getTotalSearchLog);
    const view: any = await this.graphqlService.query(getTotalView);

    return {
      total_search_logs: searchLog?.search_logs_aggregate?.aggregate?.count,
      total_view_diseases: view?.disease_views_aggregate?.aggregate?.count,
    };
  }

  async recentSearchLog() {
    const result: any = await this.graphqlService.query(getRecentSearchLog);

    return result?.search_logs;
  }
}
