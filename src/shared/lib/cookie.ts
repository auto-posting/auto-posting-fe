function parseCookies() {
  const cookies: Record<string, string> = {};
  const cookieArray = document.cookie.split('; ');

  cookieArray.forEach(cookie => {
    const [name, value] = cookie.split('=');
    cookies[name] = decodeURIComponent(value);
  });

  return cookies;
}

export const getAccessToken = () => parseCookies()['access_token'];
export const getRefreshToken = () => parseCookies()['refresh_token'];
