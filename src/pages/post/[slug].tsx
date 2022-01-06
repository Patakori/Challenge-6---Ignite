
import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from "react-icons/fi";
import Header from '../../components/Header/index';


import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client'

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RichText } from 'prismic-dom';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Link from 'next/link';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
  preview: boolean;
}

 export default function Post({post, preview}: PostProps): JSX.Element { 

  const router = useRouter();
  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  const totalWords = post.data.content.reduce((total, contentItem) => {
    total += contentItem.heading.split(' ').length;

    const words = contentItem.body.map(item => item.text.split(' ').length);
    words.map(word => (total += word));
    return total;
  }, 0);
  const readTime = Math.ceil(totalWords / 200);

  const formatedDate = format(
    new Date(post.first_publication_date),
    'dd MMM yyyy',
    {
      locale: ptBR,
    }
  );

    return(
      <div className={commonStyles.container}>
        <Head>
          <title> {`${post.data.title} | spacetraviling`} </title>
        </Head>
        <Header />
              <img className={styles.img} src={post.data.banner.url} alt="imagem" />
              <main className={styles.post}>
                <div>
                  <h1>{post.data.title}</h1>
                  <div className={styles.infos}>
                    <time> <FiCalendar size={20} /> {formatedDate} </time>
                    <p> <FiUser size={20} /> {post.data.author} </p>
                    <time> <FiClock size={20}/> {`${readTime} min`} </time>
                  </div>
                </div> 
                {post.data.content.map(content => {
                 return (
                <article key={content.heading}>
                  <h2>{content.heading}</h2>
                  <div
                    className={styles.postContent}
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(content.body),
                    }}
                  />
                </article>
                  );
                })}
                {preview && (
                  <aside>
                    <Link href="/api/exit-preview">
                      <a>Sair do modo Preview</a>
                    </Link>
                  </aside>
		            )}
              </main>
      </div>
    )
 }

 export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

 export const getStaticProps : GetStaticProps<PostProps> = async ({
   params,
   preview = false,
   previewData,
  
  }) => {
   
   const prismic = getPrismicClient();
   const { slug } = params;
   const response = await prismic.getByUID('posts', String(slug),{
    ref: previewData?.ref ?? null,
   });
   
   const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body],
        };
      }),
    },
  };
  
  return{
    props: {
      post,
      preview
    }
  }
  };