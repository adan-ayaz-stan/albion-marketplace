import { AuthButton } from "@/components/auth-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Globe,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href={"/"}>Spitfire's Albion Project</Link>
          </div>
          <AuthButton />
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-6 pt-32 pb-20">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Badge */}
            <Badge
              variant="outline"
              className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 px-4 py-2"
            >
              <Zap className="w-4 h-4 mr-2" />
              Real-time Price Tracking
            </Badge>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
              Master the
              <span className="block bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Albion Market
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl leading-relaxed">
              Track item prices across all cities, analyze market trends, and
              make informed trading decisions with the most comprehensive Albion
              Online market intelligence platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Link href="/track-new">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0 shadow-2xl shadow-emerald-500/25 px-8 py-4 text-lg"
                >
                  Start Tracking Items
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-4 text-lg"
                >
                  Create Free Account
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-8 text-slate-400">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>TBD Active Traders</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-600"></div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>TBD Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Dominate
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Powerful tools and insights to give you the competitive edge in
              Albion Online's dynamic economy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white ml-4">
                  Real-time Price Data
                </h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Get up-to-the-minute pricing information across all major cities
                and trading posts in Albion Online.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white ml-4">
                  Advanced Analytics
                </h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Analyze price trends, identify profitable opportunities, and
                make data-driven trading decisions.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white ml-4">
                  Smart Alerts
                </h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Set up custom price alerts and never miss a profitable trading
                opportunity again.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white ml-4">
                  Multi-City Coverage
                </h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Track prices across Caerleon, Bridgewatch, Lymhurst, Martlock,
                Fort Sterling, and Thetford.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white ml-4">
                  Secure & Reliable
                </h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Your data is protected with enterprise-grade security and 99.9%
                uptime guarantee.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white ml-4">
                  Lightning Fast
                </h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Optimized for speed with instant search results and
                lightning-fast chart rendering.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Trading Smarter in
              <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                {" "}
                3 Steps
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Search Items
              </h3>
              <p className="text-slate-300">
                Find any item in Albion Online's vast database with our powerful
                search engine.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Track Prices
              </h3>
              <p className="text-slate-300">
                Add items to your watchlist and monitor real-time price changes
                across all cities.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Profit</h3>
              <p className="text-slate-300">
                Make informed decisions with detailed analytics and maximize
                your trading profits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-slate-600 backdrop-blur-sm p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Dominate the Market?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of successful traders who use our platform to
              maximize their profits in Albion Online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0 shadow-2xl shadow-emerald-500/25 px-8 py-4 text-lg"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/track-new">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-4 text-lg"
                >
                  Explore Items
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 mb-4 md:mb-0">
              © 2025 Albion Market Tracker. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/auth/login"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/sign-up"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/track-new"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Track Items
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
