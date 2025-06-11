// src/app/components/column-list/column-list.component.ts
import { Component, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnMetadata } from '../../models/column-metadata.model';
import { TableMetadata } from '../../models/table-metadata.model';
import { ColumnMetadataService } from '../../services/column-metadata.service';
import { ColumnFormComponent } from '../column-form/column-form.component';

@Component({
  selector: 'app-column-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ColumnFormComponent],
  templateUrl: './column-list.component.html',
  styleUrls: ['./column-list.component.css']
})
export class ColumnListComponent implements OnChanges {
  @Input() table?: TableMetadata;

  columns: ColumnMetadata[] = [];
  editCol: ColumnMetadata | null = null;
  loading = false;
  error: string | null = null;

  newCol: ColumnMetadata = {
    columnName: '',
    dataType: '',
    columnSize: 0,
    nullable: false,
    table: { tableName: '' }
  };

  constructor(
    private service: ColumnMetadataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    if (this.table?.tableName) {
      this.loadColumns();
    }
  }

  private loadColumns(): void {
    if (!this.table?.tableName) return;

    this.loading = true;
    this.error = null;

    this.service.getColumnsByTable(this.table.tableName).subscribe({
      next: (columns) => {
        this.columns = columns;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Loaded columns:', columns);
      },
      error: (error) => {
        this.error = `Failed to load columns: ${error.message}`;
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Error loading columns:', error);
      }
    });
  }

  addColumn(): void {
    if (!this.table?.tableName || !this.newCol.columnName.trim() || !this.newCol.dataType) {
      alert('Please fill in all required fields');
      return;
    }

    this.newCol.table = { tableName: this.table.tableName };
    this.loading = true;

    this.service.createColumn(this.newCol).subscribe({
      next: () => {
        this.resetNewCol();
        this.loadColumns();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Error creating column:', error);
        alert(`Failed to create column: ${error.message}`);
      }
    });
  }

  deleteColumn(column: ColumnMetadata): void {
    if (!column.id) {
      alert('Cannot delete column: missing ID');
      return;
    }

    const confirmMessage = `Are you sure you want to delete column "${column.columnName}"?`;
    if (confirm(confirmMessage)) {
      this.loading = true;

      this.service.deleteColumn(column.id).subscribe({
        next: () => {
          this.loadColumns();
          this.loading = false;
          this.cdr.detectChanges();
          console.log(`Column ${column.columnName} deleted successfully`);
        },
        error: (error) => {
          this.loading = false;
          this.cdr.detectChanges();
          console.error('Error deleting column:', error);
          alert(`Failed to delete column: ${error.message}`);
        }
      });
    }
  }

  onEdit(column: ColumnMetadata): void {
    if (!column.id) {
      alert('Cannot edit column: missing ID');
      console.error('Edit failed - Column has no ID:', column);
      return;
    }

    console.log('Edit clicked for column:', column);
    this.editCol = {
      ...column,
      table: { tableName: this.table?.tableName || '' }
    };
    this.cdr.detectChanges();
  }

  onCancelEdit(): void {
    console.log('Edit cancelled');
    this.editCol = null;
    this.cdr.detectChanges();
  }

  onSaveEdit(): void {
    if (!this.editCol?.id) {
      alert('Cannot save: missing column ID');
      return;
    }

    this.loading = true;
    this.service.updateColumn(this.editCol.id, this.editCol).subscribe({
      next: () => {
        this.editCol = null;
        this.loadColumns();
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Column updated successfully');
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Error updating column:', error);
        alert(`Failed to update column: ${error.message}`);
      }
    });
  }

  trackByColumnId(index: number, column: ColumnMetadata): number | string {
    return column.id || column.columnName;
  }

  private resetNewCol(): void {
    this.newCol = {
      columnName: '',
      dataType: '',
      columnSize: 0,
      nullable: false,
      table: { tableName: this.table?.tableName ?? '' }
    };
  }
}
