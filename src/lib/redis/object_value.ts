import { get } from '$lib/redis/get.js';
import type { RedisKey } from '$lib/types/index.js';
import { is_object } from 'sveltekit-carbon-utils';

import type { RedisClientType } from "redis";
export const object_value = <Value>(
	client: RedisClientType,
	key: RedisKey,
	sub_path: string,
	value_key: string
) =>
	get<Record<string, Value>>(client, key, [`$.${sub_path}.${value_key}`]).then((r) =>
		r && is_object(r) ? r[value_key] : r
	);
