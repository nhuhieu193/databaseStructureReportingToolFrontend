import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnMetadata } from '../../models/column-metadata.model';
import { TableMetadata } from '../../models/table-metadata.model';
import { ColumnMetadataService } from '../../services/column-metadata.service';

@Component({
  selector: 'app-column-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './column-list.component.html',
  styleUrls: ['./column-list.component.css']
})
export class ColumnListComponent implements OnChanges {
  @Input() table?: TableMetadata;

  columns: ColumnMetadata[] = [];
  loading = false;
  error: string | null = null;

  showModal = false;
  editingColumn: ColumnMetadata | null = null;

  constructor(private columnService: ColumnMetadataService) {}

  ngOnChanges() {
    if (this.table) {
      this.loadColumns();
    }
  }

  loadColumns() {
    if (!this.table) return;
    this.loading = true;
    this.error = null;
    this.columnService.getColumnsByTable(this.table.tableName).subscribe({
      next: cols => {
        this.columns = cols;
        this.loading = false;
      },
      error: err => {
        this.error = 'Failed to load columns!';
        this.loading = false;
      }
    });
  }

  openAddColumnModal() {
    this.editingColumn = null;
    this.showModal = true;
    // DEBUG
    console.log('openAddColumnModal: showModal', this.showModal);
  }

  onEdit(col: ColumnMetadata) {
    this.editingColumn = { ...col };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingColumn = null;
  }

  onColumnSaved() {
    this.closeModal();
    this.loadColumns();
  }

  deleteColumn(col: ColumnMetadata) {
    if (!col.id) return;
    this.loading = true;
    this.columnService.deleteColumn(col.id).subscribe({
      next: () => {
        this.loadColumns();
      },
      error: err => {
        this.error = 'Failed to delete column!';
        this.loading = false;
      }
    });
  }

  trackByColumnId(index: number, col: ColumnMetadata) {
    return col.id;
  }
}
