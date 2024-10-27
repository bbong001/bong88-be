export interface PaginationResult<T> {
  results: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
