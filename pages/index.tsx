import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Downball World Cup — Downball Australia</title>
        <meta name="description" content="Official Downball World Cup and Downball Australia competitions." />
      </Head>

      <header className="p-6 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-4">
          <img src="/logo.svg" alt="Downball Australia" className="h-12 w-12" />
          <h1 className="text-2xl font-bold">Downball Australia</h1>
        </div>
        <nav className="space-x-4">
          <Link href="/news"><a className="hover:text-yellow-400">News</a></Link>
          <Link href="/fixtures"><a className="hover:text-yellow-400">Fixtures</a></Link>
          <Link href="/teams"><a className="hover:text-yellow-400">Teams</a></Link>
          <Link href="/players"><a className="hover:text-yellow-400">Players</a></Link>
          <Link href="/admin"><a className="ml-4 px-3 py-1 border border-yellow-600 rounded">Admin</a></Link>
        </nav>
      </header>

      <main className="p-6">
        <section className="bg-gradient-to-b from-black via-gray-900 to-gray-800 rounded-lg p-8 mb-6">
          <h2 className="text-4xl font-extrabold mb-3">Downball World Cup</h2>
          <p className="text-gray-300">A professional tournament management platform for Downball competitions across Australia and the world.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-900 rounded">Upcoming fixtures (sample)</div>
          <div className="p-6 bg-gray-900 rounded">Latest results (sample)</div>
          <div className="p-6 bg-gray-900 rounded">Standings (sample)</div>
        </section>
      </main>

      <footer className="p-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Downball Australia — Built with Next.js, TypeScript and Supabase
      </footer>
    </div>
  )
}
