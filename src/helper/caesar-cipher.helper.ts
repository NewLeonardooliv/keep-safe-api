export const encrypt = (str: string, shift: number): string => {
  return str
    .split('')
    .map((char) => {
      if (char.match(/[a-zA-Z]/)) {
        const code = char.charCodeAt(0);
        const isUpperCase = char === char.toUpperCase();
        const offset = isUpperCase ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
        return String.fromCharCode(((code - offset + shift) % 26) + offset);
      }
      return char;
    })
    .join('');
};

export const decrypt = (str: string, shift: number): string => {
  return encrypt(str, (26 - shift) % 26);
};
