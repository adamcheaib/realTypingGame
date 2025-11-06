import {gameplay_text, add_score, select_difficulty, register_score_to_db} from "./game_data.js"

const renderer = {
    landing_page: render_user_input_page,
    gameplay: render_gameplay,
    leaderboard: render_leaderboard
}

const main_container = document.querySelector("main");

function render_user_input_page() {
    main_container.innerHTML = `
        <form class="landing_container">
            <img src="./media/cat_animation.gif" alt="">
            <div class="guide">
                <h2>Instruktioner</h2>
                <i>Du kommer att få en text på skärmen som du ska skriva av.</i>
                <ol>
                    <li>Du behöver inte tänka på stort eller litet bokstav</li>
                    <li>När du är färdig med ett ord så trycker du <kbd>Mellanslag (Space)</kbd></li>
                    <li>SKRIV SÅ FORT DU KAN INNAN TIDEN ÄR SLUT</li>
                </ol>
                <div>
                    <fieldset>
                        <legend>Välj svårighet</legend>

                        <div>
                            <input id="easy" type="radio" name="difficulty" value="easy" checked>
                            <label for="easy">Lätt</label>
                        </div>
                        
                        <div>
                            <input id="medium" type="radio" name="difficulty" value="medium">
                            <label for="medium">Mellan</label>
                        </div>
                        
                        <div>
                            <input id="hard" type="radio" name="difficulty" value="hard">
                            <label for="hard">Svår</label>
                        </div>
                    </fieldset>
                </div>
            </div>


            <div class="player_inputs">
                <input class="input_full_name" type="text" name="name" placeholder="Ditt namn" required>
                <input class="input_school_name" type="text" name="school" placeholder="Din skola" required>
                <button type="submit">Starta</button>
            </div>
    </form>`;

    const form = main_container.querySelector("form");
    form.onsubmit = (e) => {
        e.preventDefault();
        const form_data = new FormData(e.target);
        localStorage.setItem("name", form_data.get("name"));
        localStorage.setItem("school", form_data.get("school"));
        localStorage.setItem("difficulty", form_data.get("difficulty"));
        select_difficulty(form_data.get("difficulty"));
        render_gameplay();
    }
}

function render_gameplay() {
    main_container.innerHTML = `
        <div class="countdown_dialog">
            <div class="dialog_box">
                <h1 class="dialog_timer">3</h1>
                <h2 class="dialog_message">Gör dig redo!</h2>
            </div>
        </div>

        <div class="gameplay_screen">
            <div class="gameplay_header"><div>Tid kvar: <span class="time_left">60</span></div></div>
            <div class="text_to_write"></div>
        </div>`;

    const text_container = document.querySelector(".text_to_write");
    const dialog_timer = document.querySelector(".dialog_timer");
    const time_left_span = document.querySelector(".time_left");
    let time_left = 60;
    let score = 0;
    let letter_counter = 0;

    // Creates an array of each letter in the game text.
    const gameplay_letters = [...gameplay_text];

    // TODO: add each cluster of spans into a div so that they stay together. Might need some gameplay adjustments.

    // Creates a an array with a span of each letter in the game.
    const gameplay_spans = gameplay_letters.map(letter => {
        const letter_span = document.createElement("span");

        // Enforces the span to contain a space.
        if (letter === " ") letter_span.innerHTML = "&nbsp;";
        else letter_span.textContent = letter.toLowerCase();
        return letter_span;
    });

    // Highlights the first letter.
    gameplay_spans[0].className = "current_letter";
    gameplay_spans.forEach(span => text_container.appendChild(span));

    setTimeout(() => dialog_timer.textContent = "2", 1000);
    setTimeout(() => dialog_timer.textContent = "1", 2000);

    // Gameplay loop starts here
    setTimeout(() => {
        document.querySelector(".countdown_dialog").remove();
        let game_interval = setInterval(() => {
            time_left_span.textContent = --time_left;

            if (time_left === 0) {
                clearInterval(game_interval);
                console.log("Game is over!");
                add_score(score);
                render_leaderboard();
                window.onkeydown = null;

            }
        }, 1000);

        window.onkeydown = (e) => {
            // The counter keeps track of which span we are currently on + which letter we are on.
            if (e.key.toLowerCase() === gameplay_letters[letter_counter].toLowerCase()) {

                // Add score if it's a new word.
                if (e.key === " ") {
                    score += 5;
                }

                gameplay_spans[letter_counter].classList.add("correct");
                gameplay_spans[letter_counter].classList.remove("wrong");
                gameplay_spans[letter_counter].classList.remove("current_letter");
                letter_counter++;

                // Highlights the next letter.
                gameplay_spans[letter_counter].className = "current_letter";

                // Checks if the full text has been written
                if (letter_counter === gameplay_letters.length - 1) {
                    console.log("Game is over! You won!");
                    score += 5;

                    add_score(score);
                    clearInterval(game_interval);
                    render_leaderboard();
                    window.onkeydown = null;
                }
            } else {
                gameplay_spans[letter_counter].classList.add("wrong");
            }

        };
    }, 3000);

}

function render_leaderboard() {
    main_container.innerHTML = `
    <div class="qr_container">
        <h1>Skanna QR-koden</h1>
        <img class="qr_code" src="./media/qr.png" alt="">
        <button class="qr_confirm">Bekräfta</button>
    </div>

    <div class="stats hide">
        <img src="./media/dancing_animals.webp" alt="">
        <p>${localStorage.getItem("name")} fick ${localStorage.getItem("score")} poäng!</p>
        <button class="to_leaderboard_btn">Till leaderboard</button>
    </div>

    <div class="leaderboard hide">
        <button>Spela igen</button>
        <ol></ol>
    </div>`;

    const leaderboard_ol = document.querySelector(".leaderboard > ol");
    fetch("http://localhost:1234/leaderboard").then(r => r.json()).then(data => {
        const sorted_data = data.db.sort((a,b) => b.score - a.score);
        console.log(sorted_data);
        sorted_data.forEach(row => {
            const player = document.createElement("li");
            player.innerHTML = `<p>${row.name}</p><p>${row.school}</p><p>${row.score} poäng</p>`;
            leaderboard_ol.appendChild(player);
        })
    })

    const qr_confirm_btn = document.querySelector(".qr_confirm");
    const to_leaderboard_btn = document.querySelector(".to_leaderboard_btn");
    const play_again_btn = document.querySelector(".leaderboard > button");

    qr_confirm_btn.onclick = async (e) => {
        main_container.querySelector(".qr_container").classList.add("hide");
        main_container.querySelector(".stats").classList.remove("hide");

        // TODO: send the stats here!
        await register_score_to_db();
    }

    to_leaderboard_btn.onclick = (e) => {
        main_container.querySelector(".stats").classList.add("hide");
        main_container.querySelector(".leaderboard").classList.remove("hide");
    }

    play_again_btn.onclick = (e) => {
        // localStorage.removeItem("name");
        // localStorage.removeItem("school");
        // localStorage.removeItem("score");
        // localStorage.removeItem("difficulty");
        window.location.reload();
    }

}

export default renderer;