document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('device-popup');
    const mobileBtn = document.getElementById('mobile-btn');
    const computerBtn = document.getElementById('computer-btn');
    const mainStylesheet = document.getElementById('main-stylesheet');

    // Check if user preference is already saved
    if (!localStorage.getItem('device-preference')) {
        popup.style.display = 'flex'; // Show popup
    } else {
        applyStylesheet(localStorage.getItem('device-preference'));
    }

    mobileBtn.addEventListener('click', function() {
        localStorage.setItem('device-preference', 'mobile');
        applyStylesheet('mobile');
        popup.style.display = 'none';
    });

    computerBtn.addEventListener('click', function() {
        localStorage.setItem('device-preference', 'computer');
        applyStylesheet('computer');
        popup.style.display = 'none';
    });

    function applyStylesheet(device) {
        if (device === 'mobile') {
            mainStylesheet.setAttribute('href', 'stylesv2.css');
        } else {
            mainStylesheet.setAttribute('href', 'styles.css');
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const goodbyePopup = document.getElementById('goodbye');
    const closeGoodbyeBtn = document.getElementById('close-goodbye-btn');

    // Function to show the goodbye popup
    function showGoodbyePopup() {
        goodbyePopup.style.display = 'flex';
    }

    // Function to close the goodbye popup
    function closeGoodbyePopup() {
        goodbyePopup.style.display = 'none';
    }

    // Show the goodbye popup for demo purposes
    // You can call this function when needed (e.g., on page load or a specific event)
    showGoodbyePopup();

    // Close the popup when the close button is clicked
    closeGoodbyeBtn.addEventListener('click', closeGoodbyePopup);
});
