const Home = async () => {
  const response = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: /* GraphQL */ `
        query getUser {
          book(id: "book1") {
            id
            name
            price
          }
          bookSearch(filters: { name: "sequel" }) {
            totalCount
            edges {
              cursor
              hasIncentive
              node {
                id
                name
                price
              }
            }
          }
          bookRecommendations {
            id
            name
          }
          user(id: "user1") {
            id
            name
            books {
              edges {
                cursor
                hasIncentive
                node {
                  id
                  name
                  price
                }
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              totalCount
            }
            bookRecommendations {
              id
              name
              price
            }
          }
        }
      `,
    }),
  });
  if (!response.ok) {
    throw new Error(
      `failed. Status code:${response.status}, text: ${await response.text()}`
    );
  }
  const json = await response.json();

  return (
    <div className="">
      <pre>{JSON.stringify(json.data, null, 2)}</pre>
    </div>
  );
};

export default Home;
