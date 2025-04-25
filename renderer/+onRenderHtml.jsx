export { onRenderHtml };

import ReactDOMServer from "react-dom/server";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import logoUrl from "/favicon.svg"; // or update path to your actual logo
import { Layout } from "/src/components/Layout/Layout"; // if you have one
import { PageContextProvider } from "./usePageContext";

const onRenderHtml = (pageContext) => {
  const { Page, pageProps } = pageContext;
  if (!Page) throw new Error("onRenderHtml expects pageContext.Page to be defined");

  console.log('[client] Hydrating now...');


  const pageHtml = ReactDOMServer.renderToString(
    <PageContextProvider pageContext={pageContext}>
      <Layout pageContext={pageContext}>
        <Page {...pageProps} />
      </Layout>
    </PageContextProvider>
  );

  const title = pageContext.exports?.title || "PyFiddle - Python Playground";
  const desc =
    pageContext.exports?.description ||
    "Run Python in the browser. Share and test Python code online with PyFiddle – no setup needed.";

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return { documentHtml, pageContext: {} };
};
