import { gql } from 'graphql-request';

export const getUsersWhereWithPassword = gql`
  query MyQuery($where: users_bool_exp!) {
    users(where: $where) {
      id
      name
      email
      password
      phone
      status
      type
      created_at
      updated_at
      deleted_at
    }
  }
`;

export const getUsersWhere = gql`
  query MyQuery($where: users_bool_exp!) {
    users(where: $where) {
      id
      name
      email
      phone
      status
      type
      created_at
      updated_at
      deleted_at
    }
  }
`;

export const getUsersPage = gql`
  query MyQuery($where: users_bool_exp!, $limit: Int!, $offset: Int!, $order_by: [users_order_by!]!) {
    users(where: $where, limit: $limit, offset: $offset, order_by: $order_by) {
      id
      email
      name
      phone
      status
      type
      created_at
      deleted_at
      updated_at
    }
    users_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;
