import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetadataSyncService {
  private readonly apiUrl = 'http://localhost:8080/api/metadata';

  constructor(private http: HttpClient) { }

  syncMetadata(): Observable<any> {
    return this.http.post(`${this.apiUrl}/sync`, {});
  }
}
