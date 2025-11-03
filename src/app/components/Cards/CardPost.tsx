import React from 'react'
import { fetchMediumArticle } from '../../utils/fetchMediumArticle';

const CardPost = ({ article }: { article: { title: string; paragraphs: string[] } }) => {

  if (!article) {
    return <div>Error loading article</div>;
  }

  return (
    <div>
      <h1>{article.title}</h1>
      {article.paragraphs.map((para, index) => (
        <p key={index}>{para}</p>
      ))}
    </div>
  );
};

export default CardPost

export async function getServerSideProps() {
  const article = await fetchMediumArticle('https://medium.com/@tengxuanp/title-placeholder-c68839717b87');

  return { props: { article } };
}