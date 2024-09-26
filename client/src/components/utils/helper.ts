export const isValidEmail = (email:any) => {
    const isValidateEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // eslint-disable-line
    return isValidateEmail.test(email);
}

export const getLocalStorage = (key:any) => {
    return localStorage.getItem(key);
}

export const setLocalStorage = (key:any, value:any) => {
    localStorage.setItem(key, value);
}

export const removeLocalStorage = (key:any) => {
    localStorage.removeItem(key);
}

export const clearLocalStorage = () => {
    localStorage.clear();
}

export const isUserLoggedIn = ():boolean => {
    const token:string|null = localStorage.getItem('app_token');
    console.log(token,"token", !!token);
    return !!token;
}