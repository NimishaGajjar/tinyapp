////////////////////TINYAPP SERVER FILE/////////////////////


//Server file, packages
const express = require("express");
const cookieParser = require("cookie-parser");

////////////////////////////////////////////////////////////

//server details
const app = express();
const PORT = 8080; // default port 8080

////////////////////////////////////////////////////////////

app.set("view engine", "ejs");//ejs setup for page
app.use(express.urlencoded({ extended: true })); //
app.use(cookieParser()); //cookieParser set to use as encoding for cookies

////////////////////////////////////////////////////////////

// URL DATABASE
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//JSON DATAS
//url database in json format and route for .json urls
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// USER DATABASE
const users = {
  user1: { id: "darsh", email: "darsh@hotmail.com", password: "darshnimi123" },
};

///////////////////////////////////////////////////////////

// HELPER FUNCTIONS
const generateRandomString = (database) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    randomString += characters[Math.floor(Math.random() * characters.length)];
  }
  if (database[randomString]) {
    generateRandomString(database);
  }

  return randomString;
};

////
const findUserByEmail = (email) => {
  for (const user in users) {
    console.log(user);
    console.log(user[user]);
    console.log(email);
    if (users[user].email === email) {
      return users[user];
    }
  }
  return null;
};

////
const addUrl = (url) => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "http://" + url;
  }
  return url;
};



//////////////////////URL DATA//////////////////////////////////
//for home page
app.get("/", (req, res) => {
  res.send("Hello!");//checking that is working or not 
});

//for route to url
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies.user_id] };
  res.render("urls_index", templateVars);
});

//route to urlsnew
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies.user_id] };//before was username getting error!!
  res.render("urls_new", templateVars);
});
app.post("/urls", (req, res) => {
  const randomString = generateRandomString(urlDatabase);
  urlDatabase[randomString] = addUrl(req.body.longURL);
  res.redirect("/urls/${randomString}");
});

//deletes from urlDatabase
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

//route to urls show ejs flie
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies.user_id] };
  res.render("urls_show", templateVars);
});

//redirect to longUrl
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

//
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = addUrl(req.body.longURL);
  res.redirect("/urls/${req.params.id}"); //redirects back to the same view
});


////////////////////////////////////////////////////////////////////
//time for register 

app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies.user_id] };
  res.render("user_registration", templateVars);
});

//saving user setting 
app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    console.log("Incomplete Form");
    return res.status(400).send("Email and password are required.");
  }
  //Check if user avaliable already
  if (findUserByEmail(req.body.email) !== null) {
    return res.status(400).send("Already exists.");
  }
  //if not then create new user
  const userId = "user" + generateRandomString(users);
  users[userId] = {
    id: userId,
    email: req.body.email,
    password: req.body.password,
  };

  //redirecting to url and setting cookie
  res.cookie("user_id", userId);
  console.log("User Database", users);
  res.redirect("/urls");
});

////////////////////////Now time to login///////////////////////

app.get("/login", (req, res) => {
  const templateVars = { user: users[req.cookies.user_id] };
  res.render("user_login", templateVars);
});

app.post("/login", (req, res) => {
  console.log(users);
  console.log(req.body);
  console.log(findUserByEmail(req.body.email));
  if (!findUserByEmail(req.body.email)) {
    return res.status(403).send("Invalid email or password");
  }
  const userId = findUserByEmail(req.body.email).id;
  if (users[userId].password !== req.body.password) {
    return res.status(403).send("Invalid email or password");
  }

  //sets cookie 
  res.cookie("user_id", userId);
  res.redirect("/urls");
});

//deleting cookie when user log out 
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});


///////////////////////////////////////////////////////////

// server can listen us:)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


