import axios from 'axios'

const link = 'http://20.244.56.144/evaluation-service'
const t1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTYzMjgzLCJpYXQiOjE3NDQ5NjI5ODMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImY1YWUwNGE4LTFhNzgtNDc0Mi04NGE0LWYxZGViYTAxMmUwMiIsInN1YiI6ImthcnRpa2F5LnRyaXZlZGlfY3MyMkBnbGEuYWMuaW4ifSwiZW1haWwiOiJrYXJ0aWtheS50cml2ZWRpX2NzMjJAZ2xhLmFjLmluIiwibmFtZSI6ImthcnRpa2F5IHRyaXZlZGkiLCJyb2xsTm8iOiIyMjE1MDAwODg1IiwiYWNjZXNzQ29kZSI6IkNObmVHVCIsImNsaWVudElEIjoiZjVhZTA0YTgtMWE3OC00NzQyLTg0YTQtZjFkZWJhMDEyZTAyIiwiY2xpZW50U2VjcmV0IjoiZ2hCYkVwdWh3emRmUHZ1UiJ9.thSqZg-W-261J6LicAAAC1TrMebrFWIJTIgpX7xfomo"


const API_URL = 'http://20.244.56.144/evaluation-service/users';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTY0NDAzLCJpYXQiOjE3NDQ5NjQxMDMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImY1YWUwNGE4LTFhNzgtNDc0Mi04NGE0LWYxZGViYTAxMmUwMiIsInN1YiI6ImthcnRpa2F5LnRyaXZlZGlfY3MyMkBnbGEuYWMuaW4ifSwiZW1haWwiOiJrYXJ0aWtheS50cml2ZWRpX2NzMjJAZ2xhLmFjLmluIiwibmFtZSI6ImthcnRpa2F5IHRyaXZlZGkiLCJyb2xsTm8iOiIyMjE1MDAwODg1IiwiYWNjZXNzQ29kZSI6IkNObmVHVCIsImNsaWVudElEIjoiZjVhZTA0YTgtMWE3OC00NzQyLTg0YTQtZjFkZWJhMDEyZTAyIiwiY2xpZW50U2VjcmV0IjoiZ2hCYkVwdWh3emRmUHZ1UiJ9.xPoRBDp2fk1IKaFxHxEJ1j7tcvMaN8pMAMNvEgybZvQ'; // Replace this with your actual token

async function getUserNoSorting(req, res) {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${AUTH_TOKEN}`
            }
        });

        console.log('Users:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
    }
}


const axios = require('axios');
const link = 'http://20.244.56.144/evaluation-service';

const api = axios.create({
    baseURL: link,
    headers: {
        Authorization: AUTH_TOKEN,
    }
});

async function getTopUsers(req, res) {
    const t1 = Date.now();


    try {
        //gettin all user
        const userRes = await api.get('/users');
        const users = userRes.data.users;
        const ids = Object.keys(users);

        //getting post and fetch fro evry usr
        const userStats = await Promise.all(ids.map(async (id) => {
            const postsRes = await api.get(`/users/${id}/posts`);
            const posts = postsRes.data.posts;

            //getting total comments across all post
            const commentCounts = await Promise.all(posts.map(async (post) => {
                const commentsRes = await api.get(`/posts/${post.id}/comments`);
                return commentsRes.data.comments.length;
            }));

            const totalComments = commentCounts.reduce((a, b) => a + b, 0);

            return {
                id,
                name: users[id],
                totalComments,
                postCount: posts.length
            };
        }));

        userStats.sort((a, b) => b.totalComments - a.totalComments);
        const topUsers = userStats.slice(0, 5);

        res.json({
            topUsers,
            executionTime: `${Date.now() - t1}ms`
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Something went wrong',
            details: err.message
        });
    }
}


function getPosts(req, res) {

    const t2 = Date.now()

    const tp = req.query.type || 'popular'

    axios.get(link + '/users').then(r => {

        const u = r.data.users
        const ids = Object.keys(u)
        const all = []
        let i = 0

        function loopU() {
            if (i >= ids.length) {
                if (tp === 'latest') {
                    all.sort((a, b) => b.id - a.id)
                    const lst = all.slice(0, 5).map(p => {
                        p.userName = u[p.userid]
                        return p
                    })
                    res.json({posts: lst, executionTime: (Date.now() - t2) + 'ms'})
                } else {
                    let mx = 0
                    const newPosts = []
                    let j = 0

                    function loopP() {
                        if (j >= all.length) {
                            const f = newPosts.filter(p => p.commentCount === mx)
                            res.json({posts: f, executionTime: (Date.now() - t2) + 'ms'})
                            return
                        }

                        const p = all[j]
                        axios.get(link + '/posts/' + p.id + '/comments').then(c => {
                            const len = c.data.comments.length
                            if (len > mx) mx = len
                            p.commentCount = len
                            p.userName = u[p.userid]
                            newPosts.push(p)
                            j++
                            loopP()
                        })
                    }

                    loopP()
                }

                return
            }

            const id = ids[i]
            axios.get(link + '/users/' + id + '/posts').then(p => {
                const ps = p.data.posts
                all.push(...ps)
                i++
                loopU()
            })
        }

        loopU()
    })
}

export {
    getTopUsers,
    getPosts,
    getUserNoSorting
}
