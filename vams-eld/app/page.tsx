import { ArrowRight, GraduationCap, Users, BookOpen, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl glass border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                    VAMS ELD
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300">English Language Development</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  Empowering English Language Learners
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  A vibrant, user-friendly resource hub designed specifically for middle school ELD students and teachers.
                  Track progress, access scaffolds, and celebrate language acquisition milestones.
                </p>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <Users className="w-8 h-8 text-primary-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Student Tracking</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Monitor individual progress across ELD standards</p>
                </div>
                <div className="glass rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <BookOpen className="w-8 h-8 text-secondary-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Resource Library</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Access categorized teaching scaffolds and tools</p>
                </div>
                <div className="glass rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <Target className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Goal Management</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Set and track language learning objectives</p>
                </div>
                <div className="glass rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <GraduationCap className="w-8 h-8 text-purple-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Progress Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Visual feedback on language acquisition milestones</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/dashboard"
                  className="flex items-center justify-center space-x-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 interactive"
                >
                  <span className="font-semibold">Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="/scaffolds"
                  className="flex items-center justify-center space-x-3 glass border border-gray-200/50 dark:border-gray-700/50 px-8 py-4 rounded-xl hover:bg-primary-50 dark:hover:bg-gray-800 transition-all duration-300 interactive"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">Explore Resources</span>
                </a>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="glass rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {/* Mock Dashboard Preview */}
                  <div className="col-span-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">28</div>
                        <div className="text-sm text-gray-600">Active Students</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Collaborative</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">+15%</div>
                      <div className="text-xs text-gray-600">Growth This Month</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">3</div>
                      <div className="text-xs text-gray-600">New Goals</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary-500/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Designed for Success</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Every feature is crafted with middle school ELD learners in mind, ensuring accessibility, engagement, and measurable progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Vibrant & Engaging",
              description: "Modern glassmorphic design with Indigo/Rose palette that appeals to young learners while maintaining professional functionality for teachers.",
              color: "from-blue-500 to-cyan-500"
            },
            {
              title: "Mobile Responsive",
              description: "Optimized for tablets and phones, allowing students to access resources and track progress from any device.",
              color: "from-purple-500 to-pink-500"
            },
            {
              title: "Standards Aligned",
              description: "Tracks progress across Collaborative, Interpretive, and Productive ELD standards with clear visual feedback.",
              color: "from-green-500 to-emerald-500"
            },
            {
              title: "Teacher Empowerment",
              description: "Comprehensive dashboard for managing student progress, setting goals, and providing targeted feedback.",
              color: "from-orange-500 to-red-500"
            },
            {
              title: "Resource Organization",
              description: "Categorized scaffolds by level (Emerging, Expanding, Bridging) and type for easy access and implementation.",
              color: "from-yellow-500 to-orange-500"
            },
            {
              title: "Progress Visualization",
              description: "Interactive charts and progress bars that make language acquisition milestones visible and motivating.",
              color: "from-indigo-500 to-purple-500"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="glass rounded-xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 interactive"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                <div className="w-6 h-6 bg-white/30 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your ELD Classroom?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join educators who are making language learning more engaging and effective for their students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/dashboard"
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 interactive"
              >
                Start Your Journey
              </a>
              <a
                href="/students"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 interactive"
              >
                Meet Your Students
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
