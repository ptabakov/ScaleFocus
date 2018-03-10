import { Component, OnInit, OnDestroy, Input, Output, Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { SearchTab } from './models/searchTab';
import { SearchResult } from './models/searchResult';

declare var $: any;

@Injectable()
export class DataService {

  googleKey: string = "AIzaSyA7cz-zH2PGSU-ON8dRk-clEH38BcXSf8I";

  videosRequestCount: number = 25;
  imagesRequestCount: number = 10;

  videosUrl: string = "https://www.googleapis.com/youtube/v3/search?key=" + this.googleKey + "&part=snippet&maxResults=" + this.videosRequestCount;
  imagesUrl: string = "https://www.googleapis.com/customsearch/v1?cx=014402409906423180924:pxmsl9dlkl4&key=" + this.googleKey + "&searchtype=image&hl=en&num=" + this.imagesRequestCount;

  
  constructor(private http: Http) {

  }

  getVideos(searchTab: SearchTab): Observable<SearchTab> {

    var url: string = this.videosUrl + "&q=" + searchTab.query;

    if (searchTab.nextPageToken != undefined && searchTab.nextPageToken != "")
      url += "&pageToken=" + searchTab.nextPageToken;

       
    return this.http.get(url).map((res: any) => {
                      
        let videosResponse = JSON.parse(res._body);
        
        searchTab.nextPageToken = videosResponse.nextPageToken;

        for (let video of videosResponse.items) {

          if (video.snippet != null && video.snippet != undefined) {

            var searchResult: SearchResult = new SearchResult();
            searchResult.title = video.snippet.channelTitle;
            searchResult.description = video.snippet.description;

            if (video.snippet.thumbnails != null && video.snippet.thumbnails != undefined) {

              searchResult.smallThumb = video.snippet.thumbnails.medium.url;
              searchResult.largeThumb = video.snippet.thumbnails.high.url;

              searchTab.results.push(searchResult);
            }
          }
        }

        return searchTab;
      })
      .catch(this.handleError);
  }

  getImages(searchTab: SearchTab): Observable<SearchTab> {

    var url: string = this.imagesUrl + "&q=" + searchTab.query + "&start" + searchTab.imageStartIndex;

    return this.http.get(url).map((res: any) => {
      
      let imagesResponse = JSON.parse(res._body);
           
      for (let image of imagesResponse.items) {
        
          var searchResult: SearchResult = new SearchResult();
          searchResult.title = image.title;
          searchResult.description = image.title;
          
          if (image.pagemap.cse_thumbnail != undefined) {

            searchResult.smallThumb = image.pagemap.cse_thumbnail[0].src;

            if (image.pagemap.cse_image != undefined) {
              searchResult.largeThumb = image.pagemap.cse_image[0].src;
            }

            searchTab.results.push(searchResult); 
          }                                  
      }

      return searchTab;
    })
      .catch(this.handleError);
  }

  private handleError(error: any) {

    
    return Observable.throw(error || error.json().message);
  }

}
