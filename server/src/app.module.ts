import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ProductModule } from './product/product.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CollectionModule } from './collection/collection.module'
import { ApiModule } from './api/api.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { BlogModule } from './blog/blog.module'
import { ArticleModule } from './article/article.module'
import { ReceiverModule } from './receiver/receiver.module'
import { AuthcodeModule } from './authcode/authcode.module'
import { UploadModule } from './upload/upload.module'
import { ColumnModule } from './column/column.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { databaseConfig, jwtConfig } from './config'

@Module({
  imports: [
    ProductModule,
    UserModule,
    ConfigModule.forRoot({
      load: [databaseConfig, jwtConfig],
      cache: true,
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // 导入 ConfigModule，以便在 TypeOrmModule 中使用 ConfigService
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // FIXME 警告：设置 synchronize: true 不能被用于生产环境，否则您可能会丢失生产环境数据
        return {
          type: 'mongodb', // 数据库类型
          username: configService.get('database.username'), // 账号
          password: configService.get('database.password'), // 密码
          host: configService.get('database.host'), // host
          port: configService.get('database.port'), //
          database: configService.get('database.database'), // 库名
          // entities: [__dirname + '/**/*.entity{.ts,.js}'], //实体文件
          synchronize: configService.get('database.synchronize'), // synchronize字段代表是否自动将实体类同步到数据库
          retryDelay: configService.get('database.retryDelay'), // 重试连接数据库间隔
          retryAttempts: configService.get('database.retryAttempts'), // 重试连接数据库的次数
          autoLoadEntities: configService.get('database.autoLoadEntities') // 如果为true,将自动加载实体 forFeature() 方法注册的每个实体都将自动添加到配置对象的实体数组中
        }
      }
    }),
    CollectionModule,
    ApiModule,
    AuthModule,
    BlogModule,
    ArticleModule,
    ReceiverModule,
    AuthcodeModule,
    UploadModule,
    ColumnModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
