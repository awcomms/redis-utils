import type { KeyedObject } from '$lib/types/index.js';
import type { RedisJSON } from '@redis/json/dist//commands';

export const shape = (obj: KeyedObject, parse_first = false): KeyedObject => {
	return Object.keys(obj).reduce((acc: KeyedObject, key) => {
		const keys = key.split('.');
		keys.shift();
		keys.reduce((ao, sub_key, index) => {
			if (index === keys.length - 1) {
				let v: RedisJSON = obj[key];
				if (parse_first && typeof v === 'string') {
					try {
						v = JSON.parse(v);
					} catch {
						('');
					}
				}
				if (Array.isArray(v)) {
					ao[sub_key] = v[0];
				} else {
					ao[sub_key] = v;
				}
			} else {
				if (!ao[sub_key]) {
					ao[sub_key] = {};
				}
			}
			return ao[sub_key] as KeyedObject;
		}, acc);
		return acc;
	}, {});
};

export {slim} from './slim.js'