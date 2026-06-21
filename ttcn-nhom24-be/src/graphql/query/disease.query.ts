import { gql } from 'graphql-request';

export const getDiseasesWhere = gql`
  query MyQuery($where: diseases_bool_exp!) {
    diseases(where: $where) {
      id
      name
      definition
      content
      created_at
      deleted_at
      updated_at
      news_diseases {
        disease_id
        news_id
        news {
          id
          content
          title
          type
          created_at
          updated_at
          deleted_at
        }
      }
    }
  }
`;

export const getDiseasesPage = gql`
  query MyQuery($where: diseases_bool_exp!, $limit: Int!, $offset: Int!, $order_by: [diseases_order_by!]!) {
    diseases(where: $where, limit: $limit, offset: $offset, order_by: $order_by) {
      id
      name
      definition
      content
      created_at
      deleted_at
      updated_at
    }
    diseases_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const getSearchLogWhere = gql`
  query MyQuery($where: search_logs_bool_exp!) {
    search_logs(where: $where, order_by: { created_at: asc }) {
      id
      keyword
      disease_id
      updated_at
      created_at
      deleted_at
      disease {
        id
        name
        created_at
        deleted_at
        updated_at
      }
    }
  }
`;

export const getViewWhere = gql`
  query MyQuery($where: disease_views_bool_exp!) {
    disease_views(where: $where, order_by: { created_at: asc }) {
      id
      user_ip
      disease_id
      updated_at
      created_at
      deleted_at
      disease {
        id
        name
        created_at
        deleted_at
        updated_at
      }
    }
  }
`;

export const getTotalSearchLog = gql`
  query MyQuery {
    search_logs_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const getTotalView = gql`
  query MyQuery {
    disease_views_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const getRecentSearchLog = gql`
  query MyQuery {
    search_logs(limit: 5, where: { deleted_at: { _is_null: true } }, order_by: { created_at: desc }) {
      id
      keyword
      disease_id
      created_at
      updated_at
      deleted_at
    }
  }
`;
