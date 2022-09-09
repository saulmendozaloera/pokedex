//event listeners
document.querySelector("#pokemonImage").innerHTML = "<h1>?</h1>";
document.querySelector("#searchPokemon").addEventListener("click", function(event){
  validateForm(event);
});


//functions
async function validateForm(e){

  let isValid = true;
  
  resetPokedex();
  let pokemon = document.querySelector("#pokemon").value.toLowerCase();
  let url =`https://pokeapi.co/api/v2/pokemon/${pokemon}`;
  let response = await fetch(url);
  
  if(pokemon === ""|| response.ok === false ){
    document.querySelector("#error").innerHTML = "Please enter a valid name or ID";
    document.querySelector("#error").style.color = "red";
    isValid = false;
  }

  if(!isValid){
    e.preventDefault();
  }
    
  else{
    let data = await response.json();
    displayFirstRow(data);
    displayMiddleRow(data);
    displayRowThree(data);
  }
}

async function pokemonImage(pokemon, ID){
  
  let url =`https://pokeapi.co/api/v2/pokemon/${pokemon}`;
  let response = await fetch(url);
  let data = await response.json();

  let pic = data.sprites.front_default;

  document.querySelector(`#${ID}`).innerHTML = `<img src="${pic}" alt="${pokemon}"></img>`;
}

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

function displayFirstRow(data){
  
  pokemonImage(data.species.name, "pokemonImage");
  document.querySelector("#pokemonName").innerHTML = data.species.name;
  document.querySelector("#pokemonID").innerHTML = data.id;
  for(let i=0; i < data.types.length; i++){
    
    document.querySelector("#pokemonType").innerHTML += `<option value = "${data.types[i].type.name}"> ${data.types[i].type.name} </option>`;
    
  }
}

async function displayMiddleRow(data){
  
  document.querySelector("#pokemonHeight").innerHTML += `${data.height} ft`;
  document.querySelector("#pokemonWeight").innerHTML += `${data.weight} lbs`;

  evolutionChain(data.species.name);

  
}

function displayRowThree(data){

  for(let i=0; i < data.abilities.length; i++){
    
    document.querySelector("#abilities").innerHTML += `<option value = "${data.abilities[i].ability.name}"> ${data.abilities[i].ability.name} </option>`;
    
  }
    
  for(let i=0; i<data.moves.length; i++){
    
    document.querySelector("#moves").innerHTML += `<option value = "${data.moves[i].move.name}"> ${data.moves[i].move.name} </option>`;
  } 
  
}


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