export function onlyNumbers(event: React.KeyboardEvent<HTMLInputElement>) {
  debugger;
  const allowedKeys = [
    "Backspace",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
    "Enter",
    "Delete",
  ];
  if (!(/^[0-9]/gi.test(event.key) || allowedKeys.includes(event.key))) {
    event.preventDefault();
  }
}

export function onlyAlphabetics(event: React.KeyboardEvent<HTMLInputElement>) {
  debugger;
  const allowedKeys = [
    "Backspace",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
    "Enter",
    "Delete",
  ];
  if (!(/^[A-Za-z]/gi.test(event.key) || allowedKeys.includes(event.key))) {
    event.preventDefault();
  }
}

export function getCookie(cname: string) {
  const name = cname + "=";
  let decodedCookies = decodeURIComponent(document.cookie);
  let allCookies = decodedCookies.split(";");
  for (let i = 0; i < allCookies.length; i++) {
    let cookie = allCookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
}

export function DeleteCookie(cname: string) {

  let expires = "expires="+ "Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = cname + "=;" + expires + ";path=/";
}
