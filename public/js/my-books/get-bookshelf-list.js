import { populateBookshelfBookList } from './get-bookshelf-books.js'

// Get shelves
const getBookshelves = async () => {
    console.log('getting shelves');
    const res = await fetch('/api-user/shelves', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem(
                "BADREADS_ACCESS_TOKEN"
            )}`,
        },
    });

    //redirect user to login page if not logged in which is on the landing page path('/')
    if (res.status === 401) {
        window.location.href = "/";
        return;
    }

    const data = await res.json();
    // // console.log(data)
    return data;
};

// Create title with link to bookshelf
const appendBookshelfLi = (bookshelf) => {
    var li = document.createElement('li');
    li.innerHTML = `${bookshelf.name}`;
    li.className = 'bookshelf-list-item';
    const bookshelfList = document.querySelector('.bookshelf-list');
    li.addEventListener('click', () => populateBookshelfBookList(bookshelf.id))
    bookshelfList.appendChild(li);
    const addBookshelfButton = document.querySelector('#add-new-bookshelf__button');
};

const openCreateNewBookshelfField = async () => {
    console.log("calling open create new")
    const addBookshelfButton = document.querySelector('#add-new-bookshelf__button');

    const newBookshelfForm = document.querySelector('.add-bookshelf-form');
    const newBookshelfFormField = document.querySelector('#add-new-bookshelf__input-field')
    // Display form field
    newBookshelfFormField.classList.remove('hidden');

    // Change button type
    setTimeout(function () {
        addBookshelfButton.removeAttribute('type');
        addBookshelfButton.type = 'submit';
    }, 1000);

    addBookshelfButton.addEventListener('click', async e => {
        e.preventDefault();
        addBookshelfButton.disabled = true;
        const formData = new FormData(newBookshelfForm);
        const newBookshelfName = formData.get('newBookshelfName');

        const body = { newBookshelfName }

        const res = await fetch('http://localhost:8080/api-user/new-shelf', {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "BADREADS_ACCESS_TOKEN"
                )}`,
                "Content-Type": "application/json"
            }
        });


        //return newly created bookshelf
        const data = await res.json();
        const { bookshelf } = data;

        // console.log(bookshelf)
        appendBookshelfLi(bookshelf);
        newBookshelfFormField.classList.add('hidden');
    });

    setTimeout(() => {
        addBookshelfButton.type = 'button';
        addBookshelfButton.disabled = false;
    }, 1000);
};

export const populateUserBookshelfList = async () => {
    const { shelves, username } = await getBookshelves();

    var capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1)
    document.getElementById('welcome').innerHTML = `Welcome ${capitalizedUsername}!`
    console.log('username', capitalizedUsername);
    if (shelves) {
        for (let bookshelf of shelves) {
            // // console.log('bookshelf', bookshelf)
            appendBookshelfLi(bookshelf);
        }
    }

    const addBookshelfButton = document.querySelector('#add-new-bookshelf__button');
    addBookshelfButton.addEventListener("click", openCreateNewBookshelfField);
};
