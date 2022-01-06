import Document, { Html, Head, Main, NextScript } from 'next/document';

import { repoName } from '../../prismicConfiguration' // import from wherever this is set

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render (){
    return (
        <Html>
            <Head>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"/>

                <link rel="shortcut icon" href="/favicon.png" type="image/png" />

                <script async defer src={`//static.cdn.prismic.io/prismic.js?repo=${repoName}&new=true`} />

            </Head>
            <body>
                <Main/>
                <NextScript/>
                <script async defer src="https://static.cdn.prismic.io/prismic.js?new=true&repo=challenge-5---ignite"></script>
            </body>
        </Html>
    )
}
}

export default MyDocument
