// src/app/components/table-list/table-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableMetadata } from '../../models/table-metadata.model';
import { TableMetadataService } from '../../services/table-metadata.service';
import { MetadataSyncService } from '../../services/metadata-sync.service';
import { TableFormComponent } from '../table-form/table-form.component';
import { TableDetailsComponent } from '../table-details/table-details.component';

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableFormComponent,
    TableDetailsComponent
  ],
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  tables: TableMetadata[] = [];
  loading = false;
  error: string | null = null;
  selectedTable: TableMetadata | null = null;
  showAddForm = false;
  syncing = false;

  constructor(
    private tableService: TableMetadataService,
    private syncService: MetadataSyncService
  ) {}

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(): void {
    this.loading = true;
    this.error = null;

    this.tableService.getAllTables().subscribe({
      next: (tables) => {
        this.tables = tables;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load tables';
        this.loading = false;
        console.error('Error loading tables:', error);
      }
    });
  }

  syncMetadata(): void {
    this.syncing = true;
    this.error = null;

    this.syncService.syncMetadata().subscribe({
      next: () => {
        this.syncing = false;
        this.loadTables(); // Reload tables after sync
      },
      error: (error) => {
        this.syncing = false;
        this.error = 'Failed to sync metadata';
        console.error('Error syncing metadata:', error);
      }
    });
  }

  selectTable(table: TableMetadata): void {
    this.selectedTable = table;
  }

  deleteTable(tableName: string): void {
    if (confirm(`Are you sure you want to delete table "${tableName}"?`)) {
      this.tableService.deleteTable(tableName).subscribe({
        next: () => {
          this.loadTables();
          if (this.selectedTable?.tableName === tableName) {
            this.selectedTable = null;
          }
        },
        error: (error) => {
          this.error = 'Failed to delete table';
          console.error('Error deleting table:', error);
        }
      });
    }
  }

  showAddTableForm(): void {
    this.showAddForm = true;
    this.selectedTable = null;
  }

  hideAddForm(): void {
    this.showAddForm = false;
  }

  onTableSaved(): void {
    this.showAddForm = false;
    this.loadTables();
  }
}
