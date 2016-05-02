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



