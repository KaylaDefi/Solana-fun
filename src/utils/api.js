import { getSession } from 'next-auth/react';

export const fetchDataFromApi = async (url, method = 'GET', data = null) => {
  try {
    // Get session from NextAuth (includes token if available)
    const session = await getSession();
    const headers = {
      'Content-Type': 'application/json',
    };

    // If session exists, include the token in the Authorization header
    if (session && session.token) {
      headers['Authorization'] = `Bearer ${session.token}`;
    }

    const options = {
      method,
      headers,
    };

    // If data is provided, include it in the request body
    if (data) {
      options.body = JSON.stringify(data);
    }

    // Make the API request
    const response = await fetch(url, options);

    // Throw an error if the response is not ok
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    // Return the JSON response data
    return await response.json();
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
};
