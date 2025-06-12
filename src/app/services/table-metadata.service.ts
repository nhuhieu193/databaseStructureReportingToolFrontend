// src/app/services/table-metadata.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableMetadata } from '../models/table-metadata.model';

@Injectable({
  providedIn: 'root'
})
export class TableMetadataService {
  private readonly apiUrl = 'http://localhost:8080/api/tables';
  private readonly metadataUrl = 'http://localhost:8080/api/metadata';

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

  // ✅ NEW: Export PDF method
  exportMetadataToPDF(): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });

    return this.http.get(`${this.metadataUrl}/export/pdf`, {
      headers: headers,
      responseType: 'blob'
    });
  }

  // ✅ NEW: Download PDF helper
  downloadPDF(blob: Blob, filename: string = 'database-metadata.pdf'): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
