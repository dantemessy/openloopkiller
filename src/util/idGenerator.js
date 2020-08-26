'use strict';

module.exports = () => {
    return '_' + Math.random().toString(36).substr(2, 3);
  };