const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // When sending FormData, the browser sets the Content-Type header automatically.
  // Manually setting it to 'application/json' will cause issues.
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  // Handle cases with no content
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return;
  }
};

export default apiFetch;
