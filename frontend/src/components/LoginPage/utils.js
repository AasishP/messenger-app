//To save the authorization token to the localstorage.
export function storeTokenToLocalStorage(res) {
  const accesstoken = res.data.accesstoken;
  window.localStorage.setItem("accesstoken", accesstoken);
}

