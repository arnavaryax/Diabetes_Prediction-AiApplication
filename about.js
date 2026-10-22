/* =========================================================
   ABOUT PAGE
========================================================= */

const navbar =
    document.querySelector(".navbar");


window.addEventListener(
    "scroll",
    () => {

        if (
            window.scrollY > 20
        ) {

            navbar.style.boxShadow =
                `
                inset 0 1px 0 rgba(255,255,255,.95),
                0 20px 55px rgba(57,96,137,.15)
                `;

        }

        else {

            navbar.style.boxShadow =
                `
                inset 0 1px 0 rgba(255,255,255,.95),
                inset 0 -1px 0 rgba(255,255,255,.25),
                0 24px 70px rgba(57,96,137,.13)
                `;

        }

    },
    {
        passive: true
    }
);