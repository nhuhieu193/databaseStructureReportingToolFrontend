// src/app/metadata/metadata.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface MetadataColumn {
  id?: number;
  columnName: string;
  dataType: string;
  isNullable: boolean;
}

export interface MetadataTable {
  id?: number;
  tableName: string;
  columns: MetadataColumn[];
}

@Injectable({ providedIn: 'root' })
export class MetadataService {
  private baseUrl = '/api/metadata';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<MetadataTable[]>(`${this.baseUrl}`);
  }

  createTable(data: Partial<MetadataTable>) {
    return this.http.post<MetadataTable>(`${this.baseUrl}/table`, data);
  }

  updateTable(id: number, data: Partial<MetadataTable>) {
    return this.http.put(`${this.baseUrl}/table/${id}`, data);
  }

  deleteTable(id: number) {
    return this.http.delete(`${this.baseUrl}/table/${id}`);
  }

  addColumn(tableId: number, column: Partial<MetadataColumn>) {
    return this.http.post(`${this.baseUrl}/table/${tableId}/column`, column);
  }

  updateColumn(id: number, column: Partial<MetadataColumn>) {
    return this.http.put(`${this.baseUrl}/column/${id}`, column);
  }

  deleteColumn(id: number) {
    return this.http.delete(`${this.baseUrl}/column/${id}`);
  }

  exportPdf() {
    return this.http.get(`${this.baseUrl}/export/pdf`, { responseType: 'blob' });
  }
}
