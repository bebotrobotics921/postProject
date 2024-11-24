const { ensureAuthenticated } = require("../middleware/checkAuth");
import express from "express";
//import * database from "../controller/postController";
import { getSubs, getPosts } from "../fake-db";

const router = express.Router();

router.get("/list", async (req, res) => {
  // ⭐ TODO
  const subs = await getSubs();
  subs.sort((a, b) => a.localeCompare(b));
  
  res.render("subs", {subs});
});

router.get("/show/:subname", async (req, res) => {
  // ⭐ TODO
  const subname = req.params.subname;
  console.log(subname);
  const posts = await getPosts();
  const filterposts = posts.filter((post) => post.subgroup === subname);
  
  res.render("sub", {subname, filterposts});
 
});

export default router;
