import type { RedisJSON } from '@redis/json/dist//commands';
import type { KeyedObject } from '$lib/types/index.js';

export const slim = (obj: KeyedObject, parse_first = false): KeyedObject => {
	return Object.keys(obj).reduce((acc: KeyedObject, key) => {
		const sub_keys = key.split('.');
		const last_key = sub_keys.pop();
		if (last_key) {
			let v: RedisJSON = obj[key];
			if (parse_first && typeof v === 'string') {
				try {
					v = JSON.parse(v);
				} catch { ; }
			}
			if (Array.isArray(v)) {
				acc[last_key] = v[0];
			} else {
				acc[last_key] = v;
			}
		}
		return acc;
	}, {});
};
