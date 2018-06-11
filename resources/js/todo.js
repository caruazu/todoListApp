/*
Function that return the @name get param on the @url
*/
function gup(name, url) {
    "use strict";

    if (!url) {
        url = location.href;
    }

    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results === null
        ? null
        : results[1];
}

//Create our list_name that takes the "list" get param or use 'todoList' as default
var list_name = (gup('list', location))
    ? gup('list', location)
    : 'todoList';


//Create our data to storage our to-do lists and completed lists on the local storage
var data = (localStorage.getItem(list_name))
    ? JSON.parse(localStorage.getItem(list_name))
    : {
        todo: [],
        complete: []
    };

//Remove and complete icons in SVG format
var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6L16.3,18.7L16.3,18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8C7.4,10.2,7.7,10,8,10c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

/*
Function that update the local storage with the data object
*/
function localStorageUpdated() {
    "use strict";

    localStorage.setItem(list_name, JSON.stringify(data));
}

/*
Function that remove the item we passed into
*/
function removeItem(target) {
    "use strict";

    var item = target.parentNode.parentNode;
    var parent = item.parentNode;
    var id = parent.id;
    var value = item.innerText;

    if (id === 'todo') {
        data.todo.splice(data.todo.indexOf(value), 1);
    } else {
        data.complete.splice(data.complete.indexOf(value), 1);
    }

    localStorageUpdated();

    parent.removeChild(item);
}

/*
Function that pop-up a confirm allert to
make sure that the user really want to
remove the item from the list
*/
function confirmRemove() {
    "use strict";

    swal({
        title: "Are you sure?",
        text: "Are you sure you want to delete this todo?",
        icon: "warning",
        buttons: ["Oh no!", "Delete"],
        dangerMode: true,
        className: "swal-wide"
    })
        .then((willDelete) => {
            if (willDelete) {
                removeItem(this);
                swal("Poof! Your todo has been deleted!", {
                    icon: "success",
                    className: "swal-wide"
                });
            }
        });
}

/*
Function that complete the to-do item or uncomplete the completed item
*/
function completeItem() {
    "use strict";

    var item = this.parentNode.parentNode;
    var parent = item.parentNode;
    var id = parent.id;
    var value = item.innerText;

    if (id === 'todo') {
        data.todo.splice(data.todo.indexOf(value), 1);
        data.complete.push(value);
    } else {
        data.complete.splice(data.complete.indexOf(value), 1);
        data.todo.push(value);
    }

    localStorageUpdated();

    //Check if the item should be added to the completed list or re-added to the to-do list
    var target = (id === 'todo')
        ? document.getElementById('completed')
        : document.getElementById('todo');

    parent.removeChild(item);
    target.insertBefore(item, target.childNodes[0]);
}

//Adds a new item to the to-do list
function addItemToDOM(text, completed) {
    "use strict";

    var list = (completed)
        ? document.getElementById('completed')
        : document.getElementById('todo');

    var item = document.createElement('li');
    item.innerText = text;

    var buttons = document.createElement('div');
    buttons.classList.add('buttons');

    var remove = document.createElement('button');
    remove.classList.add('remove');
    remove.innerHTML = removeSVG;
    //Add a click event for removing the item
    remove.addEventListener('click', confirmRemove);

    var complete = document.createElement('button');
    complete.classList.add("complete");
    complete.innerHTML = completeSVG;
    //Add a click event for completing the item
    complete.addEventListener('click', completeItem);

    buttons.appendChild(remove);
    buttons.appendChild(complete);
    item.appendChild(buttons);

    list.insertBefore(item, list.childNodes[0]);
}


/*
Function that uses the data object to
render the to-do and completed lists on
the screen
*/
function renderTodoList() {
    "use strict";

    var i;
    var value;

    //If the data is empty do nothing
    if (!data.todo.length && !data.complete.length) {
        return;
    }

    //Render the to-do list on the screen
    for (i = 0; i < data.todo.length; i += 1) {
        value = data.todo[i];
        addItemToDOM(value);
    }

    //Render the completed list on the screen
    for (i = 0; i < data.complete.length; i += 1) {
        value = data.complete[i];
        addItemToDOM(value, true);
    }
}

//Render the to-do and completed lists on the screen
renderTodoList();

/*
Create an event listener that creates a
to-do item whenever an user press enter
*/
document.getElementById("item").addEventListener("keyup", function (event) {
    "use strict";
    //Trigger the button if enter is pressed
    if (event.keyCode === 13) {
        document.getElementById("add").click();
    }
});


function hideMenuBar() {
    "use strict";

    var footer = document.getElementById('footer');

    footer.setAttribute('style', 'display: none;');
}

function showMenuBar() {
    "use strict";

    var footer = document.getElementById('footer');

    footer.setAttribute('style', 'display: block;');
}

/*
Create an event listener thar create a to-do
list whenever a user click on the button
and the input field is not empty
*/
document.getElementById("add").addEventListener("click", function () {
    "use strict";
    var value = document.getElementById("item").value;

    //If the input field is not empty
    if (value) {
        //Create a to-do item
        addItemToDOM(value);

        //Clean the input field
        document.getElementById('item').value = '';

        //Update the data object
        data.todo.push(value);

        //Update the local storage
        localStorageUpdated();
    }

    showMenuBar();
});

var item = document.getElementById('item');

item.addEventListener('mouseover', hideMenuBar);
item.addEventListener('mouseout', showMenuBar);
