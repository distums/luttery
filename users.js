/**
 * Created by distu on 2017/1/1.
 */
window.users = Array.from({ length: 900 }, (_, index) => '测试用户');

window.randomNextFactory = function(sourceArr) {
  let sourceClone = [...sourceArr];
  const result = [];
  const randomNext = (length, label = '') => {
    const currentResult = [];
    while (length-- > 0) {
      const next = Math.floor(Math.random() * sourceClone.length);
      currentResult.push(Object.assign({}, sourceClone[next], { label }));
      sourceClone.splice(next, 1);
    }
    result.push(...currentResult);
    return currentResult;
  };
  randomNext.getAll = () => {
    return result;
  };
  randomNext.push = user => {
    result.push(user);
    sourceClone = sourceClone.filter(u => u.id !== user.id);
  };
  return randomNext;
};
