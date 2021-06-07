'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};
const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US'

}

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const accInfo = document.querySelector('.acc');

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal'
    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = ` ${day}/${month}/${year}`;
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

const calDisplayBallance = function (acc) {
  acc.ballance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.ballance} €`;

}
const createUsarName = function (accs) {
  accs.forEach(item => {
    item.usarname = item.owner
      .toLowerCase()
      .split(' ')
      .map(mov => mov[0])
      .join('');
  })
}
createUsarName(accounts);
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).
    reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`

  const outcomes = acc.movements.filter(mov => mov < 0).
    reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate) / 100).
    filter(mov => mov > 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${interest}€`;
};

let currentAccount;

const updateUi = function (acc) {
  // Display movemnts
  displayMovements(acc);
  // Display Ballance
  calDisplayBallance(acc);
  // Display summary
  calcDisplaySummary(acc);
}

// Event heandler
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  accInfo.style.opacity = 0;

  currentAccount = accounts.find(acc => acc.usarname === inputLoginUsername.value);


  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    // Display welcome message
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}!`
    // Display container
    containerApp.style.opacity = 100;
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = ` ${day}/${month}/${year},  ${hour}:${min}`;
    updateUi(currentAccount);
    startLogOutTimer();
  } else {
    alert('Incorrect Password Or UsarName!')
  }
})


// transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieveAcc = accounts.find(acc => acc.usarname === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    recieveAcc &&
    currentAccount.ballance >= amount &&
    recieveAcc?.usarname !== currentAccount.usarname) {
    // Doing The Transfer
    currentAccount.movements.push(-amount);
    recieveAcc.movements.push(amount);
    // Add transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    // recieveAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUi(currentAccount);
  }
})

// Close acc
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.usarname && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(e => e.usarname === currentAccount.usarname);
    // Delete acc
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
    accInfo.style.opacity = 100;
  }
  inputCloseUsername.value = inputClosePin.value = '';
})

// Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(move => move >= amount * 0.1)) {
    setTimeout(function () {

      // Add movement
      currentAccount.movements.push(amount);
      // Add Data
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUi(currentAccount);
    }, 2500);

    inputLoanAmount.value = '';
  }
})

let sorted = false;
// Sort 
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
})


const startLogOutTimer = function () {
  // Set time to 5 minutes
  let time = 300;

  // Call the timer every second
  const timer = setInterval(function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0)
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // Decrese 1s
    time--;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started'
      containerApp.style.opacity = 0;
    }
  }, 1000);
}

// Fake always logged in
// currentAccount = account1;
// updateUi(currentAccount);
// containerApp.style.opacity = 100;
const bankDepositSum = accounts.
  flatMap(acc => acc.movements).
  filter(x => x > 0).
  reduce((sum, cur) => sum + cur, 0);

console.log(bankDepositSum)


const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(x => x >= 1000).length

console.log(numDeposits1000)


const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce((sums, cur) => {
    cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;
    return sums;
  }, { deposits: 0, withdrawals: 0 })










