import Route from "./route";

const ctx = document.getElementById("canvas").getContext("2d");

const route = {
    stops: [
        {
            id: "catalunya",
            position: {
                x: 10,
                y: 10
            }
        },
        {
            id: "urquinaona",
            position: {
                x: 15,
                y: 15
            }
        },
        {
            id: "arc-de-triomf",
            position: {
                x: 25,
                y: 25
            }
        },
        {
            id: "marina",
            position: {
                x: 35,
                y: 35
            }
        }
    ]
};

const red = new Route("1", route, "#FF0000");
red.start();

setInterval(() => {
    ctx.drawImage(red.render(), 500, 500);
}, 100);
