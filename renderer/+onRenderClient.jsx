export { onRenderClient };

import React from "react";
import ReactDOM from "react-dom/client";
import { PageContextProvider } from "./usePageContext";
import { Layout } from "../src/components/Layout/Layout";
import { SnippetProvider } from "../src/context/SnippetContext";

let root;

const onRenderClient = (pageContext) => {
  const { Page } = pageContext;
  if (!Page) throw new Error("onRenderClient expects pageContext.Page to be defined");

  const container = document.getElementById("react-root");
  if (!container) throw new Error("DOM element #react-root not found");

  const page = (
    <PageContextProvider pageContext={pageContext}>
      <SnippetProvider>
        <Layout pageContext={pageContext}>
          <Page />
        </Layout>
      </SnippetProvider>
    </PageContextProvider>
  );

  if (pageContext.isHydration) {
    root = ReactDOM.hydrateRoot(container, page);
  } else {
    if (!root) {
      root = ReactDOM.createRoot(container);
    }
    root.render(page);
  }

  document.title = pageContext.data?.title || pageContext.config?.title || "PyFiddle";
};
