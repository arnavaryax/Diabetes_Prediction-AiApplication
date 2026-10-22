/* =========================================
   DISCLAIMER PAGE
   ========================================= */

const navbar = document.querySelector(".navbar");


/* Navbar shadow on scroll */

window.addEventListener("scroll", () => {

    if (window.scrollY > 20) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});


/* Subtle liquid-glass card movement */

const cards = document.querySelectorAll(".disclaimer-card");

cards.forEach((card) => {

    card.addEventListener("mousemove", (event) => {

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const rotateX =
            ((y / rect.height) - 0.5) * -2;

        const rotateY =
            ((x / rect.width) - 0.5) * 2;

        card.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-5px)`;

    });


    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});