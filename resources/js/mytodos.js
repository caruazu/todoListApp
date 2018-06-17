/* jshint esversion: 6 */

/*
Function that create our empty data and
push one first item 'todoList' to it.
This make sure that old users will not
lose their old to-do list
*/
function createData() {
    "use strict";

    let array_list = [];
    array_list.push('todoList');

    return array_list;
}

//Create our data to storage our to-do lists on the local storage
var data = (localStorage.getItem('myTodosList')) ? JSON.parse(localStorage.getItem('myTodosList'))
    : createData();

/*
Function that update the local storage with the data object
*/
function localStorageUpdated() {
    "use strict";

    localStorage.setItem('myTodosList', JSON.stringify(data));
}

//Remove icon in SVG format
var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6L16.3,18.7L16.3,18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8C7.4,10.2,7.7,10,8,10c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';

/*
Function that remove all to-do itens from the @list param
*/
function removeTodoFromLocalStorage(list) {
    "use strict";
    list = list.replace(/ /g, '');

    localStorage.removeItem(list);
}

/*
Function that remove the item we passed into
*/
function removeItem(target) {
    "use strict";

    var item = target.parentNode.parentNode;
    var parent = item.parentNode;
    var value = item.innerText;

    data.splice(data.indexOf(value), 1);

    localStorageUpdated();
    removeTodoFromLocalStorage(value);

    parent.removeChild(item);
}

/*
Function that pop-up a confirm allert to
make sure that the user really want to
remove the item from the list
*/
function confirmRemoveAllert() {
    "use strict";

    swal({
        title: "Are you sure?",
        text: "Are you sure you want to delete this todo list?",
        icon: "warning",
        buttons: ["Oh no!", "Delete"],
        dangerMode: true,
        className: "swal-wide"
    })
        .then((willDelete) => {
            if (willDelete) {
                removeItem(this);
                swal("Poof! Your todo list has been deleted!", {
                    icon: "success",
                    className: "swal-wide"
                });
            }
        });
}

//Adds a new item to the my to-dos list
function addItemToDOM(text) {
    "use strict";

    var list = document.getElementById('myTodos');

    var item = document.createElement('li');

    var link = document.createElement('a');
    link.innerText = text;
    link.href = "todo.html?list=" + text.replace(/ /g, '');

    var buttons = document.createElement('div');
    buttons.classList.add('buttons');

    var remove = document.createElement('button');
    remove.classList.add('remove');
    remove.innerHTML = removeSVG;
    //Add a click event for removing the item
    remove.addEventListener('click', confirmRemoveAllert);


    buttons.appendChild(remove);
    item.appendChild(link);
    item.appendChild(buttons);
    list.insertBefore(item, list.childNodes[0]);

}

/*
Function that uses the data object to
render the to-dos list on the screen
*/
function renderTodosList() {
    "use strict";

    //If the data is empty do nothing
    if (!data.length) {
        return;
    }

    //Render the to-dos list on the screen
    for (let i = 0; i < data.length; i += 1) {
        let value = data[i];
        addItemToDOM(value);
    }
}

//Render the to-dos lists on the screen
renderTodosList();


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
        addItemToDOM(value);

        document.getElementById('item').value = '';

        data.push(value);

        localStorageUpdated();
    }

    showMenuBar();
});

var inputItem = document.getElementById('item');

inputItem.addEventListener('mouseover', hideMenuBar);
inputItem.addEventListener('mouseout', showMenuBar);