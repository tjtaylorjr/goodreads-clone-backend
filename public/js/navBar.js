
const logoutButton = document.querySelector('.logout__button');

logoutButton.addEventListener('click', () => {
    console.log('clicked logout')
    localStorage.removeItem("BADREADS_ACCESS_TOKEN");
    localStorage.removeItem("BADREADS_CURRENT_USER_ID");
    window.location.href = "/";
});
