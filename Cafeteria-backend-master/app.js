const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
var firebase = require("firebase/app");
var cors = require("cors");
app.use(cors({ origin: "*" }));
require("firebase/storage");
require("firebase/firestore");
const { Storage } = require("@google-cloud/storage");

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

var firebaseConfig = {
  apiKey: "AIzaSyBR5o7T6auLKxOAiahhNraS8qV9ggFzDf4",
  authDomain: "pos-restaurant-e103b.firebaseapp.com",
  databaseURL: "https://pos-restaurant-e103b-default-rtdb.firebaseio.com",
  projectId: "pos-restaurant-e103b",
  storageBucket: "pos-restaurant-e103b.appspot.com",
  messagingSenderId: "864752482409",
  appId: "1:864752482409:web:05ea1f9515090d67d04af8",
  measurementId: "G-7LXYHN9DPF",
};
firebase.initializeApp(firebaseConfig);
var st = firebase.storage().ref();

const storage = new Storage({
  projectId: "pos-restaurant-e103b",
  keyFilename: "service-account.json",
});

app.put("/tables", function (req, res) {
  firebase
    .firestore()
    .collection("tables")
    .doc("table" + req.body.tableID)
    .update(req.body)
    .then(res.send());
});

app.put("/add-menu", function (req, res) {
  firebase
    .firestore()
    .collection("menu")
    .doc(req.body.menuData.id)
    .set(req.body.menuData)
    .then(res.send());
  res.send();
});

app.put("/update-menu", (req, res) => {
  firebase
    .firestore()
    .collection("menu")
    .doc(req.body.menuData.id)
    .update(req.body.menuData)
    .then(res.send());
  res.send();
});

app.delete("/menu/:id", async (req, res) => {
  await firebase.firestore().collection("menu").doc(req.params.id).delete();
  res.send();
});

app.get("/menu", function (req, res) {
  var menuData = [];
  firebase
    .firestore()
    .collection("menu")
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        var data = {};
        data = doc.data();
        var profit =
          doc.data().totalSales * doc.data().salePrice -
          doc.data().totalSales * doc.data().costPrice;
        data.profit = profit;
        menuData.push(data);
      });
      res.send(menuData);
    });
});

app.put("/menu", function (req, res) {
  firebase
    .firestore()
    .collection("menu")
    .doc(req.body.menuData.id)
    .update(req.body.menuData)
    .then(res.send());
  res.send();
});

app.get("/waiting-list/:capacity", function (req, res) {
  var list = [];
  firebase
    .firestore()
    .collection("waiting-list")
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        if (parseInt(req.params.capacity) == 0) {
          if (doc.data().comments == "Urgent") list.unshift(doc.data());
          else list.push(doc.data());
        } else if (parseInt(doc.data().partySize) <= req.params.capacity) {
          if (doc.data().comments == "Urgent") {
            list.unshift(doc.data());
          } else list.push(doc.data());
        }
      });
      res.send(list);
    });
});

app.put("/cleanTable/:tableID", function (req, res) {
  const data = {
    isEmpty: true,
    order: [],
    name: "",
    viewCheck: false,
    tempOrder: [],
    time: "",
    checkID: "",
  };
  firebase
    .firestore()
    .collection("tables")
    .doc("table" + req.params.tableID)
    .update(data);
  res.send();
});

app.listen(process.env.PORT || 5001);

app.get("/tables", function (req, res) {
  var list = [];
  firebase
    .firestore()
    .collection("tables")
    .get()
    .then((docs) => {
      if (!docs) res.send();
      else {
        docs.forEach((doc) => {
          list.push(doc.data());
        });
        res.send(list);
      }
    });
});

app.get("/chefView", function (req, res) {
  var list = [];
  firebase
    .firestore()
    .collection("tables")
    .get()
    .then((docs) => {
      if (!docs) res.send();
      else {
        docs.forEach((doc) => {
          if (doc.data().viewCheck === true) list.push(doc.data());
        });
        res.send(list);
      }
    });
});

app.put("/changeStatus/:id/:status", function (req, res) {
  var data = req.body;
  var status = req.params["status"];
  data.foodStatus = status - 1;
  firebase
    .firestore()
    .collection("tables")
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        if (doc.data().tableID == req.params["id"]) {
          firebase
            .firestore()
            .collection("tables")
            .doc("table" + req.params["id"])
            .update(data)
            .then(res.send());
        }
      });
      res.send();
    });
});

app.get("/counter", function (req, res) {
  firebase
    .firestore()
    .collection("counters")
    .get("waiting.list")
    .then((docs) => {
      docs.forEach((doc) => {
        res.send(doc.data());
      });
    });
});

app.get("/table/:id", function (req, res) {
  var list = [];
  firebase
    .firestore()
    .collection("tables")
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        if (doc.data().tableID == req.params["id"]) {
          list.push(doc.data());
        }
      });
      res.send(list);
    });
});

app.put("/waiting-list", function (req, res) {
  firebase
    .firestore()
    .collection("waiting-list")
    .doc(req.body.custData.id + "")
    .set(req.body.custData)
    .then(res.send());
});

app.put("/counter/:count", function (req, res) {
  firebase
    .firestore()
    .collection("counters")
    .doc("waiting-list")
    .update({ count: parseInt(req.params.count) })
    .then(res.send());
});

app.delete("/waiting-list/:id", function (req, res) {
  firebase
    .firestore()
    .collection("waiting-list")
    .doc(req.params.id + "")
    .delete()
    .then(res.send());
});
