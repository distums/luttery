/**
 * Created by distu on 2017/1/1.
 */
window.users = Array.from({ length: 900 }, (_, index) => '测试用户');

window.randomNextFactory = function(sourceArr) {
  const sourceClone = [...sourceArr];
  const result = [];
  const randomNext = length => {
    const currentResult = [];
    while (length-- > 0) {
      const next = Math.floor(Math.random() * sourceClone.length);
      currentResult.push(sourceClone[next]);
      sourceClone.splice(next, 1);
    }
    result.push(...currentResult);
    return currentResult;
  };
  randomNext.getAll = () => {
    return result;
  };
  return randomNext;
};
