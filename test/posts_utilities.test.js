const expect = require("expect")
const testDataFile = "./data/blog_posts.test.json"
const fs = require("fs")
const {loadData, getAllPosts, getPostById, addPost, deletePost, updatePost} = require("../utils/posts_utilities")


beforeEach(() => {
	console.log("setting up data")
	setupData()
})

describe("Setup data", () => {
	it("should populate the test file with data", () => {
		let contents = fs.readFileSync(testDataFile,'utf8')
		expect(contents.length).toBeGreaterThan(3)
		let posts = JSON.parse(contents)
		expect(posts["1"].username).toBe("auto-tester")
	})
})

describe("getAllPosts", () => {
	it("should return all posts from test data", () => {
		let blogPosts = getAllPosts({})
		expect(Object.keys(blogPosts).length).toBe(1)
		expect(blogPosts["1"].username).toBe("auto-tester")
	})
})

describe("getPostById", () => {
	let req = {
		params: {
			id: "1"
		}
	}
	it("should return the correct post given id", () => {
		let blogPost = getPostById(req)
		expect(blogPost.username).toBe("auto-tester")
	})
	it("should set req.error when invalid id is given", () => {
		req.params.id = "2"
		getPostById(req)
		expect(req.error).toBe("Post not found")		
	})
})

describe("addPost", () => {
	let req = {
		body: {
			title: "A new blog post",
			username: "auto-tester2",
			content: "This is a new blog post to test create",
			category: "testing"
		}
	}
	it("should add a post with valid data and update file", () => {
		addPost(req)
		// the file has 2 posts now
		let contents = fs.readFileSync(testDataFile,'utf8')
		let posts = JSON.parse(contents)
		expect(Object.keys(posts).length).toBe(2)
	})
	it("should return the created post", () => {
		let newPost = addPost(req)
		expect(newPost.username).toBe(req.body.username)
	})
})

describe("deletePost", () => {
	let req = {
		params: {
			id: "1"
		}
	}
	it("should remove the post from the data returned", () => {
		let blogPosts = deletePost(req)
		// should have an empty object
		expect(Object.keys(blogPosts).length).toBe(0)
	})
	it("should update the file to remove the post", () => {
		deletePost(req)
		let contents = fs.readFileSync(testDataFile,'utf8')
		let posts = JSON.parse(contents)
		expect(Object.keys(posts).length).toBe(0)
	})
})

describe("updatePost", () => {
	let req = {
		params: {
			id: "1"
		},
		body: {
			title: "Updated post",
			username: "auto-tester",
			content: "I have updated the post"
		}
	}
	it("should update the post and return it", () => {
		let post = updatePost(req)
		expect(post.title).toBe("Updated post")
	})
})

function setupData() {
	let testPostData = {}
	let testPost = {}
	let date = Date.now()
	testPost.title = "Test post 1"
	testPost.username = "auto-tester"
	testPost.create_date = date
	testPost.modified_date = date
	testPost.content = "This is the first test post"
	testPost.category = ""
	testPostData["1"] = testPost
	fs.writeFileSync(testDataFile, JSON.stringify(testPostData))
	loadData(testDataFile)
}