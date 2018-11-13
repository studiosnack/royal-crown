# royal crown

a simple query for finding reviews you're responsible for:

```gql

query ($query: String!) {
  rateLimit {
    cost
    limit
  }
  search(query: $query, type: ISSUE, first: 20) {
    edges {
      node {
        ... on PullRequest {
          url
          title
          state
          reviews(first: 10) {
            edges {
              node {
                ... on PullRequestReview {
                  author {
                    login
                  }
                  state
                }
              }
            }
          }
        }
      }
    }
  }
}


```
