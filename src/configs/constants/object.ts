export const findByKey = (data, key) => {
  for (const i in data) {
    if (i === key) {
      return data[i];
    } else if (typeof data[i] === 'object') {
      return findByKey(data[i], key);
    }
  }
  return null;
};
