// Client ID and API key from the Developer Console
var CLIENT_ID = '245771448899-d2ie87n0pmlsm3r77eh7u76p4f1hh2a8.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAPrkvQe0v8JxApzsjVrTb8-TiG4wuhKDo';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');
var refreshButton = document.getElementById('refresh-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
    refreshButton.onclick = handleRefreshClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.classList.add('is-hidden');
    signoutButton.classList.remove('is-hidden');
    refreshButton.classList.remove('is-hidden');
    getData();
  } else {
    authorizeButton.classList.remove('is-hidden');
    signoutButton.classList.add('is-hidden');
    refreshButton.classList.add('is-hidden');
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  localStorage.clear();
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  localStorage.clear();
  gapi.auth2.getAuthInstance().signOut();
  location.reload();
}

function handleRefreshClick(event) {
  localStorage.clear();
  getData();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

var data = {};
function getData() {
  toggleRefreshButton();
  forceRefresh = localStorage.getItem('forceRefresh');
  if(forceRefresh) localStorage.clear();
  data = localStorage.getItem('gdata');
  if(!data) {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '1WIdnoOnyQkRFGfwXYySOR-nK5pB6KqwN6aKapOe3vRA',
      range: 'Vocabulario'
    }).then(function(response) {
      data = {};
      var range = response.result;
      //console.log(range.values);
      if (range.values.length > 0) {
        //console.log(obj);
        for (i = 1; i < range.values.length; i++) {
          //for (j = 0; j < range.values[i].length; j++) {
          for (j = 0; j < 8; j++) {
            if(!data[range.values[0][j]]) data[range.values[0][j]] = [];
            data[range.values[0][j]].push((range.values[i][j] || "").toLowerCase().trim());
          }
          //var row = range.values[i];
          // Print columns A and E, which correspond to indices 0 and 4.
          //appendPre(row[0] + ', ' + row[4]);
        }
        localStorage.setItem('gdata', JSON.stringify(data));
        //initFrontPage(data);
        toggleRefreshButton();
        location.reload();
      } else {
        appendPre('No data found.');
      }
    }, function(response) {
      appendPre('Error: ' + response.result.error.message);
    });
  } else {
    data = JSON.parse(data);
    initFrontPage(data);
    toggleRefreshButton();
  }
}

function writeData(range, data) {
  var params = {
       //"range":"Sheet1!A2:A3",
       spreadsheetId: '1WIdnoOnyQkRFGfwXYySOR-nK5pB6KqwN6aKapOe3vRA',
       "range": range,
       "majorDimension": "ROWS",
       "valueInputOption": "USER_ENTERED",
       "values": [
         [data]
      ]
  };
  var request = gapi.client.sheets.spreadsheets.values.update(params)
    .then(function(response) {
      //console.log(response);
    }, function(response) {
      appendPre('Error: ' + response.result.error.message);
    });
}

function toggleRefreshButton() {
  refreshButton.getElementsByTagName('i')[0].classList.toggle('fa-spin');
}
