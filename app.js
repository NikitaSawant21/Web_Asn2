/****************************************************************************** 
 * ITE5315 – Assignment 2
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source.
 * Name: Gurpreet Kaur  Student ID: N01752110  Date: 30-Jun-2025
 ******************************************************************************/

// Import required modules
var express = require("express"); // Load the Express framework
var path = require("path");       // Load path module for handling file paths
var app = express();              // Create an instance of an Express application
const exphbs = require("express-handlebars"); // Load Handlebars template engine
const fs = require('fs');
const bodyParser = require('body-parser');
const port = process.env.port || 3000; // Define port (default to 3000 if not provided)

// Middleware to serve static files (e.g., CSS, images, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up Handlebars as the view engine with `.hbs` extension
const hbs = exphbs.create({
  extname: ".hbs",
  helpers: {
    hasMetascore: function (metascore, options) {
      if (typeof metascore === 'string' && metascore.trim() !== '') {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    highlightIfNoMetascore: function (metascore) {
    const value = String(metascore || "").trim().toLowerCase();
    return (value === "" || value === "n/a") ? "highlight" : "";
}
  }
});

app.engine(".hbs", hbs.engine);
app.set("view engine", "hbs");




app.set("view engine", "hbs");

// Load JSON data from file
let moviesData = [];
fs.readFile('Movie_Data/movieData.json', 'utf8', (err, jsonData) => {
    if (err) {
        console.error('Error loading JSON file:', err);
    } else {
        moviesData = JSON.parse(jsonData); // Parse the JSON data
    }
});


// Home page route
app.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

// Users page route
app.get("/users", function (req, res) {
  res.render("users", { title: "Users Page" });
});

// /data route – show all movies
app.get("/data", function (req, res) {
  res.render("data", { title: "All Movies", movies: moviesData });
});

// /data/movie/:index – show movie by index
app.get("/data/movie/:index", function (req, res) {
  const index = parseInt(req.params.index);
  const movie = moviesData[index];
  res.render("movie", { title: "Movie Detail", movie });
});

// /data/search/id – GET: form page
app.get("/data/search/id", function (req, res) {
  res.render("search_form", { title: "Search by ID" });
});

// /data/search/id – POST: show result
app.post("/data/search/id", function (req, res) {
  const id = parseInt(req.body.movie_id);
  const movie = moviesData.find(m => parseInt(m.Movie_ID) === id);
  res.render("search_result", { title: "Search Result", movie });
});

app.get("/allData", function (req, res) {
  res.render("allData", { title: "All Movies (Table View)", movies: moviesData });
});

app.get("/filteredData", function (req, res) {
  res.render("filteredData", { title: "Movies with Metascore", movies: moviesData });
});


app.get("/highlightedData", function (req, res) {
  res.render("highlightedData", { title: "All Movies (Highlight Missing Metascore)", movies: moviesData });
});


// Fallback route for unmatched paths
app.use(function (req, res) {
  res.render("error", { title: "Error", message: "Wrong Route" });
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
