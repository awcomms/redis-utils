import { embedding_field_name, items_per_page } from '$lib/constants/index.js';
import type { RedisClientType, SearchOptions } from 'redis';
import type { Filters } from '$lib/types/filter.js';
import { embedding } from 'openai-utils';
import { slim } from '$lib/redis/shape/slim.js';
import type { SearchDocumentValue } from '$lib/types/index.js';
import { float32_buffer } from 'sveltekit-carbon-utils';

export interface SearchParams {
	index: string;
	page: number | null;
	filters?: Filters;
	count?: boolean;
	RETURN?: string[];
	search?: string | number[];
}

export const search = async (
	client: RedisClientType,
	{ index, page, filters, count, search, RETURN }: SearchParams
) => {
	const options: SearchOptions = {
		RETURN,
		DIALECT: 3
	};

	if (page) {
		options.LIMIT = count
			? { from: 0, size: 0 }
			: { from: page > 1 ? (page - 1) * items_per_page : 0, size: items_per_page };
	}

	let query = '';
	let extra_args = ''; // ' HYBRID_POLICY ADHOC_BF';

	console.log(filters);
	if (filters && filters.length) {
		query += '(';
		filters.forEach((filter) => {
			switch (filter.type) {
				case 'tag':
					query += ` @${filter.field}:{${filter.values.map(
						(v, i) => `${v}${i === filter.values.length - 1 ? '' : ' |'}`
					)}}`;
					break;
				case 'num':
					query += ` @${filter.field}:[${filter.start} ${filter.end}]`;
					break;
				case 'bool':
					query += ` @${filter.field}:{${filter.value.toString()}}`;
					break;
				case 'text':
					query += ` @${filter.field}:(${filter.value})`;
			}
		});
		query += ')';
		extra_args = ' HYBRID_POLICY ADHOC_BF';
	} else {
		query = '*';
	}

	console.log(query);

	if (search) {
		query += `=>[KNN 7 @${embedding_field_name} $BLOB${extra_args}]`;
		options.PARAMS = {
			BLOB:
				typeof search === 'string'
					? float32_buffer(await embedding(search))
					: float32_buffer(search)
		};
		options.SORTBY = {
			BY: `__${embedding_field_name}_score`,
			DIRECTION: 'ASC'
		};
	} else {
		options.SORTBY = {
			BY: 'created',
			DIRECTION: 'DESC'
		};
	}

	console.log(query);
	return client.ft.search(index, query, options).then((res) => {
		res.documents = res.documents.map((r) => {
			r.value = slim(r.value, true) as SearchDocumentValue;
			return r;
		});
		return { ...res, page };
	});
};
