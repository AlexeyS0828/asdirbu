import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { apiConstants } from 'src/app/constants/api-constants';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  
  constructor(
		private http: HttpClient
	) { 

  }	
	getBlogList(): Observable<{ success: boolean, message: string, data: any }> {
		return this.http.get<{ success: boolean, message: string, data: any }>(apiConstants.blogList);
	}

  
	deleteBlogById(params: any): Observable<{ success: boolean, message: string}> {
		return this.http.post<{ success: boolean, message: string}>(apiConstants.deleteBlog, params);
	}
	getBlogDetailsById(params: any): Observable<{ success: boolean, message: string, data: any }> {
		return this.http.post<{ success: boolean, message: string, data: any }>(apiConstants.blogDetailById, params);
    }
  
	storeBlog(params: any): Observable<{ success: boolean, message: string}> {
		if(params.get("blogId")!=0){
			return this.http.post<{ success: boolean, message: string}>(apiConstants.updateBlog, params);
		}
		else{
			return this.http.post<{ success: boolean, message: string}>(apiConstants.storeBlog, params);
		}
	}
  
}
