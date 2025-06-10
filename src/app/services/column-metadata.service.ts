import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ColumnMetadata } from '../models/column-metadata.model';

@Injectable({
  providedIn: 'root'
})
export class ColumnMetadataService {
  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getColumnsByTable(tableName: string): Observable<ColumnMetadata[]> {
    return this.http.get<ColumnMetadata[]>(`${this.apiUrl}/tables/${tableName}/columns`);
  }

  createColumn(column: ColumnMetadata): Observable<ColumnMetadata> {
    return this.http.post<ColumnMetadata>(`${this.apiUrl}/columns`, column);
  }

  updateColumn(id: number, column: ColumnMetadata): Observable<ColumnMetadata> {
    return this.http.put<ColumnMetadata>(`${this.apiUrl}/columns/${id}`, column);
  }

  deleteColumn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/columns/${id}`);
  }
}
