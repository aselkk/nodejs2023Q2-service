import { Album } from './modules/album/album.entity';
import { AppController } from './app.controller';
import { Artist } from './modules/artist/artist.entity';
import { ConfigModule } from '@nestjs/config';
import { Favorite } from './modules/favorite/favorite.entity';
import { Module } from '@nestjs/common';
import { Track } from './modules/track/track.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Album, Artist, Track, Favorite],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
