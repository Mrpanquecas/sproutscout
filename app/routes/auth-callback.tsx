export function loader(request): LoaderData {
	console.log(request);
}

export async function action({ request }): LoaderData {
	console.log(request);

	const resp = await request.formData();
	console.log(resp);
}
