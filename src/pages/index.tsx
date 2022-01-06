import { GetStaticProps } from 'next';
import Link from 'next/link';
import { FiCalendar, FiUser } from "react-icons/fi";

import {getPrismicClient} from '../services/prismic';
import Prismic from '@prismicio/client'

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: boolean;
}

 export default function Home({postsPagination, preview }: HomeProps): JSX.Element {
  const formattedPost = postsPagination.results.map(post => {
    return {
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    };
  });

  const [posts, setPosts] = useState<Post[]>(formattedPost);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [currentPage, setCurrentPage] = useState(1);

  async function handleNextPage(): Promise<void> {
    if (currentPage !== 1 && nextPage === null) {
      return;
    }

    const postsResults = await fetch(`${nextPage}`).then(response =>
      response.json()
    );
    setNextPage(postsResults.next_page);
    setCurrentPage(postsResults.page);

    const newPosts = postsResults.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd MMM yyyy',
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPosts([...posts, ...newPosts]);
  }


   return(
     <div className={commonStyles.container}>   
            <Header />
            {posts.map(post => (
              <Link key={post.uid} href={`/post/${post.uid}`}>
                <a className={styles.post}>
                  <h1> {post.data.title} </h1>
                  <p> {post.data.subtitle} </p>
                  <div>
                    <time> <FiCalendar size={20}/> {post.first_publication_date} </time>
                    <p> <FiUser size={20}/> {post.data.author} </p>
                  </div>          
                </a>
              </Link>
            ))}
             {nextPage && (
            <button className={styles.buttonHome} type="button" onClick={handleNextPage}>
              Carregar mais posts
            </button>
          )}
            {preview && (
              <aside>
                <Link href="/api/exit-preview">
                  <a className={commonStyles.preview}>Sair do modo Preview</a>
                </Link>
              </aside>
		        )}
     </div>
   )
 }

 export const getStaticProps: GetStaticProps<HomeProps> = async ({
  preview = false,
  previewData
  }) => {
    const prismic = getPrismicClient();
    const postsResponse = await prismic.query(
      [Prismic.predicates.at('document.type', 'posts')],
      {
        pageSize: 1,
        orderings: '[document.last_publication_date desc]',
        ref: previewData?.ref ?? null,
      }
    );

  const posts = postsResponse.results.map(post=> {
    return{
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

   return{
     props: {
       postsPagination,
       preview,
      }
   }
 };
