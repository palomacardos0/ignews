import { GetStaticPaths, GetStaticProps } from "next";
import { RichText } from "prismic-dom";
import { ParsedUrlQuery } from "querystring";
import { getPrismicClient } from "../../../services/prismic";
import Head from "next/head"
import style from "../post.module.scss"
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface Params extends ParsedUrlQuery {
  slug: string;
}

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    content: string
    updatedAt: string;
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session])
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={style.container}>
        <article className={style.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div className={`${style.postContent} ${style.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className={style.continueReading}>
            Quer continuar lendo?
            <Link href={`/`}>
              <a>Se inscreva agora 🤗</a>
            </Link>
          </div>

        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug } = params as Params

  if (slug === 'favicon.png') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const prismic = getPrismicClient()

  const response = await prismic.getByUID<any>('post', String(slug), {})

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date as string).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30 //30 min
  }
}