import { gql } from 'graphql-request';

export const createDiseases = gql`
  mutation MyMutation($object: diseases_insert_input!) {
    insert_diseases_one(object: $object) {
      id
      name
      definition
      content
      created_at
      deleted_at
      updated_at
    }
  }
`;

export const updateDiseases = gql`
  mutation MyMutation($_set: diseases_set_input!, $id: Int!) {
    update_diseases(where: { deleted_at: { _is_null: true }, id: { _eq: $id } }, _set: $_set) {
      affected_rows
      returning {
        id
        name
        definition
        content
        created_at
        deleted_at
        updated_at
      }
    }
  }
`;

export const createSearchLogDisease = gql`
  mutation MyMutation($object: search_logs_insert_input!) {
    insert_search_logs_one(object: $object) {
      id
      disease_id
      keyword
      updated_at
      created_at
      deleted_at
    }
  }
`;

export const createViewDisease = gql`
  mutation MyMutation($object: disease_views_insert_input!) {
    insert_disease_views_one(object: $object) {
      id
      user_ip
      updated_at
      disease_id
      deleted_at
      created_at
    }
  }
`;
