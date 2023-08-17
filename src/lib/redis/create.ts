import { embedding } from 'openai-utils';
import { id_store } from '$lib/constants/index.js';
import { dev } from '$app/environment';
import type { RedisClientType } from 'redis';

const build_id = (index: string, id: number) => `${index}:${id}`;

export const _add_embedding = async (data: object) => {
	return { v: await embedding(JSON.stringify(data)), ...data };
};

export const create = async (
	client: RedisClientType,
	{
		index,
		data,
		id,
		id_store_key = id_store
	}: { index: string; data: object; id: string; id_store_key: string }
) => {
	const item_id = id || build_id(index, Number(await client.hIncrBy(id_store_key, index, 1)));
	await client.json.set(
		item_id,
		'$',
		{
			...data,
			id: item_id,
			created: Date.now(),
			expires: dev
		}
	);
	return item_id;
};
