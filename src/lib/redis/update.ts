import type { KeyedObject } from '$lib/types/index.js';
import { is_object } from 'sveltekit-carbon-utils';
import { embedding } from 'openai-utils';
import { sanitize } from 'sveltekit-carbon-utils';
import type { RedisClientType } from 'redis';

const include = (prefix: string, obj: KeyedObject, accumulator: KeyedObject) => {
	for (const [key, value] of Object.entries(obj)) {
		if (is_object(value)) {
			include(`${prefix}.${key}`, value as KeyedObject, accumulator);
		} else {
			accumulator[`${prefix}.${key}`] = value;
		}
	}
};

export const update = async (client: RedisClientType, { id, data }: { id: string; data: KeyedObject }) => {
	if (!is_object(data)) client.json.set(id, '$', data);
	const sanitized_data = sanitize.sanitize_object(data);
	const values: KeyedObject = {
		'$.embedding': await embedding(JSON.stringify(sanitized_data))
	};
	include('$', data as KeyedObject, values);
	for (const [path, value] of Object.entries(values)) {
		await client.json.set(id, path, value);
	}
	await client.json.set(id, '$.updated', Date.now());
};
