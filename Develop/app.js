const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { deflateRawSync } = require("zlib");

// calling the getUserData function to start the prompts
getUserData()
// Defining an array to hold the user data objects as they are generated
userData = []

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
function getUserData() {
  return inquirer.prompt([
    {
      type: "list",
      message: "What type of employee are you creating?",
      name: "role",
      choices: [
        "Engineer",
        "Intern",
        "Manager"
      ]
    },
    {
      type: "input",
      name: "name",
      message: "What is the employee's name?",
      // validate: function(value){
      //   var pass = value.match(
      //     /^[A-Za-z]+$/ 
      //   )
      //   if (pass) {
      //     return true
      //   }

      //   return "Please enter a valid name."
      // }
    },
    {
        type: "input",
        name: "Id",
        message: "What is the employee's ID number?",
        // validate: function(value){
        //   var pass = value.match(
        //     /^[0-9]+$/
        //   )
        //   if (pass) {
        //     return true
        //   }

        //   return "Please enter a valid ID number."
        // }
      },
      {
        type: "input",
        name: "email",
        message: "What is the employee's email address?",
        // validate: function(value){
        //   var pass = value.match(
        //     /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ 
        //   )
        //   if (pass) {
        //     return true
        //   }

        //   return "Please enter a valid email address."
        // }
      },
      {
        type: "input",
        name: "officeNumber",
        message: "What is this manager's office number?",
        when: (answers) => answers.role === 'Manager',
        // validate: function(value){
        //   var pass = value.match(
        //     /^[0-9]+$/
        //   )
        //   if (pass) {
        //     return true
        //   }

        //   return "Please enter a valid office number."
        // }
      }, 
      {
        type: "input",
        name: "github",
        message: "What is this engineer's Github username?",
        when: (answers) => answers.role === 'Engineer'
      },
      {
        type: "input",
        name: "school",
        message: "Where did this intern go to school?",
        when: (answers) => answers.role === 'Intern',
        // validate: function(value){
        //   var pass = value.match(
        //     /^[0-9a-zA-Z]+$/
        //   )
        //   if (pass) {
        //     return true
        //   }

        //   return "Please enter a valid school name."
        // }
      },

    // After the user has input all employees desired, call the `render` function (required
    // above) and pass in an array containing all employee objects; the `render` function will
    // generate and return a block of HTML including templated divs for each employee!

  ]).then(function (data) {
    console.log(data)

    switch (data.role) {
      case "Engineer":
        let eng = new Engineer(data.name, data.Id, data.email, data.github)
        userData.push(eng)
        break;

      case "Manager":
        let man = new Manager(data.name, data.Id, data.email, data.officeNumber)
        userData.push(man)
        break;

      case "Intern":
        let int = new Intern(data.name, data.Id, data.email, data.school)
        userData.push(int)
        break;
    }
    return inquirer.prompt([
      {
        type: "list",
        message: "Another employee?",
        name: "again",
        choices: [
          "Yes",
          "No"
        ]
      },
    ])
  }).then(function (goAgain) {
    if (goAgain.again === 'Yes') {
      return getUserData();
    } 
    
    else {
      console.log('else', userData)
      let found = false

      for (let i = 0; i < userData.length; i++) {
        console.log('userdata[i]', userData[i])

        if(userData[i] === "Manager"){
          found = true
          return fs.writeFileSync(outputPath,render(userData),'utf-8')
        }
      }

      if(found = false) {
        console.log("You must create at least one manager in your team")
        //   return getUserData()
      }


    }
  })
  .catch(err => console.log(err))
}



// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.   
// ***********THIS IS COMPLETE*****************

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
