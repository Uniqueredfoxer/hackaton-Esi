
const userModel = {
    uuid: String,
    username: String,
    email: String,
    passwordHash: String,
    accountAge: Date,
    profilePictureUrl: String,
    bio: String,
    followers: [userId_1, userId_2],
    following: [userId_3, userId_4],
    posts: [postId_1, postId_2],
    comments: [commentId_1, commentId_2],
    likedPosts: [postId_3, postId_4],
    likedComments: [commentId_3, commentId_4],
}


const docModel ={
    uuid: String,
    title: String,
    description: String,
    author: String,
    year: Number,
    category: String,
    level: String,
    uploadDate: Date,
    tags: [String],
    fileUrl: String,
    fileSize: Number,
    fileType: String,
    thumbnailUrl: String,
    downloads: Number,
}

const postModel = {
    uuid: String,
    title: String,
    description: String,
    tags: [String],
    author: String,
    tags: [String],
    postedAT: Date,
    coomments: [comment_id_1, comment_id_2],
    scores: Number,
    views: Number,
    commentsNumber: Number,
}

const commentModel = {
    uuid: String,
    postId: String,
    author: String,
    content: String,
    postedAT: Date,
    scores: Number,
    replies: [comment_id_1, comment_id_2],
    repliesNumber: Number,
}