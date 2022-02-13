/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

// const { default: axios } = require("axios");


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async so it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const results = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
  let showArr = [];
  try {
    for ({ show } of results.data) {
      let showObj = {
        id: show.id,
        name: show.name,
        summary: show.summary,
        image: show.image.medium
      }
      showArr.push(showObj);
    };
  } catch (err) {
    console.log('Image not found');
  }
  return showArr;
};




//   return [
//     {
//       id: 1767,
//       name: "The Bletchley Circle",
//       summary: "<p><b>The Bletchley Circle</b> follows the journey of four ordinary women with extraordinary skills that helped to end World War II.</p><p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their normal lives, modestly setting aside the part they played in producing crucial intelligence, which helped the Allies to victory and shortened the war. When Susan discovers a hidden code behind an unsolved murder she is met by skepticism from the police. She quickly realises she can only begin to crack the murders and bring the culprit to justice with her former friends.</p>",
//       image: "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
//     }
//   ]
// }



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
            <img class="card-img-top" src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="card-button" class="episode-button" data-show-id = ${show.id}>Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
   
  }
 $('#shows-list').on('click', async function episodesHandler(evt) {
      let showId = $(evt.target).closest('.Show').data('show-id');
      console.log(showId);
      let episodes = await getEpisodes(showId);
      console.log(episodes);
      populateEpisodes(episodes);
      console.log(evt);
      $("#episodes-area").show();
    })
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();
  let shows = await searchShows(query);
  console.log(shows);
  if (shows.length === 0) return alert('Unable to find show!');
  populateShows(shows);
})

/** Given a show ID, return an array of an object of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const results = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  console.log(results)
  let episodeArr = [];
  for (epi of results.data) {
    let episodeObj = {
      id: epi.id,
      name: epi.name,
      season: epi.season,
      number: epi.number
    }
    episodeArr.push(episodeObj);
  }
  return episodeArr;
};

//TODO: populate episodes of show with given ID and data pulled in from the getEpisodes function, render the episodes to the DOM
function populateEpisodes(episodes) {
  const $episodesList = $('#episodes-list')
  $episodesList.empty();

  for (epi of episodes) {
    let $item = $(`
      <li class = "episode"> <b>${epi.name}</b>(Season ${epi.season}, Episode ${epi.number})</li>
    `)
    $episodesList.append($item);
  }
  $('episodes-area').show();
}
