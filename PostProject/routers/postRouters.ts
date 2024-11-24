import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { getPosts, getPost, addPost, editPost, deletePost, addComment } from "../fake-db";

router.get("/", async (req, res) => {
  const posts = await getPosts(20);
  const user = await req.user;
  res.render("posts", { posts, user });
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts");
});

router.post("/create", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
  const { title, url, creator, description, subgroup } = req.body;
  const newPost = addPost(title, url, creator, description, subgroup);
  res.redirect(`/posts/show/${newPost.id}`);
});

router.get("/show/:postid", async (req, res) => {
  // ⭐ TODO  
  const postId = Number(req.params.postid);
  const post = await getPost(postId);
  const user = await req.user;
  res.render("individualPost", {post, user});
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
  const postId = Number(req.params.postid);
  const post = await getPost(postId);
  
  //Render the edit form with the current post data
  res.render("editPost", {post});
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO 
  const postId = Number(req.params.postid);
  const { title, description } = req.body;
  const postToEdit = await editPost(postId, {title, description});

  res.redirect(`/posts/show/${postToEdit}`);
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
  const postId = req.params.postid;
  const post = getPosts(Number(postId));
  //check if post exists
  if(!post) {
    return res.status(404).render('error', { message: 'Post not found'});
  }
  //Check if its an authenticated user
  /*if (post.creator !== getUser(postId)) {
    return res.status(403).render('error', { message: 'Unauthorized to edit this post' });
  }*/
  await deletePost(Number(postId));
  res.render('deleteConfirm', {post});
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
  const postId = Number(req.params.postid);
  const post = await getPost(postId);
  // Check if the post exists
  if (!post) {
    return res.status(404).render('error', { message: 'Post not found' });
  }
  //Check if its an authenticated user
  /*if (post.creator !== getUser(postId)) {
    return res.status(403).render('error', { message: 'Unauthorized to edit this post' });
  }*/
  //Delete the post
  await deletePost(postId);
  // Redirect back to subgroup the post belonged to
  res.redirect('/subs/show/${post.subId}');
});

router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    // ⭐ TODO
    const postId = Number(req.params.postid);
    const { description } = req.body;
    if(!description){
      return res.redirect(`/posts/show/${postId}`);
    }

    await addComment(postId, description, '');
    res.redirect(`/posts/show/${postId}`);

  }
);
/** 
router.post(
  "/vote/:postid",
  ensureAuthenticated, 
  async (req, res) => {
    const postId = Number(req.params.postid);
    const { setvoteto } = req.body;
    if (![1, -1, 0].includes(parseInt(setvoteto))) {
      return res.status(400).send("Invalid vote value.");
    }
    const post = await getPost(postId);
    if(!post) {
      return res.status(404).send("Post not found");
    }
    await getVotesForPost(postId);
    
    res.redirect(`/posts/show/${postId}`);
  }
)*/
export default router;
