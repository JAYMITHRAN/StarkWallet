const AUTH_TOKEN_KEY = "stark_auth_token";
const LOGIN_DATE_KEY = "stark_login_date";

/** Returns today's date as YYYY-MM-DD in UTC */
export function todayUTC(): string {
  return new Date().toISOString().slice(0, 10); // "2026-07-27"
}

export const sessionService = {
  getToken: () => localStorage.getItem(AUTH_TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(AUTH_TOKEN_KEY),

  /** Stores the UTC date the session was created (YYYY-MM-DD) */
  setLoginDate: () => localStorage.setItem(LOGIN_DATE_KEY, todayUTC()),
  getLoginDate: () => localStorage.getItem(LOGIN_DATE_KEY),
  clearLoginDate: () => localStorage.removeItem(LOGIN_DATE_KEY),

  /** Clears both token and login date in one call */
  clearSession: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(LOGIN_DATE_KEY);
  },
};
