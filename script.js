const menuBtn = document.querySelector('#menu-btn');
const menu = document.querySelector('#category-menu');
const addBtn = document.querySelector('#add-btn');
const addContainer = document.querySelector('#add-container')
const submit = document.querySelector('#submit');
const taskName = document.querySelector('#task-name');
const dueDate = document.querySelector('#due-date');
const list = document.querySelector('#list');
const time = document.querySelector('#time');
const greeting = document.querySelector('#greeting');
const difficulty = document.querySelector('#difficulty');
const difficultyFilters = document.querySelectorAll('.category p');
const title = document.querySelector('#title');


daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octorber', 'November', 'December'];

// declare list of tasks
let tasksList = getTasksList();

// declare filtered list of tasks
let easyTasksList = getEasyTasks();
let mediumTasksList = getMediumTasks();
let hardTasksList = getHardTasks();

// current display list
let currentDisplayList = 'all';

// display initial time, greeting and update every second
displayTimeAndGreeting()
setInterval(displayTimeAndGreeting, 1000);

// update time of each task every second
setInterval(updateTaskTime, 1000);

// generate unique ID 
function uniqueID() {
    return Math.floor(Math.random() * Date.now())
}

// create existing tasks
tasksList.forEach(task => {
    createTask(task);
});
addCheckBoxesEventListener();

// get tasks from localStorage
function getTasksList() {
    const tasksList = JSON.parse(localStorage.getItem('tasksList'));
    return tasksList === null ? [] : tasksList;
}

//get easy tasks list from localStorage
function getEasyTasks() {
    const easyTasksList = JSON.parse(localStorage.getItem('easyTasksList'));
    return easyTasksList === null ? [] : easyTasksList;
}

//get medium tasks list from localStorage
function getMediumTasks() {
    const mediumTasksList = JSON.parse(localStorage.getItem('mediumTasksList'));
    return mediumTasksList === null ? [] : mediumTasksList;
}

//get hard tasks list from localStorage
function getHardTasks() {
    const hardTasksList = JSON.parse(localStorage.getItem('hardTasksList'));
    return hardTasksList === null ? [] : hardTasksList;
}

// display current time and greeting
function displayTimeAndGreeting() {
    // display day and time
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    const today = date.getDay();
    const dd = date.getDate();
    const mm = date.getMonth();
    const yyyy = date.getUTCFullYear();
    time.innerHTML = `
        <p>${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}</p>
        <small>${daysOfWeek[today]}, ${dd} ${months[mm]} ${yyyy}</small>
    `;

    // display greeting
    if (h > 6 && h < 11) {
        greeting.textContent = `Good Morning!`
    } else if (h >= 11 && h < 18) {
        greeting.textContent = `Good Afternoon!`
    } else if (h >= 18 && h < 23) {
        greeting.textContent = `Good Evening!`
    } else if (h >= 23 || h >= 0) {
        greeting.textContent = `Good Night!`
    }
}

// update time left of each task
function updateTaskTime() {
    const tasks = document.querySelectorAll('.task')
    tasks.forEach(task => {
        const dueDate = task.getAttribute('dueDate');
        const day = new Date(dueDate);
        const today = new Date();
        const timeDiff = timeDiffCalc(task.getAttribute('dueDate'));
        task.querySelector('#days').innerHTML = calcTime(timeDiff)[0];
        task.querySelector('#hours').innerHTML = calcTime(timeDiff)[1];
        task.querySelector('#minutes').innerHTML = calcTime(timeDiff)[2];
        task.querySelector('#seconds').innerHTML = calcTime(timeDiff)[3];
    });
}

// open and close category menu
function toggleCategoryMenu() {
    menu.classList.toggle('show');
    menuBtn.classList.toggle('show');

    // change arrow
    if (menuBtn.querySelector('i').classList.contains('fa-arrow-right')) {
        menuBtn.querySelector('i').className = 'fas fa-arrow-left';
    } else {
        menuBtn.querySelector('i').className = 'fas fa-arrow-right';
    }
}

// open add container
function openAdd() {
    addContainer.classList.add('show');
}

// close add container
function closeAdd() {
    addContainer.classList.remove('show');
}

// return an array of [days, hours, minutes, seconds] calculated from timeDiff
function calcTime(timeDiff) {
    let d = Math.floor((timeDiff * Math.pow(10, -3)) / (60 * 60 * 24));
    let h = Math.floor((timeDiff * Math.pow(10, -3)) / (60 * 60)) % 24;
    let m = Math.floor((timeDiff * Math.pow(10, -3)) / (60)) % 60;
    let s = Math.floor((timeDiff * Math.pow(10, -3))) % 60;
    d < 10 ? d = '0' + d : d;
    h < 10 ? h = '0' + h : h;
    m < 10 ? m = '0' + m : m;
    s < 10 ? s = '0' + s : s;
    return [d, h, m, s];
}

// true if time1 is later
function compareTime(time1, time2) {
    return new Date(time1) > new Date(time2); // true if time1 is later
}

// calculate time diff
function timeDiffCalc(date) {
    const d = new Date(date);
    const today = new Date();
    return d.getTime() - today.getTime();
}

// create task and display to DOM
function createTask(task) {
    // create task element
    const taskEl = document.createElement('li');
    taskEl.classList.add('task');
    taskEl.setAttribute('dueDate', task.dueDate);
    taskEl.setAttribute('id', task.id);
    taskEl.setAttribute('uniqueID', task.uniqueID);
    taskEl.setAttribute('difficulty', task.difficulty);
    taskEl.innerHTML = `
        <span class="id">${task.id}</span>
        <div class="draggable" draggable="true">
            <h4 class="task-name">${task.taskName}</h4>
            <small class="task-difficulty ${task.difficulty}">${task.difficulty}</small>
            <span class="time-left">
                <div>
                    <h4 id="days">${calcTime(timeDiffCalc(task.dueDate))[0]}</h4>
                    <small>days</small>
                </div>
                <div>
                    <h4 id="hours">${calcTime(timeDiffCalc(task.dueDate))[1]}</h4>
                    <small>hrs</small>
                </div>
                <div>
                    <h4 id="minutes">${calcTime(timeDiffCalc(task.dueDate))[2]}</h4>
                    <small>mins</small>
                </div>
                <div>
                    <h4 id="seconds">${calcTime(timeDiffCalc(task.dueDate))[3]}</h4>
                    <small>secs</small>
                </div>
            </span>
            <input type="checkbox" class="check-box">
            <i class="fas fa-grip-vertical"></i>
        </div>
    `;
    // display to DOM
    list.appendChild(taskEl);
    // clear input
    taskName.value = '';
    dueDate.value = '';
    difficulty.value = 'easy';

    addEventListeners();
}

// save data of submitted task
function submitForm(taskName, difficulty, dueDate) {
    const task = {
        taskName,
        dueDate,
        difficulty,
        uniqueID: uniqueID(),
        id: tasksList.length + 1
    };
    createTask(task);
    // push to list and localStorage
    tasksList.push(task);
    if (task.difficulty === 'easy') {
        easyTasksList.push(task);
    } else if (task.difficulty === 'medium') {
        mediumTasksList.push(task);
    } else if (task.difficulty === 'hard') {
        hardTasksList.push(task);
    }

    addCheckBoxEventListener();

    localStorage.setItem('tasksList', JSON.stringify(tasksList));
    localStorage.setItem('easyTasksList', JSON.stringify(easyTasksList));
    localStorage.setItem('mediumTasksList', JSON.stringify(mediumTasksList));
    localStorage.setItem('hardTasksList', JSON.stringify(hardTasksList));
    // close add container
    closeAdd();
}

// declare drag index
let dragStartUniqueID;
let dragStartDifficulty;

// drag functions
function dragStart(e) {
    // console.log('event: ', 'dragStart');
    // this is the item that we drag
    dragStartUniqueID = +this.closest('li').getAttribute('uniqueID');
    dragStartDifficulty = this.closest('li').getAttribute('difficulty');
}

function dragEnter(e) {
    // console.log('event: ', 'dragEnter');
    // this is the item that we drag through
    this.classList.add('over');
}

function dragOver(e) {
    // console.log('event: ', 'dragOver');
    e.preventDefault();
}

function dragDrop(e) {
    // console.log('event: ', 'dragDrop');
    // this is the item that we drag through
    const dragEndUniqueID = +this.getAttribute('uniqueID');
    // swap 2 items in the all tasks list and update localStorage
    swapItems(dragStartUniqueID, dragEndUniqueID, tasksList);
    localStorage.setItem('tasksList', JSON.stringify(tasksList));
    const difficulty = this.getAttribute('difficulty');
    // if 2 items have the same difficulty, swap them in their difficulty list and update to localStorage
    if (difficulty === dragStartDifficulty) {
        if (difficulty === 'easy') {
            swapItems(dragStartUniqueID, dragEndUniqueID, easyTasksList);
            
        } else if (difficulty === 'medium') {
            swapItems(dragStartUniqueID, dragEndUniqueID, mediumTasksList);
            localStorage.setItem('mediumTasksList', JSON.stringify(mediumTasksList));
        } else if (difficulty === 'hard') {
            swapItems(dragStartUniqueID, dragEndUniqueID, hardTasksList);
            localStorage.setItem('hardTasksList', JSON.stringify(hardTasksList));
        }
    // if 2 items have the different difficulty, update their orders in their difficulty list and update to localStorage
    } else if (difficulty !== dragStartDifficulty) {
        easyTasksList = tasksList.filter(task => task.difficulty === 'easy');
        localStorage.setItem('easyTasksList', JSON.stringify(easyTasksList));
        mediumTasksList = tasksList.filter(task => task.difficulty === 'medium');
        localStorage.setItem('mediumTasksList', JSON.stringify(mediumTasksList));
        hardTasksList = tasksList.filter(task => task.difficulty === 'hard');
        localStorage.setItem('hardTasksList', JSON.stringify(hardTasksList));        
    }
    // display based on current list
    if (currentDisplayList === 'easy') {
        displayWithDelay(easyTasksList);
    } else if (currentDisplayList === 'medium') {
        displayWithDelay(mediumTasksList);
    } else if (currentDisplayList === 'hard') {
        displayWithDelay(hardTasksList);
    } else if (currentDisplayList === 'all') {
        displayWithDelay(tasksList);
    }


    this.classList.remove('over');
}

function dragLeave(e) {
    // console.log('event: ', 'dragLeave');
    // this is the item that we drag through
    this.classList.remove('over');
}

function swapItems(fromUniqueID, toUniqueID, tasksList) {
    // get index of 2 items
    const itemOneIndex = tasksList.indexOf(tasksList.filter(task => task.uniqueID == fromUniqueID)[0]);
    const itemTwoIndex = tasksList.indexOf(tasksList.filter(task => task.uniqueID == toUniqueID)[0]);
    // swap 2 items in list
    const tempTask = tasksList[itemOneIndex];
    tasksList[itemOneIndex] = tasksList[itemTwoIndex];
    tasksList[itemTwoIndex] = tempTask;
    // update their id in list
    tasksList[itemOneIndex].id = itemOneIndex + 1;
    tasksList[itemTwoIndex].id = itemTwoIndex + 1;
}

// display tasks after 0.3s delay
function displayWithDelay(tasksList) {
    setTimeout(() => {
        list.innerHTML = '';
        tasksList.forEach(task => {
            createTask(task);
        })
        addCheckBoxesEventListener();
    }, 300);
    
}

// delete the task
function deleteTask(e, listOfTasks) {
    // get the parent element
    const taskEl = e.target.parentElement.parentElement;
    // get the id of the task that user want to delete
    const uniqueID = taskEl.getAttribute('uniqueID');
    const deleteTask = listOfTasks.filter(task => task.uniqueID == uniqueID);
    const index = listOfTasks.indexOf(deleteTask[0]);
    // delete it from listOfTasks
    listOfTasks.splice(index, 1);
    // update id of remaining task
    listOfTasks.forEach((task, index) => {
        task.id = index + 1;
    })
}

// update id of each task 
function updateID(tasksList) {
    tasksList.forEach((task, index) => {
        task.id = index + 1;
    })
}

// display by difficulty
function displayByDifficulty(e) {
    if (e.target.classList.contains('all')) {
        // display the add button
        addBtn.style.display = 'block';
        title.innerText = `ALL`;
        title.className = 'title-header';
        currentDisplayList = 'all';
        updateID(tasksList);
        setTimeout(() => {
            list.innerHTML = '';
            tasksList.forEach(task => {
                createTask(task);
            })
        }, 300);
    } else if (e.target.className === 'easy'){
        // hide the add button
        addBtn.style.display = 'none';
        title.innerText = `EASY`;
        title.className = 'title-header easy';
        updateID(easyTasksList);
        displayWithDelay(easyTasksList);
        currentDisplayList = 'easy';
        // update localStorage
        localStorage.setItem('easyTasksList', JSON.stringify(easyTasksList));
    } else if (e.target.className === 'medium'){
        // hide the add button
        addBtn.style.display = 'none';
        title.innerText = `MEDIUM`;
        title.className = 'title-header medium';
        updateID(mediumTasksList);
        displayWithDelay(mediumTasksList);
        currentDisplayList = 'medium';
        // update localStorage
        localStorage.setItem('mediumTasksList', JSON.stringify(mediumTasksList));
    } else if (e.target.className === 'hard'){
        // hide the add button
        addBtn.style.display = 'none';
        title.innerText = `HARD`;
        title.className = 'title-header hard';
        updateID(hardTasksList);
        displayWithDelay(hardTasksList);
        currentDisplayList = 'hard';
        // update localStorage
        localStorage.setItem('hardTasksList', JSON.stringify(hardTasksList));
    }
}

// eventlisteners
menuBtn.addEventListener('click', toggleCategoryMenu);
addBtn.addEventListener('click', openAdd);
window.addEventListener('click', (e) => {
    if (e.target === addContainer) {
        // clear input
        taskName.value = '';
        dueDate.value = '';
        difficulty.value = 'easy';
        closeAdd()
    } else {
        return false;
    }
})
submit.addEventListener('click', (e) => {
    e.preventDefault();
    taskName.classList.remove('wrong');
    dueDate.classList.remove('wrong');
    // check flag
    let flag = true;
    // check taskName
    if (taskName.value.trim() === '') {
        flag = false;
        taskName.classList.add('wrong');

    }
    // check time diff
    const diff = timeDiffCalc(dueDate.value);
    if (diff < 0 || isNaN(diff)) {
        flag = false;
        dueDate.classList.add('wrong');
    }
    // submit form
    if (flag) {
        submitForm(taskName.value.trim(), difficulty.value, dueDate.value);
    }
});
difficultyFilters.forEach(filter => {
    filter.addEventListener('click', displayByDifficulty);
})

// add drag eventlisteners
function addEventListeners() {
    const draggables = document.querySelectorAll('.draggable');
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
    });

    const dragListItems = document.querySelectorAll('.list li');
    dragListItems.forEach(item => {
        item.addEventListener('dragover', dragOver);
        item.addEventListener('drop', dragDrop);
        item.addEventListener('dragenter', dragEnter);
        item.addEventListener('dragleave', dragLeave);
    });
}

// add checkbox's eventlistener
function checkBoxEventListener(checkBox) {
    checkBox.addEventListener('change', (e) => {
        // delete in the all tasks list and update to localStorage
        deleteTask(e, tasksList);
        localStorage.setItem('tasksList', JSON.stringify(tasksList));
        // get the parent element
        const taskEl = e.target.parentElement.parentElement;
        const difficulty = taskEl.getAttribute('difficulty');
        // delete in their difficulty list and update to localStorage
        if (difficulty === 'easy') {
            deleteTask(e, easyTasksList);
            localStorage.setItem('easyTasksList', JSON.stringify(easyTasksList));
        } else if (difficulty === 'medium') {
            deleteTask(e, mediumTasksList);
            localStorage.setItem('mediumTasksList', JSON.stringify(mediumTasksList));
        } else if (difficulty === 'hard') {
            deleteTask(e, hardTasksList);
            localStorage.setItem('hardTasksList', JSON.stringify(hardTasksList));
        }
        // display based on current list
        if (currentDisplayList === 'easy') {
            displayWithDelay(easyTasksList);
        } else if (currentDisplayList === 'medium') {
            displayWithDelay(mediumTasksList);
        } else if (currentDisplayList === 'hard') {
            displayWithDelay(hardTasksList);
        } else if (currentDisplayList === 'all') {
            displayWithDelay(tasksList);
        }
    })
}

// add checkbox's eventlistener when adding new task
function addCheckBoxEventListener() {
    document.querySelectorAll('.check-box').forEach((checkBox, index) => {
        if (index == tasksList.length - 1) {
            checkBoxEventListener(checkBox);
        }
    });
}

// add check boxes' eventlistener when displaying a new list
function addCheckBoxesEventListener() {
    document.querySelectorAll('.check-box').forEach((checkBox) => {
        checkBoxEventListener(checkBox);
    });
}