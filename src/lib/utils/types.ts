export type NoUndefinedField<T> = {
	[P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};

export type SparkleType = {
	id: string;
	createdAt: number;
	color: string;
	size: number;
	style: any;
};

export type TagType = {
	label: string;
	color?: 'primary' | 'secondary';
};

export type BlogPost = {
	tags: string[];
	keywords: string[];
	hidden: boolean;
	slug: string;
	title: string;
	date: string;
	updated: string;
	excerpt: string;
	html: string | undefined;
	readingTimeMinutes: number | undefined;
	relatedPosts: BlogPost[];
	coverImage: string | undefined;
};

export type GemEntry = {
	title: string;
	description: string;
	tags: string[];
	link: string;
	coverImage: string;
};
