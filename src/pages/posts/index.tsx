import styles from './styles.module.scss'
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { getPrismicClient } from '../../services/prismic';
import Prismic from "@prismicio/client";
import { RichText } from 'prismic-dom';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;

}

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Post | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>

          {posts.map(post => (
            <Link key={post.slug} href={`posts/preview/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>

          ))}


        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query<any>([
    Prismic.predicates.at('document.type', 'post')
  ],
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 100,

    })

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find((content: { type: string; }) => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date as string).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    }
  })



  //console.log(JSON.stringify(response, null, 2))


  return {
    props: { posts }
  }
}