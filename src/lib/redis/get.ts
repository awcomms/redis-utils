import { check_JSONPaths } from 'sveltekit-carbon-utils';
import { slim } from '$lib/redis/shape/slim.js';
import { shape } from '$lib/redis/shape/index.js';
import { is_object } from 'sveltekit-carbon-utils';
import type { RedisClientType } from 'redis';

export const get = async <Type>(
	client: RedisClientType,
	key: string,
	path: string[],
	slim_shape = true
) => {
	// const isPathRes = check_JSONPaths(path);
	// if (!isPathRes.result) throw { message: 'not_path', ...isPathRes };
	const args: [string, { path: string[] }?] = [key];
	if (path) args.push({ path });
	return await client.json.get(...args).then((r) => {
		const shaped = is_object(r) ? (slim_shape ? slim(r) : shape(r)) : r;
		return shaped as Type;
	});
};
