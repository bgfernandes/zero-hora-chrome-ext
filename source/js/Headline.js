"use strict";

var Helper = require('./Helper');

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
 * @author Bruno Gabriel Fernandes
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