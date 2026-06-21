import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLClient } from 'graphql-request';

@Injectable()
export class GraphqlService {
  private readonly graphQLClient: GraphQLClient;

  constructor(private readonly configService: ConfigService) {
    this.graphQLClient = new GraphQLClient(this.configService.get('GRAPHQL_API'), {
      headers: {
        'x-hasura-admin-secret': this.configService.get('GRAPHQL_SECRET_KEY'),
      },
    });
  }

  public async query(query: string, variables?: any) {
    return this.graphQLClient.request(query, variables);
  }
}
