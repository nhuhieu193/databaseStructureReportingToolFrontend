import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ColumnMetadata } from '../models/column-metadata.model';

@Injectable({
  providedIn: 'root'
})
export class ColumnMetadataService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getColumnsByTable(tableName: string): Observable<ColumnMetadata[]> {
    return this.http.get<ColumnMetadata[]>(`${this.apiUrl}/tables/${tableName}/columns`);
  }

  createColumn(tableName: string, column: ColumnMetadata): Observable<ColumnMetadata> {
    return this.http.post<ColumnMetadata>(`${this.apiUrl}/table-name/${tableName}`, column);
  }

  // Method này bị thiếu - cần thêm vào
  updateColumn(id: number, column: ColumnMetadata): Observable<ColumnMetadata> {
    return this.http.put<ColumnMetadata>(`${this.apiUrl}/columns/${id}`, column);
  }

  deleteColumn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/columns/${id}`);
  }
}
