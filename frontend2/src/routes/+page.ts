import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

const load = async () => {
	const response = await fetch(`${PUBLIC_BACKEND_URL}/base-weights`);
	const data = await response.json();

    if (response.status === 404)
        throw error(404, 'not found');

    if (response.status === 401)
        throw error(401, 'not authorized');

	return data;
};

export { load };
