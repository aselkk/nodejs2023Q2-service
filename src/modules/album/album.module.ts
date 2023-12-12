import { Album } from './album.entity';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Album])],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
