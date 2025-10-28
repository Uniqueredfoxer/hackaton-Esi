
const userModel = {
    id: String,
    username: String,
    email: String,
    role: String,
    scores: Number,
    passwordHash: String,
    accountAge: Date,
    profilePictureUrl: String,
    bio: String,
}


const docModel ={
    id: String,
    title: String,
    description: String,
    authorId: String,
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
    id: String,
    title: String,
    description: String,
    authorId: String,
    tags: [String],
    scores: Number,
    views: Number,
    commentsNumber: Number, 
    isResolved: Boolean,
    imageUrl: String,
    postedAT: Date,
}

const commentModel = {
    id: String,
    postId: String,
    authorId: String,
    content: String,
    postedAT: Date,
    score: Number,
    repliesNumber: Number,
}

const userFollows={
    followerId: String,
    followingId: String,
    followedAt: Date,
}