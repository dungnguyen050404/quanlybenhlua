import { Injectable, NotFoundException } from '@nestjs/common';
import { GraphqlService } from 'graphql/graphql.service';
import * as argon from 'argon2';
import { ChangePasswordUserDto, CreateUserDto, QueryUserDto, StatusUserDto, UpdateUserDto } from './dto';
import { getUsersPage, getUsersWhere, getUsersWhereWithPassword } from 'graphql/query';
import { createUserMutation, updateUserMutation } from 'graphql/mutation';
import { STATUS_ACTIVE, USER_TYPE } from 'utils/enum';

@Injectable()
export class UsersService {
  constructor(private readonly graphqlService: GraphqlService) {}

  async create(createUserDto: CreateUserDto) {
    const passHash = await argon.hash(createUserDto.password);

    const result: any = await this.graphqlService.query(createUserMutation, {
      object: { ...createUserDto, password: passHash },
    });

    return result.insert_users_one;
  }

  async isEmailUnique(email: string, id?: number) {
    const result: any = await this.graphqlService.query(getUsersWhereWithPassword, {
      where: { deleted_at: { _is_null: true }, email: { _eq: email }, ...(id && { id: { _neq: id } }) },
    });

    return result.users[0];
  }

  async checkStatus(id: number) {
    const result: any = await this.graphqlService.query(getUsersWhereWithPassword, {
      where: { deleted_at: { _is_null: true }, id: { _eq: id }, status: { _eq: STATUS_ACTIVE.ACTIVE } },
    });

    return result.users[0];
  }

  async isPhoneUnique(phone: string, id?: number) {
    const result: any = await this.graphqlService.query(getUsersWhereWithPassword, {
      where: { deleted_at: { _is_null: true }, phone: { _eq: phone }, ...(id && { id: { _neq: id } }) },
    });

    return result.users[0];
  }

  async findById(id: number) {
    const result: any = await this.graphqlService.query(getUsersWhere, {
      where: {
        deleted_at: { _is_null: true },
        id: { _eq: id },
        type: { _in: [USER_TYPE.MANAGER, USER_TYPE.USER] },
      },
    });

    if (!result.users[0]) {
      throw new NotFoundException('Người dùng không tồn tại hoặc đã bị xóa.');
    }

    return result.users[0];
  }

  async findAll(query: QueryUserDto) {
    const { q, per_page, page, sort_field, sort_order } = query;
    const offset = (page - 1) * per_page;

    // Điều kiện where
    const where: any = {
      deleted_at: { _is_null: true },
      type: { _in: [USER_TYPE.MANAGER, USER_TYPE.USER] },
      ...(q && {
        _or: [
          { name: { _ilike: `%${q}%` } },
          { email: { _ilike: `%${q}%` } },
          { phone: { _ilike: `%${q}%` } },
        ],
      }),
    };

    const order_by: any = {
      created_at: 'desc',
      ...(sort_field && sort_order ? { [sort_field]: sort_order } : {}),
    };

    const result: any = await this.graphqlService.query(getUsersPage, {
      where,
      limit: per_page,
      offset,
      order_by,
    });

    return {
      page,
      per_page,
      total: result.users_aggregate.aggregate.count,
      users: result.users,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const result: any = await this.graphqlService.query(updateUserMutation, {
      where: {
        deleted_at: { _is_null: true },
        id: { _eq: id },
        type: { _in: [USER_TYPE.MANAGER, USER_TYPE.USER] },
      },
      _set: updateUserDto,
    });
    const updatedUser = result.update_users.returning[0];

    if (!updatedUser) {
      throw new NotFoundException('Người dùng không tồn tại hoặc đã bị xóa.');
    }
    return updatedUser;
  }

  async remove(id: number) {
    const result: any = await this.graphqlService.query(updateUserMutation, {
      where: {
        deleted_at: { _is_null: true },
        id: { _eq: id },
        type: { _in: [USER_TYPE.MANAGER, USER_TYPE.USER] },
      },
      _set: { deleted_at: 'now' },
    });
    const updatedUser = result.update_users.returning[0];

    if (!updatedUser) {
      throw new NotFoundException('Người dùng không tồn tại hoặc đã bị xóa.');
    }
    return updatedUser;
  }

  async updateStatus(id: number, statusUserDto: StatusUserDto) {
    const result: any = await this.graphqlService.query(updateUserMutation, {
      where: {
        deleted_at: { _is_null: true },
        id: { _eq: id },
        type: { _in: [USER_TYPE.MANAGER, USER_TYPE.USER] },
      },
      _set: { status: statusUserDto.status },
    });
    const updatedUser = result.update_users.returning[0];

    if (!updatedUser) {
      throw new NotFoundException('Người dùng không tồn tại hoặc đã bị xóa.');
    }
    return updatedUser;
  }

  async updatePassword(id: number, changePasswordUserDto: ChangePasswordUserDto) {
    const passHash = await argon.hash(changePasswordUserDto.new_password);
    const result: any = await this.graphqlService.query(updateUserMutation, {
      where: {
        deleted_at: { _is_null: true },
        id: { _eq: id },
        type: { _in: [USER_TYPE.MANAGER, USER_TYPE.USER] },
      },
      _set: { password: passHash },
    });

    const updatedUser = result.update_users.returning[0];

    if (!updatedUser) {
      throw new NotFoundException('Người dùng không tồn tại hoặc đã bị xóa.');
    }
    return updatedUser;
  }
}
