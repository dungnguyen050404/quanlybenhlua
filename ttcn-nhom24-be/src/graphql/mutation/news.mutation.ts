import { gql } from 'graphql-request';

export const createNews = gql`
  mutation MyMutation($object: news_insert_input!) {
    insert_news_one(object: $object) {
      id
      content
      title
      type
      created_at
      updated_at
      deleted_at
    }
  }
`;

export const updateNews = gql`
  mutation MyMutation($_set: news_set_input!, $id: Int!) {
    update_news(where: { deleted_at: { _is_null: true }, id: { _eq: $id } }, _set: $_set) {
      affected_rows
      returning {
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
`;

export const createNewDiseases = gql`
  mutation MyMutation($objects: [news_diseases_insert_input!]!) {
    insert_news_diseases(objects: $objects, on_conflict: { constraint: unique_news_disease }) {
      affected_rows
      returning {
        disease_id
        news_id
        created_at
        updated_at
      }
    }
  }
`;

export const deleteByNewsAndDiseaseIds = gql`
  mutation DeleteByNewsAndDiseaseIds($where: news_diseases_bool_exp!) {
    delete_news_diseases(where: $where) {
      affected_rows
    }
  }
`;
