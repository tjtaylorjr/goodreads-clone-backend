import { createAddToShelfDropdown } from './add-to-shelf-dropdown.js'

const populateDropDown = async (bookTitle, bookAuthor, bookDescription, bookPublicationYear, bookId, bookshelfId) => {
    let bookTitleBlock = document.querySelector('.bookshelf-books__book-title');
    let bookAuthorBlock = document.querySelector('.bookshelf-books__book-author');
    let bookDescriptionBlock = document.querySelector('.bookshelf-books__book-description')
    bookTitleBlock.innerHTML = bookTitle;
    bookAuthorBlock.innerHTML = bookAuthor;
    bookDescriptionBlock.innerHTML = bookDescription;

    const addToShelfDropdown = await createAddToShelfDropdown(bookId, bookshelfId);
    console.log('addToShelfDropdown = ', addToShelfDropdown)
    bookTitleBlock.appendChild(addToShelfDropdown);
}

export const dropDownBookInfo = async(Book, bookshelfId) => {

    //need authorization header to access user shelves for when user is redirected to my-books page
    //after login or sign-up since requireAuth was added to frontend user route
    const res = await fetch(`/api-user/shelves/${bookshelfId}/books/${Book.id}`, {
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
        
    const { book } = await res.json();

    // console.log(bookInfo.book);
    const bookTitle = book.title;
    const bookAuthor = book.author;
    const bookDescription = book.description
    const bookPublicationYear = book.publicationYear

    populateDropDown(bookTitle, bookAuthor, bookDescription, bookPublicationYear, Book.id, bookshelfId);
    // console.log(bookTitle, bookAuthor, bookDescription, bookPublicationYear);
}

