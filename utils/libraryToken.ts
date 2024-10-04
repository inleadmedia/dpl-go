import { LibraryToken } from "./types";

const STORAGE_KEY_LIBRARY_TOKEN = "libraryToken";

export const isToken = (
  token: string | null | undefined
): token is LibraryToken => {
  return Boolean(token);
};

export const setLibraryToken = (token: LibraryToken | null | undefined) => {
  if (!isToken(token)) {
    throw new Error("No token provided");
  }

  localStorage.setItem(STORAGE_KEY_LIBRARY_TOKEN, token);
  return token;
};

export const libraryTokenIsSetInLocalStorage = () => {
  return Boolean(localStorage.getItem(STORAGE_KEY_LIBRARY_TOKEN));
};

export const libraryTokenIsSetInEnvironment = () => {
  return Boolean(process.env.REACT_APP_LIBRARY_TOKEN);
};

export const getLibraryToken = () => {
  if (libraryTokenIsSetInEnvironment()) {
    return process.env.REACT_APP_LIBRARY_TOKEN as LibraryToken;
  }

  if (libraryTokenIsSetInLocalStorage()) {
    return localStorage.getItem(STORAGE_KEY_LIBRARY_TOKEN) as LibraryToken;
  }

  return null;
};

export const removeLibraryToken = () => {
  localStorage.removeItem(STORAGE_KEY_LIBRARY_TOKEN);
};
