export const calcPrice = (name: string, multiplier = 5) => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const map = [];

  for (let index = 0; index < name.length; index++) {
    const element = name[index].toLowerCase();
    map.push(letters.indexOf(element) + 1);
  }

  return (
    Math.round(map.reduce((prev, curr) => prev + curr, 0) / 5) * multiplier
  );
};

export const generateCookieKey = () => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let key = "";

  for (let index = 0; index < 30; index++) {
    const random = Math.floor(Math.random() * 26);
    key += letters[random];
  }

  return key;
};
