const newCardButtton = document.getElementById("new-card");
const saveButton = document.getElementById("save-deck")

//https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
//https://www.w3schools.com/jsref/met_document_queryselectorall.asp
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
let card_count = 0;

// const vineboom = new Audio('static/vineboom.mp3');



function new_card() {
    const card_div = document.createElement("div");
    //https://www.w3schools.com/js/js_htmldom_nodes.asp
    card_count=card_count+1;
    console.log(card_count);
    const current_count = card_count;
    card_div.innerHTML = `<div class="added-card" id="added-div-${current_count}">
        <h2 class="flashcard-number-title">${current_count+1}.</h2>
        <div class="in-card">
            <h3>term</h3>
            <textarea class="term"></textarea>
            <h3>definition</h3>
            <textarea class="definition"></textarea>
            <button class= "delete-button" id="delete-${current_count}">delete</button>
        </div>
        </div>`;
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
    
    
    const card_section = document.getElementById("card-list");

    card_section.append(card_div);

    const intended_delete_button = document.getElementById(`delete-${current_count}`);
    intended_delete_button.onclick = () => delete_card(current_count);
    reload_cards()
}

function delete_card(card) {
    if (confirm(`Delete this card?`)) {
        const intended_card = document.getElementById(`added-div-${card}`);
        intended_card.remove()
        card_count = card_count-1;
        reload_cards()
        

    }



}

function reload_cards() {
    const cards = document.querySelectorAll(".added-card");
    cards.forEach((card, index) => {
        const card_title = card.querySelector("h2");
        console.log(card.querySelector("h2"))
        card_title.textContent = `${index + 1}.`;
        card.id = `added-div-${index + 1}`;

        const delete_button = card.querySelector(".delete-button");
        if (delete_button) {
            delete_button.id = `delete-${index + 1}`;
            delete_button.onclick = () => delete_card(index+1);
        }
    })
}

function save_stuff() {
    const deck_title = document.getElementById("title");
    const cards = document.querySelectorAll(".added-card");
    const flashcards = [];
    let empty_cell = false



 
    



    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
    
    
    cards.forEach((card, index) => {
        const term = card.getElementsByClassName("term")[0];    
        //https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
        const definition = card.getElementsByClassName("definition")[0];
    
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
        
        
        if (term.value == "" || definition.value == "") {
            
            empty_cell = true
            return
        } else {
            flashcards.push({id: index, term:term.value, definition:definition.value, date:Date.now()})
        }

    });

    if (deck_title.value == "") {
        empty_cell = true
    }

    if (empty_cell) {
        
        return "die"
    } else {
        return {
            deck_title: deck_title.value,
            creation_date: Date.now(),
            length: flashcards.length,
            flashcards: flashcards
        };
    }
  
}

//https://www.w3schools.com/js/js_htmldom_eventlistener.asp
newCardButtton.addEventListener("click", new_card);

//https://www.geeksforgeeks.org/python/pass-javascript-variables-to-python-in-flask/
saveButton.addEventListener("click", () => {
    const newDeck = save_stuff();     
    console.log(newDeck);
    //https://flexiple.com/javascript/download-flle-using-javascript
    if (newDeck !== "die") {
    
        const json_string = JSON.stringify(newDeck)
        const blob = new Blob([json_string], {type: "application/json"})
        const file_url = URL.createObjectURL(blob)
        const download_link = document.createElement("a")
        download_link.href=file_url
        download_link.download = `${newDeck.deck_title}.json`
        document.body.appendChild(download_link)
        download_link.click()
        URL.revokeObjectURL(file_url);
        document.body.removeChild(download_link)
        //https://www.w3schools.com/howto/howto_js_redirect_webpage.asp
        if (confirm("Save to public database?")) {
            fetch("/save_deck", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newDeck)
                //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
                })
                // .then(response => response.json())
                // .then(result => {console.log(result);})
                .catch(error => {console.error(error);})
                .finally (() => {window.location.href = "/"})
            } else {window.location.href = "/";}
    } else {
        alert("Not all fields are complete")
    }
   
});


//https://stackoverflow.com/a/23835345
//https://wpshout.com/snippets/add-event-listener-to-multiple-elements-with-javascript/#gref
 
