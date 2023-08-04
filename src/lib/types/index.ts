import { escape_email } from 'sveltekit-carbon-utils';
import type { RedisJSON } from '@redis/json/dist/commands';
import type { Document } from './SearchResponse.js';

type Outcome = 'accepted' | 'dismissed';

export interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<Outcome>;
	prompt(): Promise<{
		outcome: Outcome;
		platform: string;
	}>;
}

export type KeyedObject = { [index: string]: RedisJSON };
export interface SearchDocumentValue {
	[key: string]: string | number | null | Array<SearchDocumentValue> | SearchDocumentValue;
}
export type RedisKey = string;
export type NumberDate = number;

export type Email = string;
export class EscapedEmail {
	value: string;
	constructor(email: string) {
		this.value = 'user:' + escape_email(email);
	}
}

export interface Church { id: RedisKey, name: string }

export type ResultSearchDocument = Document<{name: string}> & {selected: boolean}

export type V = number[];

export type { SearchResponse } from './SearchResponse.js';
// export type {
// 	Post,
// 	UserPayment,
// 	Payment,
// 	PostEdit,
// 	EditablePost,
// 	PostSearchDocument,
// 	PostItem,
// 	Edit
// } from './Post';
