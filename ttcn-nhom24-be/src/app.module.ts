import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphqlService } from './graphql/graphql.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard, JwtStrategy } from './common/guards';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { SocketModule } from './modules/socket/socket.module';
import { APP_GUARD } from '@nestjs/core';
import { DiseasesModule } from './modules/diseases/diseases.module';
import { GraphqlModule } from 'graphql/graphql.module';
import { NewsModule } from './modules/news/news.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      password: process.env.REDIS_PASSWORD,
    }),
    GraphqlModule,
    AuthModule,
    UsersModule,
    SocketModule,
    DiseasesModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware).forRoutes('*');
//   }
// }
