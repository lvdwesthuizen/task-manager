import { useState, useContext } from 'react';
import AuthContext from 'AuthContext';

const useFetch = () => {
	const [errorMessage, setErrorMessage] = useState(null);
	const auth = useContext(AuthContext);

	const sendHttpRequest = async (url, method, postData, action) => {
		await fetch(`/api/${url}`, {
			method: method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${auth.token}`,
			},
			body: postData ? JSON.stringify(postData) : null,
		})
			.then(response => {
				response.json();
				action();
			})
			.catch(error => setErrorMessage(error));
	};

	return [errorMessage, sendHttpRequest];
};

export default useFetch;
