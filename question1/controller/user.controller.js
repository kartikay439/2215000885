import axios from 'axios'

const link = 'http://20.244.56.144/evaluation-service'

function getTopUsers(req, res) {

    const t1 = Date.now()

    axios.get(link + '/users').then(r => {
        const u = r.data.users
        const arr = []

        const ids = Object.keys(u)

        let i = 0

        function loopUser() {
            if (i >= ids.length) {
                arr.sort((a, b) => b.totalComments - a.totalComments)
                res.json({
                    topUsers: arr.slice(0, 5),
                    executionTime: (Date.now() - t1) + 'ms'
                })
                return
            }

            const id = ids[i]
            axios.get(link + '/users/' + id + '/posts').then(p => {
                const posts = p.data.posts
                let count = 0
                let j = 0

                function loopPost() {
                    if (j >= posts.length) {
                        arr.push({
                            id: id,
                            name: u[id],
                            totalComments: count,
                            postCount: posts.length
                        })
                        i++
                        loopUser()
                        return
                    }

                    const pid = posts[j].id
                    axios.get(link + '/posts/' + pid + '/comments').then(c => {
                        count += c.data.comments.length
                        j++
                        loopPost()
                    })
                }

                loopPost()
            })
        }

        loopUser()
    })
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
                    res.json({ posts: lst, executionTime: (Date.now() - t2) + 'ms' })
                } else {
                    let mx = 0
                    const newPosts = []
                    let j = 0

                    function loopP() {
                        if (j >= all.length) {
                            const f = newPosts.filter(p => p.commentCount === mx)
                            res.json({ posts: f, executionTime: (Date.now() - t2) + 'ms' })
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
    getPosts
}
