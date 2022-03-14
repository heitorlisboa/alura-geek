import Head from "next/head";
import type { NextPage } from "next";

import Header from "../src/components/Header";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>AluraGeek - Página inicial</title>
      </Head>
      <Header />
    </>
  );
};

export default Home;
