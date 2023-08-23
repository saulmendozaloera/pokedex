/*
 * Event listener initializes image to ?
 */
document.querySelector("#pokemonImage").innerHTML = "<h1>?</h1>";
/*
 * Event listener calles the validateForm once user clicks button. 
 */
document.querySelector("#searchPokemon").addEventListener("click", function(event){
  validateForm(event);
});

/* Event listener that populates pokemon options when user
 * enters letters.
 */
document.addEventListener("DOMContentLoaded", function() {
    const datalist = document.getElementById("pokemonOptions");
    const inputField = document.getElementById("pokemon");
    inputField.addEventListener("input", async function() {
      const inputText = inputField.value.trim().toLowerCase();
      if (inputText.length >= 1) {
          datalist.innerHTML = ""; 

          const url = `https://pokeapi.co/api/v2/pokemon/?limit=1118`;
          const response = await fetch(url);
          const data = await response.json();
          const filteredPokemon = data.results.filter(pokemon => pokemon.name.startsWith(inputText));

          filteredPokemon.forEach(async pokemon => {
              const pokemonData = await fetchPokemonData(pokemon.name);
              const option = document.createElement("option");
              option.value = pokemon.name;
              option.innerHTML = `<img src="${pokemonData.sprites.front_default}" alt="${pokemon.name}" style="width: 5px; height: 5px;"> <i class="bi bi-0-circle"></i> ${pokemon.name}`;
              datalist.appendChild(option);
          });
      }
    });
});

/*
 * Event listener for when user wants to view the evolve to Pokémon.  
 */
document.getElementById("evolveTo").addEventListener("click", async function() {
    resetPokedex();
  
    const pokemonName = document.getElementById("evolveTo").getAttribute("data-name");
    let data = await fetchPokemonData(pokemonName);
   
    displayFirstRow(data);
    displayMiddleRow(data);
    displayRowThree(data);
});

/*
 * Event listener for when user wants to view the evolve from Pokémon.  
 */
document.getElementById("evolveFrom").addEventListener("click", async function() {
    resetPokedex();
    const pokemonName = document.getElementById("evolveFrom").getAttribute("data-name");
    let data = await fetchPokemonData(pokemonName);
    displayFirstRow(data);
    displayMiddleRow(data);
    displayRowThree(data);
});

/*
 *Event Listener for when the user hits the enter/return key.
 */
document.getElementById("search").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    // Prevent the default "Enter" behavior
    event.preventDefault(); 
    document.getElementById("searchPokemon").click();
  }
});

/*
 *Eventlistener for the Toast Messages
 */
document.addEventListener("DOMContentLoaded", function() {
  // Show the toast when the page is loaded
  var toastElement = document.querySelector('#welcome-toast');
  var toast = new bootstrap.Toast(toastElement);
  toast.show();

  var toastElement = document.querySelector('#instruction-toast');
  var toast = new bootstrap.Toast(toastElement);
  toast.show();
});

/*
 *Validates if the data entered is a valid Pokémon name or ID. 
 */
async function validateForm(e){

  let isValid = true;
  
  resetPokedex();
  let pokemonName = document.querySelector("#pokemon").value.toLowerCase();
  
  
  if(pokemon === ""){
    document.querySelector("#error").innerHTML = "Please enter a valid name or ID";
    document.querySelector("#error").style.color = "white";
    isValid = false;
  }

  if(!isValid){
    e.preventDefault();
  }
    
  else{
    let data = await fetchPokemonData(pokemonName);
    displayFirstRow(data);
    displayMiddleRow(data);
    displayRowThree(data);
  }
}
/*
 * Displays images of Pokémon. 
 */
async function pokemonImage(pokemonName, ID){
  
  let data = await fetchPokemonData(pokemonName);

  let pic = data.sprites.front_default;

  document.querySelector(`#${ID}`).innerHTML = `<img src="${pic}" alt="${pokemon}"></img>`;
  document.querySelector(`#${ID}`).setAttribute("data-name", data.species.name);
}

/*
 * Fetches evolutions prior or future for the current Pokémon. 
 */
async function evolutionChain(pokemon){
  
  let url =`https://pokeapi.co/api/v2/pokemon-species/${pokemon}/`;
  let response = await fetch(url);
  let data = await response.json();

  let evolution_url = data.evolution_chain.url;
  let evolution_response = await fetch(evolution_url);
  let chain = await evolution_response.json();
  
  let basePokemon = chain.chain.species.name;

  let evolutionList = [];


  let end = false;

  chain = chain.chain;
  evolutionList.push(chain.species.name);
  
  while(end !== true){
    if(chain.evolves_to.length === 1){
      evolutionList.push(chain.evolves_to[0].species.name);
      chain = chain.evolves_to[0];
    }
    else if(chain.evolves_to.length > 1){
      for(let i=0; i<chain.evolves_to.length; i++){
        evolutionList.push(chain.evolves_to[i].species.name);
      }
      chain = chain.evolves_to[0];
    }
    else{
      end = true;
    }
  }

  if(evolutionList.length > 1){
    if(evolutionList[evolutionList.length-1] === pokemon){
      document.querySelector("#evolveFromName").innerHTML = evolutionList[evolutionList.length-2];
      pokemonImage(evolutionList[evolutionList.length-2], "evolveFrom");
    }
    else{
      for(let i=0; i < evolutionList.length; i++){
        if(evolutionList[i] === pokemon){
          pokemonImage(evolutionList[i+1], "evolveTo");
          document.querySelector("#evolveToName").innerHTML = evolutionList[i+1];
          if(basePokemon !== pokemon){
            pokemonImage(evolutionList[i-1], "evolveFrom");
            document.querySelector("#evolveFromName").innerHTML = evolutionList[i-1];
          }
        }
      }
    }
  }
}

/*
 * Displays first row of the Pokédex.  
 */

function displayFirstRow(data){
  
  pokemonImage(data.species.name, "pokemonImage");
  document.querySelector("#pokemonName").innerHTML = data.species.name;
  document.querySelector("#pokemonID").innerHTML = data.id;
  for(let i=0; i < data.types.length; i++){
    
    document.querySelector("#pokemonType").innerHTML += `<option value = "${data.types[i].type.name}"> ${data.types[i].type.name} </option>`;
    
  }
}
/*
 * Displays second row of the Pokédex
 */
async function displayMiddleRow(data){
  
  document.querySelector("#pokemonHeight").innerHTML += `${data.height} ft`;
  document.querySelector("#pokemonWeight").innerHTML += `${data.weight} lbs`;

  evolutionChain(data.species.name);

  
}
/*
 * Displays last row of the Pokédex. 
 */
function displayRowThree(data){

  for(let i=0; i < data.abilities.length; i++){
    
    document.querySelector("#abilities").innerHTML += `<option value = "${data.abilities[i].ability.name}"> ${data.abilities[i].ability.name} </option>`;
    
  }
    
  for(let i=0; i<data.moves.length; i++){
    
    document.querySelector("#moves").innerHTML += `<option value = "${data.moves[i].move.name}"> ${data.moves[i].move.name} </option>`;
  } 
  
}


/*
 *Resets the Pokedex.
 */
function resetPokedex(){

  document.querySelector("#pokemonImage").innerHTML = "<h1>?</h1>";
  document.querySelector("#pokemonName").innerHTML = "";
  document.querySelector("#pokemonType").innerHTML = "";
  document.querySelector("#pokemonHeight").innerHTML = "";
  document.querySelector("#pokemonWeight").innerHTML = "";
  
  document.querySelector("#abilities").innerHTML = "";
  
  document.querySelector("#moves").innerHTML = "";

  document.querySelector("#evolveToName").innerHTML = "";
  document.querySelector("#evolveFromName").innerHTML = "";
  document.querySelector("#evolveFrom").innerHTML = "";
  document.querySelector("#evolveTo").innerHTML = "";
  document.querySelector("#error").innerHTML = "";
 
}
/*
 * Function that obtains Pokémon data. 
 */
async function fetchPokemonData(pokemonName) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

