// src/app/components/table-details/table-details.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnMetadata } from '../../models/column-metadata.model';
import { ColumnMetadataService } from '../../services/column-metadata.service';

// Define proper interface for table
interface TableInfo {
  tableName: string;
  schemaName?: string;
  description?: string;
}

@Component({
  selector: 'app-table-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-details.component.html',
  styleUrls: ['./table-details.component.css']
})
export class TableDetailsComponent implements OnInit {
  @Input() table: TableInfo = { tableName: '' };

  columns: ColumnMetadata[] = [];
  loading = false;
  error: string | null = null;
  showModal = false;
  editingColumn: ColumnMetadata | null = null;

  constructor(private columnService: ColumnMetadataService) {}

  ngOnInit(): void {
    console.log('TableDetailsComponent initialized with table:', this.table);
    if (this.table?.tableName) {
      this.loadColumns();
    }
  }

  // Add Column button click handler
  showAddColumn(): void {
    console.log('🚀 BUTTON CLICKED!'); // ← Test này trước
    console.log('🚀 showModal BEFORE:', this.showModal);
    console.log('🚀 table:', this.table);

    this.editingColumn = null;
    this.showModal = true;

    console.log('🚀 showModal AFTER:', this.showModal);
  }

  editColumn(column: ColumnMetadata): void {
    console.log('editColumn() called with:', column);
    this.editingColumn = { ...column };
    this.showModal = true;
  }

  onModalClose(): void {
    console.log('onModalClose() called');
    this.showModal = false;
    this.editingColumn = null;
  }

  onColumnSaved(): void {
    console.log('onColumnSaved() called');
    this.loadColumns();
    // Modal will close itself
  }

  loadColumns(): void {
    if (!this.table?.tableName) {
      console.error('Cannot load columns: table name is missing');
      this.error = 'Table name is required';
      return;
    }

    console.log('Loading columns for table:', this.table.tableName);
    this.loading = true;
    this.error = null;

    this.columnService.getColumnsByTable(this.table.tableName).subscribe({
      next: (columns) => {
        console.log('Columns loaded successfully:', columns);
        this.columns = columns || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading columns:', error);
        this.error = 'Failed to load columns';
        this.loading = false;
        this.columns = [];
      }
    });
  }

  deleteColumn(columnId: number): void {
    if (!columnId) {
      console.error('Column ID is required for deletion');
      return;
    }

    if (!confirm('Are you sure you want to delete this column?')) {
      return;
    }

    console.log('Deleting column with ID:', columnId);
    this.columnService.deleteColumn(columnId).subscribe({
      next: () => {
        console.log('Column deleted successfully');
        this.loadColumns();
      },
      error: (error) => {
        console.error('Error deleting column:', error);
        this.error = 'Failed to delete column';
      }
    });
  }

  trackByColumnId(index: number, column: ColumnMetadata): any {
    return column.id || index;
  }

  getDataTypeIcon(dataType: string): string {
    const iconMap: { [key: string]: string } = {
      'VARCHAR': '🔤',
      'INT': '🔢',
      'BIGINT': '🔢',
      'DECIMAL': '💰',
      'FLOAT': '📊',
      'DOUBLE': '📊',
      'DATE': '📅',
      'DATETIME': '🕐',
      'TIMESTAMP': '⏰',
      'TIME': '🕒',
      'BOOLEAN': '✅',
      'TEXT': '📝',
      'LONGTEXT': '📄',
      'CHAR': '🔤',
      'BINARY': '💾',
      'VARBINARY': '💾',
      'BLOB': '📦',
      'JSON': '📋',
      'MEDIUMTEXT': '📝',
      'MEDIUMBLOB': '📦'
    };
    return iconMap[dataType] || '📊';
  }
}
