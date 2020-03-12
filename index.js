// implement your API here
const express = require("express");
const db = require("./data/db.js");
const server = express();
server.use(express.json());

server.listen(4000, () => {
  console.log("This is my server");
});

server.post("/api/users", (req, res) => {
  console.log("Req", req.body);
  const userData = req.body;
  console.log(userData);
  db.insert(userData)
    .then(data => {
      if (userData.name && userData.bio) {
        res.status(201).json({ data });
      } else {
        res
          .status(400)
          .json({ errorMessage: "Please provide name and bio for the user." });
      }
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "There was an error while saving the user to the database"
      });
    });
});

server.get("/api/users/", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json({ users });
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    });
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json({ user });
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "The user information could not be retrieved." });
    });
});

/// D as in Delete
server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(user => {
      if (user) {
        res.status(200).json({ message: `You deleted user ${id}` });
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "The user could not be removed" });
    });
});

//U as in Update
server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = req.body;
  db.update(id, user)
    .then(updated => {
      if (updated && user.name && user.bio) {
        res.status(200).json({ user });
      } else if (!user.name || !user.bio) {
        res
          .status(400)
          .json({ message: "Please provide name and bio for the user." });
      } else {
        res.status(404).json({
          errorMessage: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "The user information could not be modified."
      });
    });
});
