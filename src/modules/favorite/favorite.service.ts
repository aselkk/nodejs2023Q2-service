import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Album } from '../album/album.entity';
import { Artist } from '../artist/artist.entity';
import { Track } from '../track/track.entity';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite) private favsRepository: Repository<Favorite>,
    @InjectRepository(Artist) private artistsRepository: Repository<Artist>,
    @InjectRepository(Album) private albumsRepository: Repository<Album>,
    @InjectRepository(Track) private tracksRepository: Repository<Track>,
  ) {}

  async findAll(): Promise<{
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
  }> {
    const favs = await this.favsRepository.find();

    const artistIds = [];
    const albumsIds = [];
    const tracksIds = [];

    favs.forEach((fav) => {
      if (fav.type === 'artist') artistIds.push(fav.to);
      if (fav.type === 'album') albumsIds.push(fav.to);
      if (fav.type === 'track') tracksIds.push(fav.to);
    });

    const artists = await this.artistsRepository.find({
      where: { id: In(artistIds) },
    });
    const albums = await this.albumsRepository.find({
      where: { id: In(albumsIds) },
    });
    const tracks = await this.tracksRepository.find({
      where: { id: In(tracksIds) },
    });

    return { artists, albums, tracks };
  }

  favTrack(id: string) {
    return this.favsRepository
      .findOneBy({ type: 'track', to: id })
      .then((fav) => {
        if (!fav) {
          const fav = new Favorite();
          fav.type = 'track';
          fav.to = id;
          this.favsRepository.save(fav);
        }
      });
  }

  unfavTrack(id: string) {
    return this.favsRepository
      .findOneBy({ type: 'track', to: id })
      .then((fav) => {
        if (fav) {
          this.favsRepository.delete(fav.id);
        }
      });
  }

  favAlbum(id: string) {
    return this.favsRepository
      .findOneBy({ type: 'album', to: id })
      .then((fav) => {
        if (!fav) {
          const fav = new Favorite();
          fav.type = 'album';
          fav.to = id;
          this.favsRepository.save(fav);
        }
      });
  }

  unfavAlbum(id: string) {
    return this.favsRepository
      .findOneBy({ type: 'album', to: id })
      .then((fav) => {
        if (fav) {
          this.favsRepository.delete(fav.id);
        }
      });
  }

  favArtist(id: string) {
    return this.favsRepository
      .findOneBy({ type: 'artist', to: id })
      .then((fav) => {
        if (!fav) {
          const fav = new Favorite();
          fav.type = 'artist';
          fav.to = id;
          this.favsRepository.save(fav);
        }
      });
  }

  unfavArtist(id: string) {
    return this.favsRepository
      .findOneBy({ type: 'artist', to: id })
      .then((fav) => {
        if (fav) {
          this.favsRepository.delete(fav.id);
        }
      });
  }
}
