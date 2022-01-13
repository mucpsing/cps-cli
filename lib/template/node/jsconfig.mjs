export function format(target, keywordsList) {
  let reg = /\{\}/g;
  let keywordIndex = 0;
  let newString = target.replace(
    reg,
    () => keywordsList[keywordIndex++]
  );

  return newString;
}

export default {
  extends: { node: "@tsconfig/node{}/tsconfig.json" },
};
