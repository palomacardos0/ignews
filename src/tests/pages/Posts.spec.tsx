import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock';
import Posts, { getStaticProps } from '../../pages/posts'
import { stripe } from '../../services/stripe'
import { getPrismicClient } from '../../services/prismic'

const posts = [
  {
    slug: 'my-new-post',
    title: 'My New Post',
    excerpt: 'Post Excerpt',
    updatedAt: '01 de abril'
  }
];

jest.mock('../../services/prismic')

describe('Home page', () => {
  it('renders correctly', () => {


    render(<Posts posts={posts} />)

    expect(screen.getByText("My New Post")).toBeInTheDocument()
  })

  it('loads initdal data', async () => {

    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValue({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                { type: 'heading', text: 'My New Post' }
              ],
              content: [
                { type: 'paragraph', text: 'Post Excerpt' }
              ],
            },
            last_publication_date: '01-04-2021'
          }
        ]
      })
    } as any)


    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-post',
            title: 'My New Post',
            excerpt: 'Post Excerpt',
            updatedAt: '04 de janeiro de 2021'
          }]
        }
      })
    )
  })
})