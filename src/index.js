import Stop from "./stop";

const ctx = document.getElementById("canvas").getContext("2d");

const catalunya = new Stop(ctx, "catalunya", {x: 5, y: 5});
catalunya.render();

const urquinaona = new Stop(ctx, "urquinaona", {x: 15, y: 15}, catalunya);
urquinaona.render();
