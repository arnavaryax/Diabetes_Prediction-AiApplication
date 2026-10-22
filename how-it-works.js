/* =========================================================
   HOW IT WORKS
========================================================= */


/* ---------------------------------------------------------
   NAVBAR SCROLL EFFECT
--------------------------------------------------------- */

const navbar =
    document.querySelector(".navbar");


window.addEventListener(
    "scroll",
    () => {

        if (
            window.scrollY > 20
        ) {

            navbar.style.boxShadow = `
                inset 0 1px 0 rgba(255,255,255,.95),
                0 20px 55px rgba(57,96,137,.15)
            `;

        } else {

            navbar.style.boxShadow = `
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



/* ---------------------------------------------------------
   SUBTLE CARD TILT
--------------------------------------------------------- */

const cards =
    document.querySelectorAll(
        ".workflow-card, .dataset-card, .comparison-card"
    );


cards.forEach(
    (card) => {

        card.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                const rotateY =
                    ((x / rect.width) - .5) * 1.4;


                const rotateX =
                    ((y / rect.height) - .5) * -1.4;


                card.style.transform = `
                    translateY(-4px)
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                `;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "";

            }
        );

    }
);