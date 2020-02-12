const inquirer = require("inquirer");
const fs = require('fs');
const util = require("util");
const generateHTML = require('./generateHTML.js');
const axios = require('axios');
const pdf = require('html-pdf');

const readFileAsync = util.promisify(fs.readFile);

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

function buildData (url1) {
  return new Promise(function(resolve, reject) {
    if (url1 === `https://api.github.com/users/`) {
      return reject(Error('Please enter a username.'));
    };
    axios.get(url1).then(function(result) {
      userData.name = result.data.name;
      userData.img = result.data.avatar_url;
      userData.location = result.data.location;
      userData.link = result.data.html_url;
      userData.repos = result.data.public_repos;
      userData.followers = result.data.followers;
      userData.following = result.data.following;
      const username = result.data.login;
      return `https://api.github.com/users/${username}/repos?per_page=100`;
    }).then(function (url2) {
      return starData (url2);
    }).then(function (stars) {
      userData.stars = stars;
      return resolve(userData);
    });
  });
};

function starData (url) {
  return new Promise(function(resolve, reject) {
    if (url === `https://api.github.com/users//repos?per_page=100`) {
      return reject(Error('Please enter a username.'));
    };
    var userStars = 0;
    axios.get(url).then(function(stars) {
      stars.data.forEach(function (repos) {
        userStars = userStars + repos.stargazers_count;
      });
      return resolve(userStars);
    });
  })
};

function writeToFile(fileName, data) {
  return new Promise(function (resolve) {
    fs.writeFile(fileName, data, err => {
    if (err) {
      return console.log(err);
    };
    resolve(fileName)
  });
  });
};

function init() {
  return inquirer.prompt(questions);
};

init().then(function (ans) {
  userData.color = ans.color;
  const queryUserUrl = `https://api.github.com/users/${ans.username}`;
  const filePath = `${ans.username}.html`;
  buildData(queryUserUrl).then(function (data) {
    const html = generateHTML.generateHTML(data);
    writeToFile(filePath,html).then(function (path) {
      console.log(path);
      readFileAsync(path, 'utf8').then(function (data) {
        console.log(data);
        pdf.create(data).toFile(`${userData.name}.pdf`, function(err, res) {
          if (err) return console.log(err);
          console.log(res);
        });
      }).catch(function(err) {
        console.log(err);
      });
    });
  }).catch(function(err) {
    console.log(err);
  });
});
  