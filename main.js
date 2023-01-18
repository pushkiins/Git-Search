const searchInput = document.querySelector('.input-search');
const repoContainer = document.querySelector('.container');
const urlBase = 'https://api.github.com';
const regular = /^[a-zA-Zа-яёА-ЯЁ0-9]+(?:[\s.-][a-zA-Zа-яёА-ЯЁ]+)*$/;

let arrRepo = [];

const getRepositories = async (urlAdres, text) => {
  const url = `${urlAdres}/search/repositories?q=${text}`;
  try {
    const respons = await fetch(url);
    const repositories = await respons.json();
    arrRepo = repositories.items;
    autoComplete(arrRepo);
  } catch (err) {
    console.log(err.name)
  }
};

const debounce = (fn, ms) => {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, ms);
  };
};
const validCheck = (reg, text) => {
  return reg.test(text);
};

const onCange = (e) => {
  const valid = validCheck(regular, searchInput.value);

  if (searchInput.value.length < 1) {
    autoComplete();
  }
  if (valid) {
    getRepositories(urlBase, e.target.value);
  }
};

const cangeValue = debounce(onCange, 300);

const createElement = (tag, elementClass) => {
  const element = document.createElement(tag);
  if (elementClass) {
    element.classList.add(elementClass);
  }
  return element;
};

const getElOnId = (arr, id) => {
  return arr.filter((e) => e.id === +id);
};

const autoComplete = (arrRepo = []) => {
  const completContainer = document.querySelector('.input-search__list');
  const maxRepo = arrRepo.length > 5 ? 5 : arrRepo.length;
  completContainer.textContent = '';
  const repos = arrRepo.slice(0, maxRepo);
  repos.forEach((e) => {
    const repo = createElement('li', 'input-search__item');
    repo.textContent = e.name;
    repo.setAttribute('data-id', e.id);
    completContainer.append(repo);
  });
};
const createCustomItem=(name,login,count)=>{
  const item = createElement('li', 'marked__item');
  const divItem=createElement('div','marked__item-text')
  const buttonItem=createElement('button','delette-btn')
  divItem.textContent=`Name: ${name}\nOwner: ${login}\nStars: ${count}`
  item.append(divItem,buttonItem)
  return item
  }
  
  const seveRepo = ({ name, owner, stargazers_count }) => {
  const markedContainer = document.querySelector('.marked__list');
  const item=createCustomItem(name,owner.login,stargazers_count)
  markedContainer.appendChild(item)
  };

searchInput.addEventListener('keyup', cangeValue);

repoContainer.addEventListener('click', (e) => {
  if (e.target.classList.value === 'input-search__item') {
    const repo = getElOnId(arrRepo, e.target.getAttribute('data-id'));
    seveRepo(...repo);
    searchInput.value = '';
    autoComplete();
  }

  if (e.target.classList.value === 'delette-btn') {
    e.target.parentNode.remove();
  }
});