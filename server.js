import express from "express";
import cors from "cors";
import fs from "fs";

const server = express();

server.use(cors());
server.use(express.json());

let posts = [];
let postsId = 1;

if(fs.existsSync("./posts.json")) {
    posts = JSON.parse(fs.readFileSync('./posts.json'));
    postsId = posts.length + 1;
}

let comments = [];
let commentsId = 1;

if(fs.existsSync("./comments.json")) {
    comments = JSON.parse(fs.readFileSync('./comments.json'));
    commentsId = comments.length + 1;
}

server.get("/posts", (req, res) => {
    res.send(posts);
});

server.get("/posts/:id", (req, res) => {
    const id = req.params.id;
    const [ post ] = posts.filter(item => item.id === parseInt(id));
    res.send(post);
});


server.get("/posts/:id/comments", (req, res) => {
    const id = req.params.id;
    const postComments = comments.filter(item => item.postId === parseInt(id));
    res.send(postComments);
});

server.post("/posts", (req, res) => {
    const { title, coverUrl, content } = req.body;

    if(!title) {
        return res.status(400).send("Está faltando o título.");
    } else if (!coverUrl) {
        return res.status(400).send("Está faltando a imagem.");
    } else if(!content) {
        return res.status(400).send("Está faltando o conteúdo.");
    }

    const newContent = content.replace('<p>', '').replace('</p>', '');
    const id = postsId++;
    const post = {
        id,
        title,
        coverUrl,
        contentPreview: newContent,
        content: newContent,
        commentCount: 0
    }

    posts.push(post);
    res.send("Post adicionado com sucesso!");

    fs.writeFileSync("posts.json", JSON.stringify(posts));
});

server.post(`/posts/:id/comments`, (req, res) => {
    const postId = parseInt(req.params.id);
    const { author, content } = req.body;

    if(!author) {
        return res.status(400).send("Está faltando o autor.");
    } else if (!content) {
        return res.status(400).send("Está faltando o conteúdo.");
    }

    posts.forEach((post) => {
        if(postId === post.id) {
            post.commentCount++;
        }
    });

    const comment = {
        author,
        content,
        postId: postId,
        id: commentsId++,
    }
    comments.push(comment);

    res.send("Comentário adicionado com sucesso!");

    fs.writeFileSync("comments.json", JSON.stringify(comments));
    fs.writeFileSync("posts.json", JSON.stringify(posts));
});

server.put("/posts/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const { content, title, coverUrl } = req.body;

    posts.forEach(post => {
        if(post.id === postId) {
            post.content = content;
            post.title = title;
            post.coverUrl = coverUrl;
        }
    });    

    res.send("Post alterado com sucesso!");

    fs.writeFileSync("posts.json", JSON.stringify(posts));
});

server.delete("/posts/:id", (req, res) => {
    const postId = parseInt(req.params.id);

    posts = posts.filter((post) => {
        postId !== post.id;
        console.log(postId);
        console.log(post.id);
    });

    console.log(posts);

    comments = comments.filter((comment) => {
        postId !== comment.postId;
    });

    res.send("Post deletado com sucesso!");

    fs.writeFileSync("posts.json", JSON.stringify(posts));
    fs.writeFileSync("comments.json", JSON.stringify(comments));
});

server.listen(5000);