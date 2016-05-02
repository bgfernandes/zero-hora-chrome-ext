(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var Helper = require('./Helper');

"use strict";

/**
 * Represents a Headline of the newspaper
 * @class
 * 
 * @property title          The story's title
 * @property description    The story's description
 * @property linkUrl        The link to the story's complete text (Zero Hora's website)
 * @property imgUrl         The link to the story's image (can be null)
 * @property imgTitle       The title of the story's image (can be null)
 * 
 */
class Headline {
    
  /**
   * 
   * @constructor
   * 
   * @param {object} containerA  The &lt;div class="container-a"&gt; jQuery element wich contains the headline.
   * 
   * @throws {Error} Will throw error if there is an problem extracting the content.
   */
  constructor(containerA) {
    
    this.title = null;
    this.description = null;
    this.linkUrl = null;
    this.imgUrl = null;
    this.imgTitle = null;
    
    //the title is a <a> inside a <h3 class="cartola"> element
    var title = containerA.find('.cartola a');
    if (title.length === 0)
      throw new Error('Title <a> tag not found.');
    
    this.title = title.text();
    
    //we can also get the URL of the headline here
    this.linkUrl = title.attr('href');
    
    //the description is a <a> inside a <h4 class="manchete">
    var desc = containerA.find('.manchete');
    if (desc.length === 0)
      throw new Error('Description <a> tag not found.');
    
    this.description = desc.text();
    
    //check to see if there is a image
    var image = containerA.find('img');
    if (image.length === 1) {
      this.imgUrl = image.attr('src');
      this.imgTitle = image.attr('title');
    }
     
  }
  
  /**
   * Creates a jQuery element based on the Headline
   * @method
   *
   * @returns {object} The jQuery object for the Headline
   * 
   * @throws {Error} Throws error if required fields are not present.
   */
  render(){
    
    if (!this.title || !this.description || !this.linkUrl)
      throw new Error('Headline needs title, description and linkUrl! It can\' be rendered.');
    
    //the left column holds the picture (some headlines don't have pictures)
    var element = $('<div class="headline"><div class="left-column"></div><div class="right-column"></div></div>');
    var leftColumn = element.find('.left-column');
    var rightColumn = element.find('.right-column');
    
    var titleHtml = '<a class="title" title="' + Helper.removeQuotes(this.title) + '" href="' + this.linkUrl + '">' + this.title + '</a>';
    rightColumn.append(titleHtml);
    
    var descriptionHtml = '<a class="description" title="' + Helper.removeQuotes(this.description) + '" href="' + this.linkUrl + '">' + this.description + '</a>'; 
    rightColumn.append(descriptionHtml);  
    
    if (this.imgUrl && this.imgTitle) {
      var imgHtml = '<img title="' + Helper.removeQuotes(this.imgTitle) + '" alt="' + Helper.removeQuotes(this.imgTitle) +  '" src="' + this.imgUrl + '" />';
      leftColumn.append(imgHtml);
    } else {
      //if there is no image in the headline, we add a class "no-image" so that the headline font-size can be bigger
      rightColumn.addClass('no-image');
    }
    
    //adds the event to open the links in a new tab
    element.find('a').on('click', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
    });
    
    return (element);
  }
    
}

module.exports = Headline;
},{"./Helper":2}],2:[function(require,module,exports){
"use strict";
/**
 * The helper class contains assorted functions
 * @class
 */

class Helper {
  
  /**
   * Remove quotes from input string
   * @method
   * @static
   * @param {string} inputString
   * @returns {string}
   */
  static removeQuotes(inputString) {
    return inputString.replace(new RegExp('"', 'g'), '');
  }
   
}

module.exports = Helper;
},{}],3:[function(require,module,exports){
"use strict";

var Headline = require('./Headline.js');

/**
 * Parses ZeroHora html pages
 * @class
 * 
 * @property rawContent     The raw HTML string content to be parsed
 * @property content        The jQuery element parsed from the HTML string
 */
class Parser {
    
  /**
   * @constructor
   * 
   * @param {string} content      The html content to be parsed.
   */
  constructor (content) {
      
    if ((!content) || (typeof content !== 'string'))
      throw new Error("Parser needs something to parse! Pass the HTML to the constructor.");
    
    this.rawContent = content;
    
    this.content = $(content);
  }
  
  /**
   * Parses the content, extracting the featured area headlines from the Zero Hora's Website.
   * @method
   * 
   * @returns {Headline[]}
   * 
   * @throws {Error} Throws error on parsing error.
   */
  parseFeaturedArea(){
    
    //the featured area is the one with the class "area-destaque"
    var featuredArea = this.content.find('.area-destaque');
    if (featuredArea.length === 0) {
      //no featured area
      return [];
    }
    
    return this.parseArea(featuredArea);
  }
  
  /**
   * Parses the content, extracting the first class="area-padrao" headlines from the Zero Hora's Website.
   * @method
   * 
   * @returns {Headline[]}
   * 
   * @throws {Error} Throws error on parsing error.
   */
  parseFirstAreaPadrao(){
   
    //the area we want is the one with the class "area-padrao"
    var standardArea = this.content.find('.area-padrao').first();
    if (standardArea.length === 0) {
      //no standardArea
      return [];
    }
    
    return this.parseArea(standardArea);
  }
  
  /**
   * Parses the content, extracting headlines from an area of the Zero Hora's Website.
   * @method
   * 
   * @param {Object} area   The jQuery element of the area to be parsed
   * 
   * @returns {Headline[]}
   * 
   * @throws {Error} Throws error on parsing error.
   */
  parseArea(area) {
    var headlines = [];
    
    //each headline sits inside a <div class="container-a">
    area.find('.container-a').each(function (index, containerA){
      
      //for convenience, turns the container-a into a jquery element
      containerA = $(containerA);
      
      var headline = new Headline(containerA);
      
      headlines.push(headline);
    });
    
    return headlines;
  }

}

module.exports = Parser;
},{"./Headline.js":1}],4:[function(require,module,exports){
"use strict";

/**
 * @file Main script for the Zero Hora Google Chrome Extension
 * 
 * @author Bruno Gabriel Fernandes
 */

var Parser = require('./Parser.js');

$(document).ready(function () {
    
  //load Zero Hora front-page
  fetch('http://zh.clicrbs.com.br/rs/')
  .then(function (response) {
    if (response.ok) {
      response.text().then(function (text) {
        
        
        createStoriesFromWebsiteContent(text);
        
      });   
    } else {
      showError();
    }
  });

});

function createStoriesFromWebsiteContent(content) {
  
  var parser = new Parser(content);
  var featuredHeadlines, otherHeadlines;
  $('#headlines').hide();
  
  try {
    featuredHeadlines = parser.parseFeaturedArea();
    otherHeadlines = parser.parseFirstAreaPadrao();
    
  } catch(err) {
    console.error(err);
    return showError();
  }
  
  featuredHeadlines.forEach(function(headline) {
    $('#headlines').append(headline.render());
  });
  otherHeadlines.forEach(function(headline) {
    $('#headlines').append(headline.render());
  });
  
  $('#loading').hide();
  $('#headlines').show();
}

function showError() {
  $('#loading').hide();
  $('#error').show();
}




},{"./Parser.js":3}]},{},[4]);
