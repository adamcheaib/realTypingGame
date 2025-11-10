import renderer from "./views.js";

localStorage.removeItem("name");
localStorage.removeItem("school");
localStorage.removeItem("score");
localStorage.removeItem("difficulty");
renderer.landing_page();
// renderer.leaderboard();
fetch("http://localhost:1234/leaderboard").then(r => r.json()).then(console.log)