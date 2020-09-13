export const createAddToShelfDropdown = async(bookId, hidden) => {
    const res = await fetch(`http://localhost:8080/api-user/excluded-shelves/books/${bookId}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "BADREADS_ACCESS_TOKEN"
          )}`,
        },
      });

    const bookshelves = await res.json();

    const dropdownForm = document.querySelector('#drop-down-form')
    const dropdownFormButton = document.querySelector('#drop-down-form__button');
    const dropdownFormSelect = document.querySelector('#drop-down-form__select');
    if(hidden) {
      dropdownForm.classList.remove('hidden');
    }
    console.log(bookshelves);
    console.log(dropdownFormSelect)
    if(bookshelves) {
        for (let shelf of bookshelves.allShelvesWithoutBook) {
            const option = new Option(shelf.name, shelf.id);
            option.classList = 'add-to-bookshelf-dropdown__option'
            dropdownFormSelect.appendChild(option);
        };
      }
    console.log(dropdownFormSelect)

    dropdownFormButton.addEventListener('click', async e => {
        e.preventDefault();

        var selector = dropdownFormSelect;
        var shelfId = selector[selector.selectedIndex].value;
        const bookshelfId = `${shelfId}`
        const body = { "bookshelfId": bookshelfId};
        const res = await fetch(`http://localhost:8080/api-user/${bookId}/add-book-to-shelf`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "BADREADS_ACCESS_TOKEN"
                  )}`,
                "Content-Type": "application/json"
            }
        });

        let {bookshelf, book}= await res.json()

        const overlay = document.querySelector('.overlay');
        overlay.classList.remove('overlay-hidden');
        overlay.innerHTML = `'${book.title}' added to your '${bookshelf.name}' shelf!`

        setTimeout(() => {
            overlay.classList.add('overlay-hidden');
        }, 3000)
    });

    return dropdownFormSelect;

};
