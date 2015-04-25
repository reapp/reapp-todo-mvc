import { store } from 'reapp-kit';

const get = name => JSON.parse(localStorage.getItem(name));
const list = name => get(name) || [];
const map = name => get(name) || {};

store({
  todos: list('todos')
})

// sync to localstorage
store.cursor().listen(data => {
  data.forEach((val, key) => {
    localStorage.setItem(key, JSON.stringify(val.toJS()));
  })
})