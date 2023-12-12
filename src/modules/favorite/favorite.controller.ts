import { Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { FavoriteService } from './favorite.service';

@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoritesService: FavoriteService) {}

  @Get()
  findAllFavs() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  addFavoriteTrack(@Param('id') id: string) {
    return this.favoritesService.favTrack(id);
  }

  @Delete('track/:id')
  deleteFavoriteTrack(@Param('id') id: string) {
    return this.favoritesService.unfavTrack(id);
  }

  @Post('album/:id')
  addFavoriteAlbum(@Param('id') id: string) {
    return this.favoritesService.favAlbum(id);
  }

  @Delete('album/:id')
  deleteFavoriteAlbum(@Param('id') id: string) {
    return this.favoritesService.unfavAlbum(id);
  }

  @Post('artist/:id')
  addFavoriteArtist(@Param('id') id: string) {
    return this.favoritesService.favArtist(id);
  }

  @Delete('artist/:id')
  deleteFavoriteArtist(@Param('id') id: string) {
    return this.favoritesService.unfavArtist(id);
  }
}
