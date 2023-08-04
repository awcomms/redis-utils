import { embedding } from 'openai-utils';
import { ids_hash } from '$lib/constants/index.js';
import { dev } from '$app/environment';
import type { RedisClientType } from 'redis';

const build_id = (index: string, id: number) => `${index}_${id}`;

export const add_embedding = async (data: object) => {
	return { v: await embedding(JSON.stringify(data)), ...data };
};

export const create = async (
	client: RedisClientType,
	{ index, data }: { index: string; data: object }
) => {
	const id = await client.hIncrBy(ids_hash, index, 1);
	const item_id = build_id(index, Number(id));
	const set: { [index: string]: any; expires?: boolean } = await add_embedding({
		...data,
		id: item_id,
		created: Date.now()
	});
	if (dev) set.expires = true;
	await client.json.set(item_id, '$', set);
	return item_id;
};
