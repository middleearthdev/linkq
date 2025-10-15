/**
 * LinkQ Homepage
 * Showcases the platform and available templates
 */

"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// Templates are now loaded dynamically from API
import { Sparkles, Zap, Shield, Palette, BarChart3, Globe } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Perfect
              </span>{' '}
              Bio Link
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create beautiful, customizable bio link pages that convert. 
              Choose from professional templates, track analytics, and grow your audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button 
                  size="lg" 
                  className="text-white font-medium shadow-lg"
                  style={{ backgroundColor: '#66A38A', borderColor: '#66A38A' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#5A8F7A'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#66A38A'
                  }}
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="#templates">
                <Button size="lg" variant="outline">
                  View Templates
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Beautiful Templates</h3>
              <p className="text-gray-600">Choose from professionally designed templates that match your style and brand.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Powerful Analytics</h3>
              <p className="text-gray-600">Track clicks, views, and engagement to understand your audience better.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Custom Domains</h3>
              <p className="text-gray-600">Use your own domain name for a professional, branded experience.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="templates" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Template</h2>
            <p className="text-xl text-gray-600">
              Start with a beautiful template and customize it to match your brand
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                <div className="absolute top-6 left-6 right-6">
                  <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 shadow-sm" />
                  <div className="text-center space-y-2">
                    <div className="h-3 bg-gray-900 rounded mx-auto w-24" />
                    <div className="h-2 bg-gray-500 rounded mx-auto w-32" />
                  </div>
                  <div className="space-y-3 mt-8">
                    <div className="h-12 bg-white rounded-xl shadow-sm" />
                    <div className="h-12 bg-white rounded-xl shadow-sm" />
                    <div className="h-12 bg-white rounded-xl shadow-sm" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">Minimal</h3>
                  <Badge variant="secondary">Free</Badge>
                </div>
                <p className="text-gray-600 mb-4">Clean and simple design perfect for professionals</p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-900 to-gray-700 relative overflow-hidden">
                <div className="absolute top-6 left-6 right-6">
                  <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 border-2 border-white" />
                  <div className="text-center space-y-2">
                    <div className="h-3 bg-white rounded mx-auto w-24" />
                    <div className="h-2 bg-gray-300 rounded mx-auto w-32" />
                  </div>
                  <div className="space-y-3 mt-8">
                    <div className="h-12 bg-amber-100 text-amber-900 rounded-2xl shadow-sm" />
                    <div className="h-12 bg-amber-100 text-amber-900 rounded-2xl shadow-sm" />
                    <div className="h-12 bg-amber-100 text-amber-900 rounded-2xl shadow-sm" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">Modern</h3>
                  <Badge variant="secondary">Free</Badge>
                </div>
                <p className="text-gray-600 mb-4">Sleek dark design with elegant typography</p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-[3/4] bg-gradient-to-br from-purple-500 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-6 left-6 right-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4" />
                  <div className="text-center space-y-2">
                    <div className="h-3 bg-white rounded mx-auto w-24" />
                    <div className="h-2 bg-white/80 rounded mx-auto w-32" />
                  </div>
                  <div className="space-y-3 mt-8">
                    <div className="h-12 bg-white/20 backdrop-blur-sm rounded-2xl" />
                    <div className="h-12 bg-white/20 backdrop-blur-sm rounded-2xl" />
                    <div className="h-12 bg-white/20 backdrop-blur-sm rounded-2xl" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">Aurora</h3>
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">Premium</Badge>
                </div>
                <p className="text-gray-600 mb-4">Beautiful glassmorphism design with gradients</p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that works best for you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="p-8 relative">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-bold mb-4">$0</div>
                <p className="text-gray-600 mb-6">Perfect for getting started</p>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                    1 bio link page
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                    Up to 5 links
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                    Basic templates
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                    LinkQ branding
                  </li>
                </ul>
                
                <Link href="/auth/signup">
                  <Button className="w-full" variant="outline">Get Started</Button>
                </Link>
              </div>
            </Card>

            {/* Starter Plan */}
            <Card className="p-8 relative border-2 border-blue-500">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500">Most Popular</Badge>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="text-4xl font-bold mb-4">
                  $9<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">For creators and professionals</p>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <Sparkles className="w-5 h-5 text-blue-500 mr-3" />
                    3 bio link pages
                  </li>
                  <li className="flex items-center">
                    <Sparkles className="w-5 h-5 text-blue-500 mr-3" />
                    Up to 20 links each
                  </li>
                  <li className="flex items-center">
                    <Sparkles className="w-5 h-5 text-blue-500 mr-3" />
                    Premium templates
                  </li>
                  <li className="flex items-center">
                    <Sparkles className="w-5 h-5 text-blue-500 mr-3" />
                    Basic analytics
                  </li>
                  <li className="flex items-center">
                    <Sparkles className="w-5 h-5 text-blue-500 mr-3" />
                    Remove branding
                  </li>
                </ul>
                
                <Link href="/auth/signup?plan=starter">
                  <Button className="w-full">Start Free Trial</Button>
                </Link>
              </div>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 relative">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-4">
                  $29<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">For businesses and teams</p>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <Zap className="w-5 h-5 text-purple-500 mr-3" />
                    10 bio link pages
                  </li>
                  <li className="flex items-center">
                    <Zap className="w-5 h-5 text-purple-500 mr-3" />
                    Unlimited links
                  </li>
                  <li className="flex items-center">
                    <Zap className="w-5 h-5 text-purple-500 mr-3" />
                    All templates
                  </li>
                  <li className="flex items-center">
                    <Zap className="w-5 h-5 text-purple-500 mr-3" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <Zap className="w-5 h-5 text-purple-500 mr-3" />
                    Custom domains
                  </li>
                  <li className="flex items-center">
                    <Zap className="w-5 h-5 text-purple-500 mr-3" />
                    Custom CSS
                  </li>
                </ul>
                
                <Link href="/auth/signup?plan=pro">
                  <Button className="w-full" variant="outline">Start Free Trial</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Build Your Bio Link?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of creators who trust LinkQ to showcase their work and grow their audience.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">LinkQ</h3>
              <p className="text-gray-400">
                The easiest way to create beautiful bio link pages that convert.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/templates" className="hover:text-white">Templates</Link></li>
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/examples" className="hover:text-white">Examples</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/status" className="hover:text-white">Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 LinkQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
