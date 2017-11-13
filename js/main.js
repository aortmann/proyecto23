function initFrontPage(data) {
  languages = Object.keys(data);
  var alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
  var app = new Vue({
    el: '#proyecto23',
    data: {
      fromLanguage: languages[0],
      toLanguage: null,
      languages: languages,
      fromText: '',
      baseWord: null,
      wordToFix: null,
      isNew: false,
      colorLanguages: []
    },
    filters: {
      capitalize: function(s) {
        return s.capitalize();
      }
    },
    computed: {
      filteredLanguages: function() {
        var that = this;
        var filtered = languages.filter(function(item) {
          return item !== that.fromLanguage
        });
        this.toLanguage = filtered[0];
        return filtered;
        /*var toLanguageList = [];
        for(var i in languages) {
          if(languages[i].capitalize() != this.fromLanguage){
              toLanguageList.push(languages[i]);
          }
        }
        return toLanguageList;*/
      }
    },
    methods: {
      openCorrectionModal: function(word, index, isNew, toLanguage) {
        this.toLanguage = toLanguage;
        this.isNew = isNew;
        this.baseWord = sanitize(this.fromText.split(' ')[index]);
        this.wordToFix = sanitize(word);
        document.getElementById('correction-modal').classList.add('is-active');
      },
      saveNewWord: function() {
        position = findPosition(this.fromLanguage, this.baseWord);
        if(position) {
          var cell = alphabet[Object.keys(data).indexOf(this.toLanguage)] + position.y;
          var range = 'Vocabulario!' + cell + ':' + cell;
          var wordToFix = sanitize(this.wordToFix).toLowerCase();
          writeData(range, wordToFix);
          data[this.toLanguage][position.y-2] = wordToFix;
          if(this.isNew) {
            cell = alphabet[Object.keys(data).indexOf(this.fromLanguage)] + position.y;
            range = 'Vocabulario!' + cell + ':' + cell;
            var baseWord = sanitize(this.baseWord).toLowerCase();
            writeData(range, baseWord);
            data[this.fromLanguage].push(baseWord);
            data[this.toLanguage].push(wordToFix);
          }
          this.fromText += " ";
          this.fromText = this.fromText.trim();
          localStorage.setItem('forceRefresh', true);
          document.getElementById('correction-modal').classList.remove('is-active');
        }
      },
      toText: function (language) {
        if(this.fromText) {
          var splittedText = this.fromText.split(' ');
          var newText = [];
          for(var i in splittedText) {
            newText.push(find(this.fromLanguage, language, splittedText[i]));
          };
          var cased = newText.map(function(obj){return obj.word}).join('|').sentenceCase().split('|');
          for(var i in newText) {
            newText[i].word = cased[i] + ' ';
          }
          return newText;
        };
        return null;
      },
      copy: function(elementId) {
        var aux = document.createElement("input");
        aux.setAttribute("value", document.getElementById(elementId).innerHTML);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
      },
      randomColor(language) {
        if(colorLanguages[language]) {
          return colorLanguages[language];
        } else {
          var r = function() {return Math.floor(256 * Math.random())};
          colorLanguages[language] = "rgba("+r()+", "+r()+", "+r()+",0.1  )";
          return colorLanguages[language];
        }
      }
    }
  })
  autosize();
  setModalFunction();
};

function find(fromLanguage, toLanguage, word) {
  var response = {found: false, foundInBase: false, word: word + ' '};
  if(toLanguage) {
    //my brain is broken because of this
    var dotSymbol = word.indexOf('.');
    var commaSymbol = word.indexOf(',');
    var openQuestionSymbol = word.indexOf('¿');
    var closeQuestionSymbol = word.indexOf('?');
    var openExclamationSymbol = word.indexOf('¡');
    var closeExclamationSymbol = word.indexOf("!");
    word = sanitize(word);
    var regex = new XRegExp("^\\p{L}*$")
    var matchedWord = regex.exec(word.toLowerCase());
    if(matchedWord && matchedWord.length > 0) {
      matchedWord = matchedWord[0];
      var io = data[fromLanguage].indexOf(matchedWord);
      if(io > -1) {
        response.foundInBase = true;
        if(data[toLanguage][io].length > 0) {
          response.word = data[toLanguage][io];
          if(dotSymbol > -1) response.word = data[toLanguage][io] + '.';
          if(commaSymbol > -1) response.word = data[toLanguage][io] + ',';
          if(openQuestionSymbol > -1 && closeQuestionSymbol > -1) response.word = '¿' + data[toLanguage][io] + '?';
          if(openQuestionSymbol > -1) response.word = '¿' + data[toLanguage][io];
          if(closeQuestionSymbol > -1) response.word = data[toLanguage][io] + '?';
          if(openExclamationSymbol > -1 && closeExclamationSymbol > -1) response.word = '¡' + data[toLanguage][io] + '!';
          if(openExclamationSymbol > -1) response.word = '¡' + data[toLanguage][io];
          if(closeExclamationSymbol > -1) response.word = data[toLanguage][io] + '!';
          response.word = response.word + ' ';
          response.found = true;
        }
      }
    }
  }
  return response;
}

function findPosition(fromLanguage, word) {
  word = sanitize(word);
  var regex = new XRegExp("^\\p{L}*$")
  var matchedWord = regex.exec(word.toLowerCase());
  if(matchedWord && matchedWord.length > 0) {
    matchedWord = matchedWord[0];
    var io = data[fromLanguage].indexOf(matchedWord);
    if(io > -1) {
      return {y: io+2}; //2 = 1 for title, 1 because this start to count from 0
    }
  }
  return {y: data[fromLanguage].length + 2};
}

function sanitize(word) {
  return word.split("\.").join("").split(",").join("").split("¿").join("").split("\?").join("").split("¡").join("").split("!").join("").trim();
}

function setModalFunction() {
  document.getElementsByClassName('modal-background')[0].onclick = function() {
    document.getElementById('correction-modal').classList.remove('is-active');
  };
  document.getElementsByClassName('modal-close')[0].onclick = function() {
    document.getElementById('correction-modal').classList.remove('is-active');
  };
}
