import type { SearchDocumentValue } from './index.js';

export interface Document<Type> {
	id: string;
	value: Type;
}

export interface SearchResponse<Type extends SearchDocumentValue> {
	total: number;
	documents: Document<Type>[];
	page: number;
}
