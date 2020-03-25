const { getBlog, getBlogs, getComments } = require('../db/data-helpers');

const request = require('supertest');
const app = require('../lib/app');
const Blog = require('../lib/models/Blog');
const Comment = require('../lib/models/Comment');

describe('blog routes', () => {
  it('creates a blog', () => {
    return request(app)
      .post('/api/v1/blogs')
      .send({
        author: 'Author Test',
        title: 'Test Title',
        content: 'Test Content'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          author: 'Author Test',
          title: 'Test Title',
          content: 'Test Content',
          __v: 0
        });
      });
  });

  it('gets a blog by id', async() => {
    const blog = await getBlog();
    // need comments as well since we are populating in route
    const comments = await getComments({ blogId: blog._id });

    return request(app)
      .get(`/api/v1/blogs/${blog._id}`)
      .then(res => {
        expect(res.body).toEqual({
          ...blog,
          comments // because we populate in route
        });
      });
  });

  it('gets all blogs', async() => {
    const blogs = await getBlogs();

    return request(app)
      .get('/api/v1/blogs')
      .then(res => {
        expect(res.body).toEqual(blogs);
      });
  });

  it('updates a blog by id', async() => {
    const blog = await getBlog();
    return request(app)
      .patch(`/api/v1/blogs/${blog._id}`)
      .send(
        { title: 'Test Title' },
        { content: 'Test Content' })
      .then(res => {
        expect(res.body).toEqual({
          ...blog,
          title: expect.any(String),
          content: expect.any(String)
        });
      });
  });

  it('deletes a blog by id', async() => {
    const blog = await getBlog();
    
    return request(app)
      .delete(`/api/v1/blogs/${blog._id}`)
      .then(res => {
        expect(res.body).toEqual(blog);
      });
  });
});
