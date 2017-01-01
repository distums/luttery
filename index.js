/**
 * Created by distu on 2016/12/19.
 */
const users = (window.users || []).map((name,index) => ({name, isReward: false,id:index}));

function renderUser(user) {
  return (`<div class="demo-card-image mdl-card mdl-shadow--2dp"
              data-user="${user.name}">
            <div class="mdl-card__title mdl-card--expand">LU</div>
          </div>`);
}

function renderCheckBox(id,checked) {
  return (`
    <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-${id}">
      <input type="checkbox" id="checkbox-${id}" class="mdl-checkbox__input" ${checked?"checked":""}>
    </label>
  `);
}

function renderUserTableRow(user) {
  return (`
    <tr>
      <td class="mdl-data-table__cell--non-numeric">${user.id + 1}</td>
      <td class="mdl-data-table__cell--non-numeric">${user.name}</td>
      <td class="mdl-data-table__cell--non-numeric">${renderCheckBox(user.id,user.isReward)}</td>
    </tr>
  `);
}

function compose(...fns) {
  const actualFns = fns.filter(fn => typeof fn === 'function');
  return (data) => actualFns.reduceRight((result, f) => f(result), data);
}

document.addEventListener('DOMContentLoaded', ()=> {
  const firstTabContent = document.querySelector('#fixed-tab-1 .page-content');
  const userTable = document.querySelector('#user-table');
  firstTabContent.innerHTML = users.map(renderUser).join('\r\n');
  userTable.querySelector('tbody').innerHTML = users.map(renderUserTableRow).join('\r\n');
});
