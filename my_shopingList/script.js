window.addEventListener('DOMContentLoaded', ()=>{
    
    // adding new task
    const submitTask = document.querySelector('.submit-task');
    const taskInput = document.querySelector('.new-input');
    const tasksList = document.querySelector('.tasks-list');
    const emptyListMsg = document.querySelector('.empty-msg');
    const filterItems = document.querySelector('.filter-input');
    const clearItems = document.querySelector('.clear');
    // localStorage Functions
    function getItemsFromStorage(){
        let tasks = localStorage.getItem('tasks');
        if(!tasks){
            tasks = [];
        }else{
            tasks = JSON.parse(tasks);
        }
        return tasks
    }
    // removeItemsFromStorage
    function removeItemsFromStorage(target){
        let tasks = getItemsFromStorage();
        tasks = tasks.filter(task => task !== target);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    function addItemToStorage(item){
        let tasks = getItemsFromStorage();
        tasks.push(item);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    function updateStorage(oldItem, newItem){
        let tasks = getItemsFromStorage();
        tasks[tasks.indexOf(oldItem)] = newItem;
        console.log(tasks);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function checkUI(){
        if(tasksList.children.length === 1){
            filterItems.style.display = 'none';
            clearItems.style.display = 'none';
            emptyListMsg.style.display = 'block';
        }else{
            filterItems.style.display = 'block';
            clearItems.style.display = 'block';
            emptyListMsg.style.display = 'none';
        }
    }
    function createTask(value){
        // create new task box and add it to the DOM
        const newTaskContainer = document.createElement('li');
        newTaskContainer.className = 'task-box';

        newTaskContainer.innerHTML = `
            <p class="task-title">${value}</p>
            <button class="remove-task"><i class="fa-solid fa-xmark"></i></button>
        `;

        return newTaskContainer;
    }
    //remove task handler
    function removeTask(event){
        const clickedBtn = event.target.tagName ==='BUTTON'? event.target : event.target.parentElement;
        const targetTask = clickedBtn.parentElement;
        const taskValue = targetTask.firstElementChild.textContent;
        localStorage.removeItem(targetTask.firstElementChild.textContent);
        const userTasks = localStorage.getItem('tasks').split(',');
        userTasks.splice(userTasks.indexOf(taskValue),1);
        localStorage.setItem('tasks', userTasks.toString());
        targetTask.remove();
        checkUI();
    }
    //update event handlers
    function editMode(event){
        const targetTask = event.target.className === 'task-title'
                ? event.target.parentElement
                : event.target;

        function createUpdateForm(oldValue){
    
            const newForm = document.createElement("form");
            newForm.className = "full-width update-form";
    
            const newInput = document.createElement('input');
            newInput.type = 'text';
            newInput.name = "updatedVal";
            newInput.value = oldValue;
            newInput.className = "update-task-input";
    
            const submitBtn = document.createElement('button');
            submitBtn.className = "update-task-btn";
            submitBtn.type = "submit";
            // inserting svg icon to the update Btn:
            function createSvgElement(tag, attrs) {
                const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
                for (let key in attrs) el.setAttribute(key, attrs[key]);
                return el;
            }

            const newSVG = createSvgElement('svg',{
                class: "update-task-btn",
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                fill: "currentColor",
                viewBox: "0 0 24 24"
            });
            const newPath = createSvgElement('path',{
                d: "M17.65 6.35A7.95 7.95 0 0 0 12 4V1L7 6l5 5V7c2.76 0 5 2.24 5 5s-2.24 5-5 5a5.002 5.002 0 0 1-4.9-4H5.02a7.003 7.003 0 0 0 6.98 6 7 7 0 0 0 5.65-11.65z"
            });
            newSVG.appendChild(newPath);
            submitBtn.appendChild(newSVG);

            newForm.appendChild(newInput);
            newForm.appendChild(submitBtn);
    
            //prevent page reload
            newForm.onsubmit = event => {
                event.preventDefault();
                submitBtn.click();
                newInput.value = '';
            }
            return newForm;
        }
        const oldTask = targetTask.firstElementChild.textContent;
        const newForm = createUpdateForm(oldTask);
        targetTask.innerHTML = '';
        targetTask.appendChild(newForm);
        targetTask.firstElementChild.firstElementChild.select();
        targetTask.dataset.oldvalue = oldTask;
        console.log(targetTask.dataset.oldvalue);
        return oldTask;
    }

    function updateTask(event, oldTaskValue){

        const targetTask = event.target.className === 'update-task-btn'
            ? event.target.parentElement.parentElement
            : event.target.parentElement.parentElement.parentElement;

        const newTaskValue = targetTask.querySelector('input').value;
        const updatedTask = createTask(newTaskValue);
        console.log(oldTaskValue);
        updateStorage(oldTaskValue, newTaskValue);
        targetTask.replaceWith(updatedTask);
        
    }
    
    //display items from localStorage
    const userTasks = getItemsFromStorage();
    userTasks.forEach(task=>{
        const newTask = createTask(task);
        tasksList.appendChild(newTask);
    })

    document.querySelector('.add-form').addEventListener('submit', (e)=>{
        e.preventDefault();
        const newTask = taskInput.value;
        taskInput.value = "";

        const newTaskItem = createTask(newTask);
        tasksList.appendChild(newTaskItem);

        addItemToStorage(newTask);
        checkUI();
    })

    tasksList.addEventListener('click',(event)=>{
        // remove button click event
        const removeBtnIsClicked = event.target.parentElement.className === 'remove-task' || event.target.className === 'remove-task';
        removeBtnIsClicked && removeTask(event);

        // update task event
        // change to edit-mode when task body is clicked
        const switchToEditMode = event.target.className === 'task-title' || event.target.className === 'task-box';
        if(switchToEditMode){
            editMode(event);
        };

        // update task button click event
        const updateBtnClicked = event.target.classList.contains("update-task-btn");
        if(updateBtnClicked){
            console.log(event.target.parentElement.parentElement);
            const oldTaskValue = event.target.parentElement.parentElement.dataset.oldvalue;

            updateTask(event,oldTaskValue);
        }

    })
    function filterTasks(event){
        tasksList.querySelectorAll('.task-box').forEach((task)=>{
            const isMatch = task.querySelector(':nth-child(1)').innerText.includes(event.target.value);
            task.style.display = isMatch? 'flex': 'none';
        })
    }
    document.querySelector('.filter-input').addEventListener('input',filterTasks);
    checkUI();

})
