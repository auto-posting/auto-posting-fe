function parseCookies() {
  const cookies: Record<string, string> = {};
  const cookieArray = document.cookie.split('; ');

  cookieArray.forEach(cookie => {
    const [name, value] = cookie.split('=');
    cookies[name] = decodeURIComponent(value);
  });

  return cookies;
}

export const getAccessToken = () => parseCookies()['accessToken'];
export const getRefreshToken = () => parseCookies()['refreshToken'];
