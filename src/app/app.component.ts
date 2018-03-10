import { Component, AfterViewInit, AfterViewChecked } from '@angular/core';


import { DataService } from './data.service';
import { SearchTab } from './models/searchTab';
import { SearchResult } from './models/searchResult';

declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements AfterViewInit, AfterViewChecked {
  title = 'app';

  searchTabs: Array<SearchTab> = [];
  isLoading: boolean = false;
  focusTab: SearchTab = null;
  selectedResult: SearchResult = new SearchResult();

  constructor(private dataService: DataService) {

  }

  ngOnInit(): void {

    var searchTab: SearchTab = new SearchTab();

    searchTab.id = this.createGuid();
    this.searchTabs.push(searchTab);      
  }

  ngAfterViewInit() {
    
    $("#" + this.searchTabs[0].id + "-tab").trigger("click");
    this.searchTabs[0].isActive = true;

    $(window).scroll(() => {

      var fromTop = $('#bottomtag').offset().top - $(document).scrollTop() - $(window).height();

      if (fromTop < 100) {

        this.loadMoreResults();

      }

    });

  }

  loadMoreResults() {
    
    for (let tab of this.searchTabs) {

      if (tab.isActive && tab.type == "video") {

        this.getResults(tab);

      }

    }
  }

  ngAfterViewChecked() {

    if (this.focusTab != null) {
      
      $("#" + this.focusTab.id + "-tab").trigger("click");
      this.focusTab = null;
    }
    
  }

  deleteTab(searchTab: SearchTab) {

    if (searchTab.isActive) {
      if (this.searchTabs.indexOf(searchTab) > 0) {

        $("#" + this.searchTabs[this.searchTabs.indexOf(searchTab) - 1].id + "-tab").trigger("click");
        this.searchTabs[this.searchTabs.indexOf(searchTab) - 1].isActive = true;
      }
      else if (this.searchTabs.length > this.searchTabs.indexOf(searchTab) + 1) {

        $("#" + this.searchTabs[this.searchTabs.indexOf(searchTab) + 1].id + "-tab").trigger("click");
        this.searchTabs[this.searchTabs.indexOf(searchTab) + 1].isActive = true;

      }
    }

    this.searchTabs.splice(this.searchTabs.indexOf(searchTab), 1);
  }

  selectTab(searchTab: SearchTab) {
    
    for (let tab of this.searchTabs) {

      tab.isActive = false;
    }

    searchTab.isActive = true;
    
  }

  addTab() {
    var searchTab: SearchTab = new SearchTab();
    
    searchTab.id = this.createGuid();
    this.searchTabs.push(searchTab);

    this.selectTab(searchTab);

    this.focusTab = searchTab;
  }

  getTabName(searchTab: SearchTab) {

    if (searchTab.query == "" || searchTab.query == undefined) {
      return "New";
    }

    return searchTab.query;
  }

  loadMediaDetails(searchResult: SearchResult) {
    
    this.selectedResult = searchResult;

  }

  search(searchTab: SearchTab): void {

    if (searchTab.query == "" || searchTab.query == undefined) {
      alert("Please type your search criteria.")
    }
    else {

      this.isLoading = true;
      searchTab.results = [];
      this.isLoading = true;
      searchTab.nextPageToken = "";

      this.getResults(searchTab);
    }
  }


  getResults(searchTab: SearchTab): void {
                   
      if (searchTab.type == "video") {

        this.dataService.getVideos(searchTab)
          .subscribe((response: SearchTab) => {

            this.isLoading = false;

          },
          (err: any) => console.log(err),
          () => console.log('getVideos'));
      }

      else {
        this.dataService.getImages(searchTab)
          .subscribe((response: SearchTab) => {

            this.isLoading = false;

          },
          (err: any) => console.log(err),
          () => console.log('getImages'));
      }    
  }

  createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

}
