import Head from "next/head";
const Layout = ({ title, children }) => {
  return (
    <div className="bg-slate-900 text-slate-50 p-4">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto max-w-xl pt-8 min-h-screen">
        {children}
      </main>
    </div>
  );
};
export default Layout;
