export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  meta: {
    title: {
      env: { client: true }
    },
    description: {
      env: { client: true }
    }
  }
};
