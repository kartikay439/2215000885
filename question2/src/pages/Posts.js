import React, { useEffect, useState } from 'react';

const Posts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/posts')
            .then(res => res.json())
            .then(data => setPosts(data.posts));
    }, []);

    return (
        <div>
            <h2>Posts</h2>
            {posts.map(post => (
                <div key={post.id}>{post.post}</div>
            ))}
        </div>
    );
};

export default Posts;
