import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory,
} from "react-router-dom";

const initialUsers = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
  { id: "u3", name: "Charlie" },
];

const initialPosts = [
  {
    id: "p1",
    title: "Hello world",
    content: "This is my first post",
    authorId: "u1",
    reactions: [0, 0, 0, 0, 0],
  },
  {
    id: "p2",
    title: "Another day",
    content: "React is fun",
    authorId: "u2",
    reactions: [0, 0, 0, 0, 0],
  },
];

function App() {
  const [users] = useState(initialUsers);
  const [posts, setPosts] = useState(initialPosts);
  const [notifications, setNotifications] = useState([]);

  const addPost = (post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const updatePost = (id, updated) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const addReaction = (postId, index) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        if (index === 4) return p;
        const newReactions = [...p.reactions];
        newReactions[index] = newReactions[index] + 1;
        return { ...p, reactions: newReactions };
      })
    );
  };

  const refreshNotifications = () => {
    setNotifications([
      { id: "n1", text: "Alice liked your post" },
      { id: "n2", text: "Bob commented" },
    ]);
  };

  return (
    <Router>
      <div className="App" style={{ padding: 20 }}>
        <header>
          <h1>GenZ</h1>
        </header>

        {/* nav with <Link>, renders <a> in DOM */}
        <nav>
          <Link to="/">Posts</Link> |{" "}
          <Link to="/users">Users</Link> |{" "}
          <Link to="/notifications">Notifications</Link>
        </nav>

        <main style={{ marginTop: 20 }}>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <PostsPage
                  posts={posts}
                  users={users}
                  addReaction={addReaction}
                  addPost={addPost}
                />
              )}
            />
            <Route
              exact
              path="/users"
              render={() => <UsersPage users={users} />}
            />
            <Route
              path="/users/:userId"
              render={() => <UserDetails users={users} posts={posts} />}
            />
            <Route
              path="/notifications"
              render={() => (
                <NotificationsPage
                  notifications={notifications}
                  refreshNotifications={refreshNotifications}
                />
              )}
            />
            <Route
              path="/posts/:postId"
              render={() => (
                <PostDetails
                  posts={posts}
                  updatePost={updatePost}
                  users={users}
                  addReaction={addReaction}
                />
              )}
            />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

function PostsPage({ posts, users, addReaction, addPost }) {
  return (
    <section>
      <div className="posts-list">
        <div>Posts list header</div>
        {posts.map((post) => (
          <article
            key={post.id}
            className="post"
            style={{ border: "1px solid #ddd", padding: 8, margin: 8 }}
          >
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <div>
              Author: {users.find((u) => u.id === post.authorId)?.name || "Unknown"}
            </div>

            <div className="reactions">
              {post.reactions.map((count, idx) => (
                <button key={idx} onClick={() => addReaction(post.id, idx)}>
                  {idx < 4 ? `React ${idx + 1}: ${count}` : `Locked: ${0}`}
                </button>
              ))}
            </div>

            {/* navigate with Link */}
            <Link className="button" to={`/posts/${post.id}`}>
              View
            </Link>
          </article>
        ))}
      </div>

      <hr />
      <CreatePostForm users={users} addPost={addPost} />
    </section>
  );
}

function CreatePostForm({ users, addPost }) {
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState(users[0]?.id || "");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    const newPost = {
      id: "p_" + Math.random().toString(36).slice(2, 9),
      title,
      content,
      authorId,
      reactions: [0, 0, 0, 0, 0],
    };
    addPost(newPost);
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <h2>Create Post</h2>
      <div>
        <label>Title</label>
        <br />
        <input
          id="postTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label>Author</label>
        <br />
        <select
          id="postAuthor"
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Content</label>
        <br />
        <textarea
          id="postContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <button type="submit">Add Post</button>
    </form>
  );
}

function UsersPage({ users }) {
  return (
    <section>
      <h2>Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            <Link to={`/users/${u.id}`}>{u.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function UserDetails({ users, posts }) {
  const { userId } = useParams();
  const user = users.find((u) => u.id === userId);
  const userPosts = posts.filter((p) => p.authorId === userId);

  if (!user) return <p>User not found</p>;

  return (
    <section>
      <h2>{user.name}</h2>
      <h3>User Posts</h3>
      {userPosts.length > 0 ? (
        userPosts.map((p) => (
          <article
            key={p.id}
            className="post"
            style={{ border: "1px solid #ccc", padding: 8, margin: 8 }}
          >
            <h4>{p.title}</h4>
            <p>{p.content}</p>
          </article>
        ))
      ) : (
        <p>No posts</p>
      )}
    </section>
  );
}

function NotificationsPage({ notifications, refreshNotifications }) {
  return (
    <section>
      <h2>Notifications</h2>
      <button className="button" onClick={refreshNotifications}>
        Refresh Notifications
      </button>

      <section className="notificationsList" style={{ marginTop: 12 }}>
        {notifications.length > 0 &&
          notifications.map((n) => <div key={n.id}>{n.text}</div>)}
      </section>
    </section>
  );
}

function PostDetails({ posts, updatePost, users, addReaction }) {
  const { postId } = useParams();
  const history = useHistory();
  const post = posts.find((p) => p.id === postId);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");

  if (!post) return <div>Post not found</div>;

  const handleSave = () => {
    updatePost(post.id, { title, content });
    setEditing(false);
  };

  return (
    <section>
      <article className="post" style={{ border: "1px solid #aaa", padding: 12 }}>
        {!editing ? (
          <>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <div>Author: {users.find((u) => u.id === post.authorId)?.name}</div>

            <div className="reactions">
              {post.reactions.map((count, idx) => (
                <button key={idx} onClick={() => addReaction(post.id, idx)}>
                  {idx < 4 ? `React ${idx + 1}: ${count}` : `Locked: ${0}`}
                </button>
              ))}
            </div>

            <button className="button" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button onClick={() => history.goBack()}>Back</button>
          </>
        ) : (
          <>
            <div>
              <label>Title</label>
              <br />
              <input
                id="postTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label>Content</label>
              <br />
              <textarea
                id="postContent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <button onClick={() => setEditing(false)}>Cancel</button>
            <button onClick={handleSave}>Save</button>
          </>
        )}
      </article>
    </section>
  );
}

export default App;
