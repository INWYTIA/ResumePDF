const inquirer = require("inquirer");
const fs = require('fs');
const convertFactory = require("electron-html-to");
const generateHTML = require('./generateHTML.js');
const axios = require('axios');
// const conversion = convertFactory({
//   converterPath: convertFactory.converters.PDF
// });

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
  fs.writeFile(fileName, data, err => {
    if (err) {
      return console.log(err);
    };
  });
};

function init() {
  return inquirer.prompt(questions);
};

init().then(function (ans) {
  userData.color = ans.color;
  const queryUserUrl = `https://api.github.com/users/${ans.username}`;
  buildData(queryUserUrl).then(function (data) {
    console.log(data);
    const html = generateHTML.generateHTML(data);
    writeToFile(`${ans.username}.html`,html);
  }).catch(function(err) {
    console.log(err);
  });
});
  // fs.readFile(`${userData.login}.html`, function (err, data) {
  //   if (err) {
  //     return console.log(err);
  //   };
  //   conversion({ html: data }, (err, result) => {
  //     if (err) {
  //       return console.error(err);
  //     };
  //     result.stream.pipe(fs.createWriteStream(`${userData.login}.pdf`));
  //   });
  // });