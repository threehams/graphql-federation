const Home = async () => {
  const response = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: /* GraphQL */ `
        query getUser {
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
                  msrp
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {JSON.stringify(json)}
      </main>
    </div>
  );
};

export default Home;
