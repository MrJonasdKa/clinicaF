import Cookies from 'js-cookie';

function setSession(data) {
  Cookies.set('session', data, { expires: 1 });
}

function getSession() {
  return Cookies.get('session');
}

function removeSession() {
  Cookies.remove('session');
}

export { setSession, getSession, removeSession };