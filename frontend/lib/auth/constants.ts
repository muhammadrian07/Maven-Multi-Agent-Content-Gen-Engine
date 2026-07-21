export const ACCESS_COOKIE = "maven_access";
export const REFRESH_COOKIE = "maven_refresh";

// Access ~1h, refresh ~7d — align with Django SIMPLE_JWT settings later.
export const ACCESS_MAX_AGE = 60 * 60;
export const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;
