'use strict';

//! Jason- creates a unique ID for user
const uuid = require('uuid/v1');

class GroceryList {
  constructor(groceryListName, groceryItem) {
    this.id = uuid();
    this.timestamp = new Date();

    this.name = groceryListName;
    this.item = groceryItem;
  }
}

module.exports = GroceryList;
