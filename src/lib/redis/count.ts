import type { RedisClientType } from "redis";

export const count = async (client: RedisClientType, index: string): Promise<number> => {
	return client.ft.info(index).then((r) => {
		return Number(r.numDocs);
	});
};
