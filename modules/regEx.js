const hauptortRegex = (hauptort) => {
  return {
    $regex: new RegExp("^" + hauptort, "i"),
  };
};
const ortRegex = (ort) => {
  return {
    $regex: new RegExp("^" + ort, "i"),
  };
};

module.exports = { hauptortRegex, ortRegex };
