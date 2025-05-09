export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const setTokens = (access: string, refresh: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
};

export const removeTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('phone');
};

export const refreshAccessToken = async () => {
    try {
        const refresh = getRefreshToken();
        if (!refresh) {
            throw new Error('No refresh token found');
        }

        const response = await fetch('https://api.noventer.uz/api/v1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to refresh token');
        }

        setTokens(data.access, data.refresh);

        return data.access; 
    } catch (error) {
        console.error("Error refreshing token:", error);
        removeTokens();
        throw new Error('Session expired. Please log in again.');
    }
};

export const isAuthenticated = () => {
    return !!getAccessToken();
};
