const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

function generateRandomID() {
  return 1234;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Hello!");
});



app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: "http://www.lighthouselabs.ca", shortURL: req.params.id };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const longURL = req.body.longURL;
  const id = generateRandomID();
  urlDatabase[id] = longURL;
  console.log(urlDatabase[id]);
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});


app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

// login page - GET
app.post('/login', (req, res) => {
  console.log(req.body.username);
  res.cookie("username", req.body.username).redirect("/urls");
});

app.get("/urls", (req, res) => {
  //route to urls ejs flie and return render based on the template vars
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.post('/logout', (req, res) => {
  console.log(req.body.username);
  res.clearCookie("username");
  res.redirect("/urls");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


