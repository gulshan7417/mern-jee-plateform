import { CalendarIcon, ChartBarIcon, BookmarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import Link from 'next/link';
import PlatformPreview from '@/components/PlatformPreview';
import Sidebar from '@/components/sidebar';
import FeatureCard from '@/components/FeatureCard'; // ✅ Import FeatureCard
import StatItem from '@/components/StatItem'; // ✅ Import StatItem

export default function Home() {
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-blue-50 to-white">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Head>
          <title>IIT/JEE Test Platform - NSS IIT Roorkee</title>
          <meta name="description" content="AI-powered test platform with detailed analytics for JEE/NEET aspirants" />
        </Head>

        {/* Hero Section */}
        <header className="text-center py-16 bg-blue-900 text-white">
          <h1 className="text-4xl font-bold">Revolutionize Your IIT/JEE Preparation</h1>
          
          <div className="mt-6 space-x-4">
            <Link href="/signup" className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold">Get Started</Link>
          
          </div>
        </header>

        {/* Features Section */}
        <section className="py-12 max-w-6xl mx-auto text-center">
          <h2 className="text-2xl text-blue-700 font-bold mb-6">Platform Highlights</h2>
          <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard icon={<ChartBarIcon className="h-8 w-8 text-blue-500" />} title="Smart Analytics" description="Track performance and improve weak areas." />
          <FeatureCard icon={<ClockIcon className="h-8 w-8 text-blue-500" />} title="Real Exam Simulation" description="Timed tests with real interface." />
            <FeatureCard icon={<BookmarkIcon className="h-8 w-8 text-blue-500" />} title="PYQ Bank" description="10,000+ previous year questions." />
          </div>
        </section>

        {/* Platform Preview */}
        <section className="py-12 bg-white text-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Experience the Future of Test Prep</h2>
          <PlatformPreview />
        </section>

        {/* Statistics */}
        <section className="py-12 bg-blue-50">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 text-center">
            <StatItem number="10K+" label="Practice Questions" />
            <StatItem number="98%" label="Success Rate" />
            <StatItem number="50+" label="Mock Tests" />
            <StatItem number="24/7" label="Support" />
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 bg-blue-900 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Join 50,000+ Aspirants Today</h2>
          <Link href="/signup" className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold">Start  For Free </Link>
        </section>
      </div>
    </div>
  );
}
