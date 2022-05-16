const randomItemMultiple = (array, count) => {
  return [...Array.from({ length: count })].map(
    () => array[Math.floor(Math.random() * array.length)]
  );
};
module.exports.randomnArr = (stadt, anzahl) => {
  let arr = [];
  if (stadt.length === anzahl) {
    stadt.forEach((e) => arr.push(e));
    return arr;
  }
  if (stadt.length < anzahl) {
    if (stadt.length >= anzahl / 2) {
      randomItemMultiple(stadt, anzahl / 2).forEach((e) => arr.push(e));
    } else {
      stadt.forEach((e) => arr.push(e));
    }
  } else {
    randomItemMultiple(stadt, anzahl).forEach((e) => arr.push(e));
  }
  return arr;
};
