import renderer from "./views.js";

localStorage.removeItem("name");
localStorage.removeItem("school");
localStorage.removeItem("score");
localStorage.removeItem("difficulty");
renderer.landing_page();
