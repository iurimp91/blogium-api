import express from "express";
import cors from "cors";

const server = express();

server.use(cors());
server.use(express.json());

let posts = [
    {
        id: 1,
        title: 'Hello World',
        coverUrl: 'https://miro.medium.com/max/1024/1*OohqW5DGh9CQS4hLY5FXzA.png',
        contentPreview: 'Esta é a estrutura de um post esperado pelo front-end',
        content: 'Este é o conteúdo do post, o que realmente vai aparecer na página do post...',
        commentCount: 2
    }
];

const comments = [
    {
        id: 1,
        postId: 1,
        author: 'João',
        content: 'Muito bom esse post! Tá de parabéns'
    }, {
        id: 2,
        postId: 1,
        author: 'Maria',
        content: 'Como faz pra dar palmas?'
    }
];

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
    const newContent = content.replace('<p>', '').replace('</p>', '');
    const post = {
        id: Math.floor(Math.random() * 21), //VER SE FICA ASSIM
        title,
        coverUrl,
        contentPreview: newContent,
        content: newContent,
        commentCount: 0
    }
    posts.push(post);
    console.log(posts);
    res.send("Post adicionado com sucesso!");
});

server.post(`/posts/:id/comments`, (req, res) => {
    const postId = parseInt(req.params.id);
    posts.forEach((post) => {
        if(postId === post.id) {
            post.commentCount++;
        }
    });

    const comment = req.body;
    comment.id = Math.floor(Math.random() * 21); //VER SE FICA ASSIM
    comments.push(comment);
    console.log(comments);

    res.send("Comentário adicionado com sucesso!");
});

server.listen(5000);