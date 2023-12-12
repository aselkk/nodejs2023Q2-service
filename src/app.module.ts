import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingService, LogLevel } from './modules/logging/logging.service';
import { CustomExceptionFilter } from './modules/logging/custom-exception.filter';
import { Album } from './modules/album/album.entity';
import { AlbumModule } from './modules/album/album.module';
import { AppController } from './app.controller';
import { Artist } from './modules/artist/artist.entity';
import { ArtistModule } from './modules/artist/artist.module';
import { Favorite } from './modules/favorite/favorite.entity';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { Track } from './modules/track/track.entity';
import { TrackModule } from './modules/track/track.module';
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
    AlbumModule,
    ArtistModule,
    TrackModule,
    FavoriteModule,
  ],
  controllers: [AppController],
  providers: [
    LoggingService,
    {
      provide: 'LoggingService',
      useClass: LoggingService,
    },
    {
      provide: 'ExceptionFilter',
      useClass: CustomExceptionFilter,
    },
    {
      provide: 'LogLevel',
      useValue: process.env.LOG_LEVEL || LogLevel.INFO, // Set default log level
    },
  ],
})
export class AppModule {}
