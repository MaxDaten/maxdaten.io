import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is 'png' | 'jpg' => {
    return param === 'png' || param === 'jpg';
}) satisfies ParamMatcher;
