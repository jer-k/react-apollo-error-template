/*** APP ***/
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useQuery,
} from "@apollo/client";

import { link } from "./link.js";
import { Subscriptions } from "./subscriptions.jsx";
import { Layout } from "./layout.jsx";
import "./index.css";

const ALL_PEOPLE_NO_NAME = gql`
  query AllPeople {
    people {
      id
    }
  }
`;

const ALL_PEOPLE_WITH_NAME_DEFER = gql`
  query AllPeopleDefer {
    people {
      id
      ... defer {
        name {
          firstName
          lastName
        }
      }
    }
  }
`;

function App() {
  const { loading: noDeferLoading, data: noDeferData } = useQuery(ALL_PEOPLE_NO_NAME);
  const { loading: deferLoading, data: deferData } = useQuery(ALL_PEOPLE_WITH_NAME_DEFER);

  return (
    <main>
      <h3>Home</h3>
      <h2>Names</h2>
      <div>
        {noDeferLoading ? (
          <p>Loading…</p>
        ) : (
          <ul>
            {noDeferData?.people.map((person) => (
              <li key={person.id}>{person.name.firstName} {person.name.lastName}</li>
            ))}
          </ul>
        )}
      </div>
      <div>
        {deferLoading ? (
          <p>Loading…</p>
        ) : (
          <ul>
            {deferData?.people.map((person) => (
              <li key={person.id}>{person.name.firstName} {person.name.lastName}</li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ApolloProvider client={client}>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="subscriptions-wslink" element={<Subscriptions />} />
        </Route>
      </Routes>
    </Router>
  </ApolloProvider>
);
