const numberInput = document.getElementById('length');
const rangeInput = document.querySelector('.form-range');
const form = document.getElementById('length-form');
const checkboxes = Array.from(document.querySelectorAll('.check-item input[type=checkbox]'));
const text = document.querySelector('.password');

const capitals = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i));
const lowers = Array.from({length: 26}, (_, i) => String.fromCharCode(97 + i));
const specials = ['~', '`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', '\\', '|', ';', ':', '"', "'", '<', '>', ',', '.', '/', '?'];

rangeInput.value = numberInput.value;

checkboxes.forEach(cb => cb.checked = true);

const getRandom = (max, min) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const getIndexes = (times, type = "special") => {
  let indexes = [];
  const sames = {};
  let biggest = 0;

  do {
    for(let i = 0; i < times; i++) {
      if(type === "letter") {
        const random = getRandom(capitals.length, 0);
        indexes.push(random);
  
      } else if(type === "special") {
        const random = getRandom(specials.length, 0);
        indexes.push(random);
      }
    }
  
    if(times > 5) {
      for(const idx of indexes) {
        if(sames[idx]) {
          sames[idx]++;
        } else {
          sames[idx] = 1;
        }
      }
      const values = Object.values(sames);
      for(const i of values) {
        if(values[i] > biggest) {
          biggest = values[i];
        }
      }
    }
  } while(biggest > times / 2);

  return indexes;
}

const swamp = (a, b) => {
  let temp = b;
  b = a;
  a = temp;
}

const shuffle = (array) => {
  const newArray = [...array];
  for(let i = 0; i < newArray.length; i++) {
    const random = getRandom(newArray.length, 0);
    let temp = newArray[random];
    newArray[random] = newArray[i];
    newArray[i] = temp;
  }

  return newArray;
}

const getPassword = () => {
  const qtrPassword = [];
  let length = numberInput.value;
  const checkedCB = checkboxes.filter(cb => cb.checked);
  const times = {capital: 0, lower: 0, special: 0, number: 0};
  let perTotal = 0;

  rangeInput.value = numberInput.value;

  if(length.includes("e") || length.includes("E")) {
    numberInput.value = 12;
    length = 12;

  } else if(length > 50) {
    numberInput.value = 50;
    length = 50;

  } else if(length <= 0) {
    numberInput.value = 1;
    length = 1;
  }
  
  if(length < checkedCB.length) {
    const already = [];
    if(length === 1) {
      times[checkedCB[getRandom(checkedCB.length, 0)]] = 1;
    } else {

      for(let i = 0; i <length; i++) {
        let includes = false;
        do {
          const random = getRandom(checkedCB.length, 0);
          if(already.includes(random)) {
            includes = true;
          } else {
            already.push(random);
            includes = false;
          }
        } while(includes);
        for(const i of already) {
          times[checkedCB[i].id] = 1;
        }
      }
    }
  } else {
    for(let i = 1; i <= checkedCB.length; i++) {
      let random;
      if(checkedCB.length === 2) {
        random = getRandom((length - perTotal) - Math.floor(length / 2), 1);
      } else {
        if(length >= 25 && length < 40) {
          random = getRandom((length - perTotal) - (4 * (checkedCB.length - i)), 1);

        } else if(length >= 40) {
          random = getRandom((length - perTotal) - (10 * (checkedCB.length - i)), 1);
          
        } else {
          random = getRandom((length - perTotal) - (checkedCB.length - i), 1);
        }
      }

      if(i === checkedCB.length) {
        times[checkedCB[i - 1].id] = length - perTotal;
      } else {
        times[checkedCB[i - 1].id] = random;
      }
      perTotal += random;
    }
  }

  const keys = Object.keys(times).filter(key => times[key] > 0);
  for(const key of keys) {
    let index;
    if(key === "capital" || key === "lower") {
      index = getIndexes(times[key], "letter");

      for(const idx of index) {
        if(key === "capital") {
          qtrPassword.push(capitals[idx]);
        } else {
          qtrPassword.push(lowers[idx]);
        }
      }
    } else if(key === "special") {
      index = getIndexes(times[key], "special");

      for(const idx of index) {
        qtrPassword.push(specials[idx]);
      }
    } else {
      for(let i = 0; i < times[key]; i++) {
        qtrPassword.push(String(getRandom(10, 1)));
      }
    }
  }

  text.value = shuffle(qtrPassword).join('');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  getPassword();
});

rangeInput.addEventListener('input', () => {
  numberInput.value = rangeInput.value;
  getPassword();
});

checkboxes.forEach(cb => cb.addEventListener('click', () => {
  if(checkboxes.filter(cb => cb.checked).length === 0) {
    cb.checked = true;
    alert("You must select one to get password!!!");
  }

  getPassword();
}));

const copy = () => {
  navigator.clipboard.writeText(text.value)
    .then(() => {
      alert("Copied to Clipboard!");
    })
    .catch((err) => {
      alert("Failed to Copy! " + err);
    });
}

const reload = () => {
  getPassword();
}

getPassword();
