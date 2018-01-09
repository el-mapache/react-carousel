// from https://stackoverflow.com/a/27747377
const dec2hex = dec => ('0' + dec.toString(16)).substr(-2);

const generateId = (len) => {
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);

  return Array.from(arr, dec2hex).join('');
};

export default generateId;
