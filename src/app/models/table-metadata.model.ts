import {ColumnMetadata} from './column-metadata.model';

export interface TableMetadata {
  id?: number;
  tableName: string;
  schemaName: string;
  description?: string;
  columns?: ColumnMetadata[];
}
