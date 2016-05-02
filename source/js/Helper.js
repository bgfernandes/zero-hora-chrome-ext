"use strict";
/**
 * The helper class contains assorted functions
 * @class
 * 
 * @author Bruno Gabriel Fernandes
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