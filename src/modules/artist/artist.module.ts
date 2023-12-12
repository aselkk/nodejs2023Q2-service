import { Artist } from './artist.entity';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Artist])],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
