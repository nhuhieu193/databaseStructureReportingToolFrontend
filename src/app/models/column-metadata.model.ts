export interface ColumnMetadata {
  id?: number;
  columnName: string;
  dataType: string;
  columnSize?: number;
  nullable?: boolean;
}
