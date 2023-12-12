import { Album } from '../album/album.entity';
import { Artist } from '../artist/artist.entity';
import { Favorite } from './favorite.entity';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { Module } from '@nestjs/common';
import { Track } from '../track/track.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Artist, Album, Track])],
  controllers: [FavoriteController],
  providers: [FavoriteService],
})
export class FavoriteModule {}
