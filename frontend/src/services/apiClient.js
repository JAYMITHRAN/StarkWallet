const API_BASE_URL = `${import.meta.env.VITE_API_URL || ""}/api/v1`;
const TOKEN_STORAGE_KEY = "stark_auth_token";
export const tokenStorage = {
    get: () => localStorage.getItem(TOKEN_STORAGE_KEY),
    set: (token) => localStorage.setItem(TOKEN_STORAGE_KEY, token),
    clear: () => localStorage.removeItem(TOKEN_STORAGE_KEY),
};
export class ApiRequestError extends Error {
    code;
    status;
    details;
    constructor(code, message, status, details) {
        super(message);
        this.code = code;
        this.status = status;
        this.details = details;
        this.name = "ApiRequestError";
    }
}
/**
 * Every API call goes through this single function so error handling,
 * auth headers, and the `ApiResponse` envelope are handled in one place —
 * feature services (auth, transactions, ...) just describe *what* to call.
 */
export async function apiRequest(path, options = {}) {
    const { method = "GET", body, auth = true } = options;
    const headers = {};
    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }
    if (auth) {
        const token = tokenStorage.get();
        if (token)
            headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        cache: "no-store",
    });
    const json = (await response.json());
    if (!json.success) {
        throw new ApiRequestError(json.error.code, json.error.message, response.status, json.error.details);
    }
    return json.data;
}
