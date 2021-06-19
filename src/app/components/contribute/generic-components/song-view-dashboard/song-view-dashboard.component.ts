import {Component, OnInit} from '@angular/core';
import {SongSaveResponse} from '../../../../dto/song';
import moment from 'moment';
import {GenreAdapterService} from '../../../../services/rest/genre-adapter.service';
import {take} from 'rxjs/operators';
import {AlbumAdapterService} from '../../../../services/rest/album-adapter.service';
import {AlbumGetResponse} from '../../../../dto/album';
import {ArtistAdapterService} from '../../../../services/rest/artist-adapter.service';
import {UtilService} from '../../../../services/util.service';

@Component({
  selector: 'app-song-view-dashboard',
  templateUrl: './song-view-dashboard.component.html',
  styleUrls: ['./song-view-dashboard.component.css']
})
export class SongViewDashboardComponent implements OnInit {

  private _genreNameListOfTheSong: string[] = [];
  private _album: AlbumGetResponse = null;
  private _artist: string;
  private _featuringArtistList: string[] = [];
  private _lyric: string;
  private _lyricWithoutChords: string;

  guitarChordToggle = false;

  displayPublishComponents = false;

  displayDiffComponent = false;

  public songData: SongSaveResponse = {
    timestamp: '2021-06-06T20:14:25.617',
    message: 'Song saved successfully.',
    errorCode: null,
    data: {
      surrogateKey: '66a83324-66ae-4366-8553-d8e8ed026f80',
      name: 'Helo $ ne & @$ WSong',
      albumSurrogateKey: '6ce3d08b-a3b6-4536-ab15-764798462438',
      guitarKey: 'D',
      beat: '3/4',
      languageCode: 'si',
      keywords: 'fds\nsinhala',
      lyrics: 'JAplfC0tMy0tMC0tLS0tMy0tMC0tLS0tMy0tMC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfAoKQnwtLS0tLS0tLTMtLS0tLS0tLTMtLS0tLS0tLTMtLS01LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXwKCkd8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18CgpEfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfAoKQXwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXwKCkV8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18CiQKCmBGYCBgQ2AgIGBHYCBgQW1gCgpgRmAgYENgICBgR2AgYEFtYAoKLS0tLS0KCmBGYCAgICAgICAgICBgQ2AKCiAgICBXaGVuIEkgd2FzIGEga2lkCgogICAgICAgICAgYEdgICAgICAgICAgICAgICAgYEFtYAoKSSB1c2VkIHRvIGJ1eSBhbmQgc2VsbCBncmF2aXR5CgpgRmAgICAgICAgICAgYENgCgogICAgSSBrbmV3IGhvdyB0byBmbHkKCiAgICAgICAgICAgIGBHYCAgICAgICAgICAgICAgIGBBbWAKCkFuZCBJIHdvdWxkIHRlYWNoIHlvdSBmb3IgYSBmZWUKCmBGYCAgICAgICAgICAgICAgIGBDYAoKICAgIEJyb2tlIGV2ZXJ5IHdpbmRvdwoKICAgICAgYEdgICAgICAgYEFtYAoKSW4gbXkgaG90ZWwgaGVhcnQKCmBGYCAgICAgICAgICAgICAgYENgCgogICAgV2hlbiBJIHdhcyBvbmx5IDUgeWVhcnMgb2xkCgogICAgYEdgICAgICAgICAgICBgQW1gCgpidXQgMTIgeWVhcnMgc2NhcnJlZAoKYEZgICAgICAgICAgICBgQ2AKCiAgICBBbmQgSSdkIGhlYXIgdGhlIHNhbWUgdm9pY2UKCmBHYCAgICAgICAgICBgQW1g',
      youTubeLink: 'http://youtube.com/fwaiofhawif(_R#H',
      spotifyLink: '',
      deezerLink: '',
      appleMusicLink: '',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/en/9/96/OneRepublic_-_Native.png',
      isExplicit: false,
      addedBy: {
        firstName: 'Samintha',
        lastName: 'Kaveesh',
        description: null,
        imgUrl: 'http://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Centered_square_number_25.svg/146px-Centered_square_number_25.svg.png',
        contactLink: null,
        seniorContributor: true,
        addedDate: null,
        lastModifiedDate: null
      },
      lastModifiedBy: {
        firstName: 'Samintha',
        lastName: 'Kaveesh',
        description: null,
        imgUrl: 'http://www.myimage.com/contributorimage',
        contactLink: null,
        seniorContributor: true,
        addedDate: null,
        lastModifiedDate: null
      },
      publishedBy: null,
      addedDate: new Date('2021-06-06T20:04:34.907'),
      lastModifiedDate: new Date('2021-06-06T20:14:24.592'),
      publishedDate: null,
      publishedState: false,
      songModifiesRequestsAvailable: false,
      artistSurrogateKeyList: [
        '0150129b-e45f-4c6c-8e9c-078d2ebcde32'
      ],
      genreIdList: [
        1,
        19,
        15
      ]
    }
  };

  constructor(private genreAdapterService: GenreAdapterService, private albumAdapterService: AlbumAdapterService, private artistAdapterService: ArtistAdapterService) {
    // only initialize this component after save song was called in previous component
    this.afterSaveSongInit();
  }

  ngOnInit() {
  }

  // only initialize this component after save song was called in previous component
  afterSaveSongInit() {
    this.genreAdapterService.getAllSelections();
    this.init();
  }

  private init(): void {
    this.initializeGenre();
    this.initializeAlbum();
    this.initializeLyricsView();
  }

  private initializeGenre(): void {
    this.genreAdapterService.allSelections.pipe(
      take(this.genreAdapterService.allSelections.getValue().length <= 0 ? 2 : 1)
    ).subscribe(value => {

      const genreIdList = this.songData.data.genreIdList.map(String);

      if (value.length > 0) {
        value.forEach(genreItem => {
          genreIdList.forEach(genreIdItem => {
            if (genreItem.substring(genreItem.lastIndexOf('$') + 1) === genreIdItem) {
              this._genreNameListOfTheSong.push(genreItem.substring(0, genreItem.lastIndexOf('$')));
              genreIdList.splice(genreIdList.indexOf(genreIdItem), 1);
            }
          });
        });
      }
    }, error => {
      console.error(error);
      throw new Error('Error while fetching staticSelections');
    });
  }

  private initializeAlbum(): void {
    this.albumAdapterService.getAlbum(this.songData.data.albumSurrogateKey, false).subscribe(value => {
      this._album = value;
      this.initializeArtist();
      this.initializeFeaturingArtistList();
    }, error => {
      console.error(error);
      throw new Error('Error while fetching staticSelections');
    });
  }

  private initializeArtist(): void {
    this.artistAdapterService.getArtist(this.album.data.artistSurrogateKey, false).subscribe(value => {
      this._artist = value.data.name;
    }, error => {
      console.error(error);
      throw new Error('Error while fetching staticSelections');
    });
  }

  private initializeFeaturingArtistList(): void {
    this.songData.data.artistSurrogateKeyList.forEach(artistSurrogateKey => {
      this.artistAdapterService.getArtist(artistSurrogateKey, false).subscribe(value => {
        this._featuringArtistList.push(value.data.name);
      }, error => {
        console.error(error);
        throw new Error('Error while fetching staticSelections');
      });
    });
  }

  formatDate(date: Date) {
    return moment(date.toISOString().substring(0, 10), 'yyyy-mm-dd').format('MMM Do YYYY');
  }

  private initializeLyricsView(): void {

    this._lyric = UtilService.base64DecodeUnicode(this.songData.data.lyrics);
    this._lyricWithoutChords = this._lyric;

    const guitarTableMatches = this._lyric.match(/\$[a-zA-Z0-9!\\\/|\-+,.?%~=@()*^&#\n\t ]+\$/g);

    if (guitarTableMatches !== null) {
      guitarTableMatches.forEach(x => {
        this._lyric = this._lyric.replace(x, '<span class=\"lyric-guitar-table-font-style lyric-guitar-table-font-size\">' + x.substring(1, x.length - 1) + '</span>');
        this._lyricWithoutChords = this._lyricWithoutChords.replace(x, '');
      });
    }

    const chordMatches = this._lyric.match(/`[a-zA-Z0-9!\\\/|\-+,.?%~=@()*^&#\n\t ]+`/g);

    if (chordMatches !== null) {
      chordMatches.forEach(x => {
        this._lyric = this._lyric.replace(x, '<span class=\"lyric-guitar-chord-font-style\">' + x.substring(1, x.length - 1) + '</span>');
        this._lyricWithoutChords = this._lyricWithoutChords.replace(x, '');
      });
    }

    // remove unwanted whitespaces
    this._lyricWithoutChords = this._lyricWithoutChords.match(/[ \S]+[\S]+[\S ]+/g).join('\n\n');
  }

  get genreNameListOfTheSong(): string[] {
    return this._genreNameListOfTheSong;
  }

  get album(): AlbumGetResponse {
    return this._album;
  }

  get artist(): string {
    return this._artist;
  }

  get featuringArtistList(): string[] {
    return this._featuringArtistList;
  }

  get lyric(): string {
    return this._lyric;
  }

  get lyricWithoutChords(): string {
    return this._lyricWithoutChords;
  }

  get youtubeLink(): string {
    return this.songData.data.youTubeLink;
  }

  get spotifyLink(): string {
    return this.songData.data.spotifyLink;
  }

  get deezerLink(): string {
    return this.songData.data.deezerLink;
  }

  get appleMusicLink(): string {
    return this.songData.data.appleMusicLink;
  }

  get facebookLink(): string {
    return "https://facebook";
  }

  get twitterLink(): string {
    return "https://facebook";
  }

  get instagramLink(): string {
    return "https://facebook";
  }

}
