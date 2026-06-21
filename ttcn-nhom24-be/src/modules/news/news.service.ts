import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { GraphqlService } from 'graphql/graphql.service';
import { createNewDiseases, createNews, deleteByNewsAndDiseaseIds, updateNews } from 'graphql/mutation';
import { getDiseasesWhere, getNewDiseaseByWhere, getNewsPage, getNewsWhere } from 'graphql/query';
import { QueryNewsDto } from './dto/query-news.dto';
import * as _ from 'lodash';

@Injectable()
export class NewsService {
  constructor(private readonly graphqlService: GraphqlService) {}

  async create(createNewDto: CreateNewsDto) {
    const { disease_ids, ...data } = createNewDto;
    const create: any = await this.graphqlService.query(createNews, {
      object: data,
    });

    if (!_.isEmpty(disease_ids)) {
      const result: any = await this.graphqlService.query(getDiseasesWhere, {
        where: {
          deleted_at: { _is_null: true },
          id: { _in: disease_ids },
        },
      });

      const validDiseaseIds = result.diseases.map((d) => d.id);

      const newDiseaseIds = validDiseaseIds.map((disease_id) => ({
        news_id: create.insert_news_one.id,
        disease_id,
      }));

      await this.graphqlService.query(createNewDiseases, {
        objects: newDiseaseIds,
      });
    }

    return create.insert_news_one;
  }

  async findAll(query: QueryNewsDto) {
    const { q, per_page, page, sort_field, sort_order, type } = query;
    const offset = (page - 1) * per_page;

    // Điều kiện where
    const where: any = {
      deleted_at: { _is_null: true },
      ...(q && {
        _or: [{ title: { _ilike: `%${q}%` } }],
      }),
      ...(type && { type: { _eq: type } }),
    };

    const order_by: any = {
      created_at: 'desc',
      ...(sort_field && sort_order ? { [sort_field]: sort_order } : {}),
    };

    const result: any = await this.graphqlService.query(getNewsPage, {
      where,
      limit: per_page,
      offset,
      order_by,
    });

    return {
      page,
      per_page,
      total: result.news_aggregate.aggregate.count,
      news: result.news,
    };
  }

  async findOne(id: number) {
    const result: any = await this.graphqlService.query(getNewsWhere, {
      where: { deleted_at: { _is_null: true }, id: { _eq: id } },
    });

    return result?.news?.[0];
  }

  async update(id: number, updateNewDto: UpdateNewsDto) {
    const { disease_ids, ...data } = updateNewDto;
    const update: any = await this.graphqlService.query(updateNews, {
      id,
      _set: data,
    });
    const news = update.update_news.returning[0];

    if (!news) {
      throw new NotFoundException('Tin tức đã bị xóa hoặc không tồn tại.');
    }

    const newDiseaseByNewIds: any = await this.graphqlService.query(getNewDiseaseByWhere, {
      where: { news_id: { _eq: news.id } },
    });

    const oldDiseaseIds = newDiseaseByNewIds.news_diseases.map((item) => item.disease_id);

    // Các phần tử giống nhau
    // const same = _.intersection(oldDiseaseIds, disease_ids);

    // Chỉ có trong disease_ids (cần thêm)
    const toAdd = _.difference(disease_ids, oldDiseaseIds);

    // Chỉ có trong oldDiseaseIds (cần xóa)
    const toRemove = _.difference(oldDiseaseIds, disease_ids);

    await this.graphqlService.query(deleteByNewsAndDiseaseIds, {
      where: { news_id: { _eq: news.id }, disease_id: { _in: toRemove } },
    });

    const result: any = await this.graphqlService.query(getDiseasesWhere, {
      where: {
        deleted_at: { _is_null: true },
        id: { _in: toAdd },
      },
    });

    const validDiseaseIds = result.diseases.map((d) => d.id);

    const newDiseaseIds = validDiseaseIds.map((disease_id) => ({
      news_id: news.id,
      disease_id,
    }));

    await this.graphqlService.query(createNewDiseases, {
      objects: newDiseaseIds,
    });

    return news;
  }

  async remove(id: number) {
    const update: any = await this.graphqlService.query(updateNews, {
      id,
      _set: { deleted_at: 'now' },
    });
    const news = update.update_news.returning[0];

    if (!news) {
      throw new NotFoundException('Tin tức đã bị xóa hoặc không tồn tại.');
    }

    await this.graphqlService.query(deleteByNewsAndDiseaseIds, {
      where: { news_id: { _eq: news.id } },
    });

    return news;
  }

  async isTitleNewUnique(title: string, id?: number) {
    const variables = {
      deleted_at: { _is_null: true },
      title: { _eq: title },
      ...(id && { id: { _neq: id } }),
    };

    const result: any = await this.graphqlService.query(getNewsWhere, {
      where: variables,
    });

    return result?.news?.[0];
  }
}
