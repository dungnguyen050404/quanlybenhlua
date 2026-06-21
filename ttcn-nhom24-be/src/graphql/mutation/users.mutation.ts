import { gql } from 'graphql-request';

export const createUserMutation = gql`
  mutation MyMutation($object: users_insert_input!) {
    insert_users_one(object: $object) {
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
  }
`;

export const updateUserMutation = gql`
  mutation MyMutation($_set: users_set_input!, $where: users_bool_exp!) {
    update_users(where: $where, _set: $_set) {
      returning {
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
    }
  }
`;
