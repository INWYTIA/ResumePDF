const inquirer = require("inquirer");
const fs = require('fs');
const convertFactory = require("electron-html-to");
const generateHTML = require('./generateHTML.js');

const questions = [
  {
      type: "input",
      message: "What is the Github username?",
      name: "username"
    },
    {
      type: "list",
      message: "Which color do you prefer?",
      name: "color",
      choices: ['red', 'green', 'blue', 'pink']
    }
];

function writeToFile(fileName, data) {
 
};

function init() {
  inquirer.prompt(
    questions
  ).then(function (a) {
    console.log(a)
  }
  );
};

init();
