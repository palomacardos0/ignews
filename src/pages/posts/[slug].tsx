import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { RichText } from "prismic-dom";
import { ParsedUrlQuery } from "querystring";
import { getPrismicClient } from "../../services/prismic";
import Head from "next/head"
import style from "./post.module.scss"

interface Params extends ParsedUrlQuery {
  slug: string;
}

interface PostProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    content: string
    updatedAt: string;
  }
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={style.container}>
        <article className={style.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div className={style.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }} />


        </article>
      </main>
    </>
  );
}


export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });

  const { slug } = params as Params

  console.log(session)
  if (slug === 'favicon.png') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const prismic = getPrismicClient(req)

  const response = await prismic.getByUID<any>('post', String(slug), {})
  console.log(JSON.stringify(response, null, 2))

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date as string).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  };

  return {
    props: {
      post,
    }
  }
}