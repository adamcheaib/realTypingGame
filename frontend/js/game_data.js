export let gameplay_text;

const difficulties = {
    easy: `Hej, Jag är på gymnasiemässan idag och jag skriver en text som ska vara rolig och intressant. Malmö är en fin stad med många skolor. Jag försöker skriva snabbt och tänka på bra ideas. Jag hoppas ha kul och kanske vinna ett pris.`,
    medium: `Här sitter jag på gymnasiemässan och kämpar för att skriva den bästa texten någonsin. Jag skriver snabbt, tänker smart och hoppas vinna priset. Malmö är ju helt klart en fantastisk stad, men vilken skola är egentligen bäst? Så klart, Realgymnasiet! Nu kör vi!`,
    hard: `Här befinner jag mig på den årliga gymnasiemässan, där jag desperat försöker formulera en text som inte bara är snabbskriven utan också innehåller smarta ideas och övertygande argument. Malmö, med sin rika kultur och dynamiska atmosfär, ger en inspirerande bakgrund, men frågan kvarstår: vilken skola utmärker sig egentligen? Självklart måste jag nämna Realgymnasiet som det självklara valet. Nu är det dags att prestera på högsta nivå!`
}

const score_multipliers = {
    easy: 1,
    medium: 1.4,
    hard: 1.6
}

export function select_difficulty(selected_difficulty) {
    gameplay_text = difficulties[selected_difficulty];
}


export async function add_score(score) {
    if (typeof score !== "number") throw new Error("Score or time have not been passed as arguments!");

    let difficulty = localStorage.getItem("difficulty");
    localStorage.setItem("score", Math.round(score * score_multipliers[difficulty]));

}

export async function register_score_to_db() {
    const req_data = {
        name: localStorage.getItem("name"),
        school: localStorage.getItem("school"),
        score: localStorage.getItem("score"),
        phone: localStorage.getItem("phone"),
    };

    const response = await fetch("http://localhost:1234/register", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(req_data)
    });

    const resource = await response.json();
}