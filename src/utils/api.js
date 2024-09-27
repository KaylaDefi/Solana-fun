export const fetchDataFromApi = async (url, method = 'GET', data = null, token = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };
  
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    const options = {
      method,
      headers,
    };
  
    if (data) {
      options.body = JSON.stringify(data);
    }
  
    const response = await fetch(url, options);
  
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
  
    return await response.json();
  };
  