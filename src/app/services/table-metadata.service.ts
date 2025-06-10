// src/app/services/table-metadata.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableMetadata } from '../models/table-metadata.model';

@Injectable({
  providedIn: 'root'
})
export class TableMetadataService {
  private readonly apiUrl = 'http://localhost:8080/api/tables';

  constructor(private http: HttpClient) { }

  getAllTables(): Observable<TableMetadata[]> {
    return this.http.get<TableMetadata[]>(this.apiUrl);
  }

  getTableByName(tableName: string): Observable<TableMetadata> {
    return this.http.get<TableMetadata>(`${this.apiUrl}/${tableName}`);
  }

  createTable(table: TableMetadata): Observable<TableMetadata> {
    return this.http.post<TableMetadata>(this.apiUrl, table);
  }

  updateTable(tableName: string, table: TableMetadata): Observable<TableMetadata> {
    return this.http.put<TableMetadata>(`${this.apiUrl}/${tableName}`, table);
  }

  deleteTable(tableName: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tableName}`);
  }
}
