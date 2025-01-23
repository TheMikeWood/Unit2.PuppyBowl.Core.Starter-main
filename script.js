// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2412-FTB-ET-WEB-FT";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;
const main = document.querySelector("main");
/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */

const fetchAllPlayers = async () => {
  try {
    // TODO
    const response = await fetch(API_URL);
    if (response.ok) {
      const json = await response.json();
      console.log(json.data);
      return json.data.players;
    } else {
      console.error("Failed to get players.");
    }
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
  return [];
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    // TODO
    const response = await fetch(`${API_URL}/${playerId}`);
    if (response.ok) {
      const json = await response.json();
      console.log(json.data);
      return json.data.player;
    } else {
      console.error("Failed to get player.");
    }
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
  return null;
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    // TODO
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerObj),
    });
    if (response.ok) {
      const newPlayer = await response.json();
      return newPlayer.data.newPlayer;
    } else {
      console.error("Failed to add player.");
    }
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    // TODO
    const response = await fetch(`${API_URL}/${playerId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log(`Player with ID ${playerId} has been removed.`);
    } else {
      console.error("Failed to delete player.");
    }
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  // TODO
  main.innerHTML = "";
  if (!playerList || playerList.length === 0) {
    main.innerHTML = "<p> No players here!</p>";
    return;
  }
  playerList.forEach((player) => {
    const playerCard = document.createElement("div");
    playerCard.classList.add("player-card");

    playerCard.innerHTML = `
      <img src="${player.imageUrl}" alt="${player.name}" />
      <h3>${player.name}</h3>
      <p>Breed: ${player.breed}</p>
      
      <p>Id: ${player.id}</p>
    `;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const details = document.createElement("button");
    details.textContent = "See Details";
    details.classList.add("details-button");
    details.addEventListener("click", async () => {
      const playerDetails = await fetchSinglePlayer(player.id);
      renderSinglePlayer(playerDetails);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Remove Player";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", async () => {
      removePlayer(player.id);
      const updatedPlayers = await fetchAllPlayers();
      renderAllPlayers(updatedPlayers);
    });
    buttonContainer.appendChild(details);
    buttonContainer.appendChild(deleteButton);
    playerCard.appendChild(buttonContainer);
    main.appendChild(playerCard);
  });
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  // TODO
  main.innerHTML = "";
  if (!player) {
    main.innerHTML = "<p>No player here!</p>";
    return;
  }
  const onePlayerCard = document.createElement("div");
  onePlayerCard.classList.add("one-player-card");

  onePlayerCard.innerHTML = `
      <img src="${player.imageUrl}" alt="${player.name}" />
      <h3>${player.name}</h3>
      <p><strong>Breed:</strong> ${player.breed}</p>
      <p><strong>ID:</strong> ${player.id}</p>
      <p><strong>Team:</strong> ${player.team?.name || "Unassigned"}</p>
      <p><strong>Status:</strong> ${player.status}</p>
    `;

  const backButton = document.createElement("button");
  backButton.textContent = "Back to all players";
  backButton.addEventListener("click", async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
  });
  onePlayerCard.appendChild(backButton);
  main.appendChild(onePlayerCard);
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    // TODO
    const form = document.getElementById("new-player-form");
    form.innerHTML = `
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required>
      
      <label for="breed">Breed:</label>
      <input type="text" id="breed" name="breed" required>

      <label for="status">Status:</label>
      <select id="status" name="status" required>
        <option value="bench">Bench</option>
        <option value="field">Field</option>
      </select>

      <label for="teamId">Team:</label>
      <select id="teamId" name="teamId" required>
       <option value="1">Fluff</option>
        <option value="2">Ruff</option>
      </select>
      
      <label for="imageUrl">Image Link:</label>
      <input type="url" id="imageUrl" name="imageUrl" required>
      
      <button type="submit">Add Player</button>
    `;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      try {
        const playerData = {
          name: form.name.value,
          breed: form.breed.value,
          status: form.status.value,
          imageUrl: form.imageUrl.value,
        };

        await addNewPlayer(playerData);
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
        form.reset();
      } catch (err) {
        console.error("Error adding the new player!", err);
      }
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
