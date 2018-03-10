import { SearchResult } from './searchResult';

export class SearchTab {

	public type: string = "video";
	public query: string;
    public nextPageToken: string;
    public imageStartIndex: number = 1; 

    
    public id: string;
    public isActive: boolean;

    results: Array<SearchResult> = [];

}