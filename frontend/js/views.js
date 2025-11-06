import {gameplay_text} from "./text_to_write.js"

const renderer = {
    landing_page: render_user_input_page
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
            <div class="gameplay_header">Tid kvar: <span class="time_left">60</span></div>
            <div class="text_to_write"></div>
        </div>`;

    const text_container = document.querySelector(".text_to_write");
    const dialog_timer = document.querySelector(".dialog_timer");
    const time_left_span = document.querySelector(".time_left");
    const gameplay_letters = [...gameplay_text];
    let counter = 0;

    const gameplay_spans = gameplay_letters.map(letter => {
        const letter_span = document.createElement("span");

        if (letter == " ") letter_span.innerHTML = "&nbsp;";
        else letter_span.textContent = letter.toLowerCase();
        return letter_span;
    });

    gameplay_spans[0].className = "current_letter";
    gameplay_spans.forEach(span => text_container.appendChild(span));

    setTimeout(() => dialog_timer.textContent = "2", 1000);
    setTimeout(() => dialog_timer.textContent = "1", 2000);

    // Gameplay loop starts here
    setTimeout(() => {
        document.querySelector(".countdown_dialog").remove();


        window.onkeydown = (e) => {
            // The counter keeps track of which span we are currently on + which letter we are on.
            if (e.key.toLowerCase() === gameplay_letters[counter].toLowerCase()) {
                gameplay_spans[counter].classList.add("correct");
                gameplay_spans[counter].classList.remove("wrong");
                gameplay_spans[counter].classList.remove("current_letter");
                counter++;

                // Highlights the next letter.
                gameplay_spans[counter].className = "current_letter";
            } else {
                gameplay_spans[counter].classList.add("wrong");
            }
        };
    }, 3000);

}

export default renderer;