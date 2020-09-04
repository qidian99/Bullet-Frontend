export async function fakeAccountLogin(params) {
  return fetch('/api/login/account', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return fetch(`/api/login/captcha?mobile=${mobile}`);
}
