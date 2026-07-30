import Head from 'next/head'

export default function Admin() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Head>
        <title>Admin — Downball Australia</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-4">This is the admin dashboard. Authentication and full features will be implemented and connected to Supabase.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-900 rounded">Manage Competitions</div>
        <div className="p-4 bg-gray-900 rounded">Manage Teams</div>
        <div className="p-4 bg-gray-900 rounded">Manage Fixtures</div>
      </div>
    </div>
  )
}
