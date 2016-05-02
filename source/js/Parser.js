"use strict";

var Headline = require('./Headline.js');

/**
 * Parses ZeroHora html pages
 * @class
 * 
 * @property rawContent     The raw HTML string content to be parsed
 * @property content        The jQuery element parsed from the HTML string
 * 
 * @author Bruno Gabriel Fernandes
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