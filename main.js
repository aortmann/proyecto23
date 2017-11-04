function initFrontPage(data) {
  languages = Object.keys(data);
  var app = new Vue({
    el: '#proyecto23',
    data: {
      fromLanguage: languages[0],
      toLanguage: null,
      languages: languages,
      fromText: ''
    },
    filters: {
      capitalize: function(s) {
        return s.capitalize();
      }
    },
    computed: {
      toText: function () {
        if(this.fromText) {
          var splittedText = this.fromText.split(' ');
          var newText = '';
          for(var i in splittedText) {
            newText += find(this.fromLanguage, this.toLanguage, splittedText[i]) + ' ';
          }
          return newText.sentenceCase();
        } return null;
      },
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
    }
  })
  autosize();
};

function find(fromLanguage, toLanguage, word) {
  if(toLanguage) {
    //my brain is broken because of this
    var dotSymbol = word.indexOf(".");
    var commaSymbol = word.indexOf(",");
    var openQuestionSymbol = word.indexOf("¿");
    var closeQuestionSymbol = word.indexOf("?");
    var openExclamationSymbol = word.indexOf("¡");
    var closeExclamationSymbol = word.indexOf("!");
    var matchedWord = word.toLowerCase().match(/\b(\w+)\b/g);
    if(matchedWord && matchedWord.length > 0) {
      matchedWord = matchedWord[0];
      var io = data[fromLanguage].indexOf(matchedWord);
      if(io > -1) {
        if(data[toLanguage][io].length > 0) {
          if(dotSymbol > -1) return data[toLanguage][io] + '.';
          if(commaSymbol > -1) return data[toLanguage][io] + ',';
          if(openQuestionSymbol > -1 && closeQuestionSymbol > -1) return '¿' + data[toLanguage][io] + '?';
          if(openQuestionSymbol > -1) return '¿' + data[toLanguage][io];
          if(closeQuestionSymbol > -1) return data[toLanguage][io] + '?';
          if(openExclamationSymbol > -1 && closeExclamationSymbol > -1) return '¡' + data[toLanguage][io] + '!';
          if(openExclamationSymbol > -1) return '¡' + data[toLanguage][io];
          if(closeExclamationSymbol > -1) return data[toLanguage][io] + '!';
          return data[toLanguage][io];
        }
      }
    }
  }
  return '<span style="background-color: #BBDEFB;cursor:pointer">' + word + '</span>';
}