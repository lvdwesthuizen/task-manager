import { useContext } from 'react';
import AuthContext from 'AuthContext';

const useFetch = () => {
	const auth = useContext(AuthContext);

	const sendHttpRequest = async (url, method, action, postData) => {
		await fetch(`/api/${url}`, {
			method: method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${auth.token}`,
			},
			body: postData ? JSON.stringify(postData) : null,
		})
			.then(response => {
				if (response.status === 401) {
					auth.logout();
				}
				const data = response.json();
				action(data);
			})
			.catch(error => console.log(error));
	};

	return sendHttpRequest;
};

export default useFetch;
