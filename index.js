const inquirer = require("inquirer");
const fs = require('fs');
const convertFactory = require("electron-html-to");
const generateHTML = require('./generateHTML.js');
const axios = require('axios');

const userData = {
  name: '',
  color: '',
  img: '',
  location: '',
  link: '',
  repos: 0,
  followers: 0,
  following: 0,
  stars: 0,
};

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
  return inquirer.prompt(questions);
};

init().then(function (ans) {
  userData.color = ans.color;
  const queryUserUrl = `https://api.github.com/users/${ans.username}`;
  axios.get(queryUserUrl).then(function(result) {
    userData.name = result.data.name;
    userData.img = result.data.avatar_url;
    userData.location = result.data.location;
    userData.link = result.data.html_url;
    userData.repos = result.data.public_repos;
    userData.followers = result.data.followers;
    userData.following = result.data.following;
    const username = result.data.login
  });
  return `https://api.github.com/users/${username}/repos?per_page=100`;
}).then(function (url) {
  let userStars = 0;
  axios.get(url).then(function(stars) {
    stars.data.forEach(function (repos) {
      userStars += repos.stargazers_count;
    });
  });
  return userStars;
}).then(function (starCount) {
  userData.stars = starCount;
  return userData;
}).then(function (data) {
  const html = generateHTML.generateHTML(data);
  //fix the below two functions
  writeToFile(,);
  return readFile(,);
})
// then convert to pdf
