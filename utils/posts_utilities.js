const fs = require("fs")
let dataFile = "data/blog_posts.json"
let blogPosts = require(`../${dataFile}`)

function getAllPosts(req) {
	return blogPosts
}

function getPostById(req) {
	let post = blogPosts[req.params.id]
	// if no post, set req.error 
	if(post) return post
	req.error = "Post not found"
}

function addPost(req) {
	try {
		const {title, username, content, category} = req.body
		const date = Date.now()
		const newPost = {
			title: title,
			username: username,
			content: content,
			create_date: date,
			modified_date: date,
			category: category || ""
		}
		// Add to blogPosts (in memory)
		blogPosts[getNextId()] = newPost
		// Save updated blogPosts to the file
		fs.writeFileSync(`./${dataFile}`, JSON.stringify(blogPosts))
		return newPost
	}
	catch(error) {
		req.error = error
	}
}

// deletePost
function deletePost(req) {
	const id = req.params.id

	try {
		if (blogPosts[id]){
			delete blogPosts[id]
			// update the file
			// Save updated blogPosts to the file
			fs.writeFileSync(`./${dataFile}`, JSON.stringify(blogPosts))
		} 
		else {
			req.status = 400
			req.error = "Post not found"
		}
		return blogPosts
	}
	catch(error) {
		req.status = 500
		req.error = error
	}
}

function updatePost(req) {
	try {
		let id = req.params.id
		let existingPost = blogPosts[id]
		if(existingPost) {
			const {title, username, content, category} = req.body
			const date = Date.now()
			const updatedPost = {
				title: title,
				username: username,
				content: content,
				create_date: existingPost.create_date,
				modified_date: date,
				category: category || existingPost.category
			}
			blogPosts[id] = updatedPost
			// update the file
			// Save updated blogPosts to the file
			fs.writeFileSync(`./${dataFile}`, JSON.stringify(blogPosts))
			return updatedPost
		}
		else {
			req.status = 400
			req.error = "Post not found"
		}
	}
	catch(error) {
		req.status = 500
		req.error = error
	}
}

// helper for testing
function loadData(file) {
	dataFile = file
	blogPosts = JSON.parse(fs.readFileSync(file, 'utf8'))
}

// helper function to generate unique id
function getNextId() {
	let ids = Object.keys(blogPosts).sort()
	let lastId = (ids.length > 0) ? ids[ids.length-1] : 0
	return parseInt(lastId) + 1
}

module.exports = {getAllPosts, getPostById, loadData, addPost, deletePost, updatePost}