const replace = (text, toReplace, withThis) => {
  // write me!
  const regex = RegExp(toReplace,"g");
  return text.replace(regex,withThis);
};

module.exports = replace;
