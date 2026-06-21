import { gql } from 'graphql-request';

export const getNewsWhere = gql`
  query MyQuery($where: news_bool_exp!) {
    news(where: $where) {
      id
      content
      title
      type
      created_at
      updated_at
      deleted_at
      news_diseases {
        news_id
        disease_id
        disease {
          id
          name
        }
      }
    }
  }
`;

export const getNewsPage = gql`
  query MyQuery($where: news_bool_exp!, $limit: Int!, $offset: Int!, $order_by: [news_order_by!]!) {
    news(where: $where, limit: $limit, offset: $offset, order_by: $order_by) {
      id
      content
      title
      type
      created_at
      updated_at
      deleted_at
    }
    news_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const getNewDiseaseByWhere = gql`
  query MyQuery($where: news_diseases_bool_exp!) {
    news_diseases(where: $where) {
      disease_id
      news_id
      created_at
      updated_at
    }
  }
`;
