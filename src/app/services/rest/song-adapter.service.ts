import {Injectable} from '@angular/core';
import {SongGetResponse, SongResponseData, SongSaveUpdateRequest, SongWithAlbumAndArtist} from '../../dto/song';
import {BasicHttpResponse} from '../../dto/base-http-response';
import {from, Observable} from 'rxjs';
import {GenericAdapter} from './generic-adapter';
import {filter, map, mergeMap, take, toArray} from 'rxjs/operators';
import {AlbumAdapterService} from './album-adapter.service';
import {ArtistAdapterService} from './artist-adapter.service';

@Injectable({
  providedIn: 'root'
})
export class SongAdapterService extends GenericAdapter<SongGetResponse, SongSaveUpdateRequest, BasicHttpResponse> {

  constructor(private albumAdapterService: AlbumAdapterService, private artistAdapterService: ArtistAdapterService) {
    super();
  }

  public getSong(surrogateKey: string, doRefresh: boolean): Observable<SongGetResponse> {
    return super.getObjectBySurrogateKey(this.GET_SONG_URL, surrogateKey, doRefresh);
  }

  public saveSong(payload: SongSaveUpdateRequest, image: Blob = null): Observable<BasicHttpResponse> {
    return super.saveObject(this.SAVE_SONG_URL, payload, image);
  }

  public songListToSongWithAlbumAndArtist(songList: SongResponseData[]): Observable<SongWithAlbumAndArtist[]> {
    return from(songList).pipe(
      map(song => {
        const songWithAlbumArtist: SongWithAlbumAndArtist = {} as SongWithAlbumAndArtist;
        songWithAlbumArtist.song = song;
        return songWithAlbumArtist;
      }),
      mergeMap(songWithAlbumArtistIncludedSong => this.albumAdapterService.getAlbum(songWithAlbumArtistIncludedSong.song.albumSurrogateKey, false)
        .pipe(filter(album => album !== null), take(1),
          map(album => {
            songWithAlbumArtistIncludedSong.album = album.data;
            return songWithAlbumArtistIncludedSong;
          }),
          mergeMap(songWithAlbumArtistIncludedSongAndAlbum => this.artistAdapterService.getArtist(songWithAlbumArtistIncludedSongAndAlbum.album.artistSurrogateKey, false)
            .pipe(filter(artist => artist !== null), take(1),
              map(artist => {
                songWithAlbumArtistIncludedSongAndAlbum.artist = artist.data;
                return songWithAlbumArtistIncludedSongAndAlbum;
              }))))), toArray());
  }
}
