export type Filter<Type extends types> = {
	name?: string;
	user_editable?: boolean,
	field: string;
	type: Type;
};

export type types = 'tag' | 'text' | 'bool' | 'num';

export type Filters = Array<Tag | Text | Bool | Num>;

export interface Tag extends Filter<'tag'> {
	values: string[];
}

export interface Text extends Filter<'text'> {
	value: string;
}

export interface Bool extends Filter<'bool'> {
	value: boolean;
}

export interface Num extends Filter<'num'> {
	start: number;
	end: number;
}
