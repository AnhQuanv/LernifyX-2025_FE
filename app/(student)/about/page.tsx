"use client";

import {
  Award,
  TrendingUp,
  Shield,
  Globe,
  Users,
  BookOpen,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const AboutPage = () => {
  const stats = [
    { number: "50K+", label: "Active Students", icon: Users },
    { number: "10K+", label: "Total Courses", icon: BookOpen },
    { number: "500+", label: "Expert Instructors", icon: Award },
    { number: "95%", label: "Success Rate", icon: CheckCircle },
  ];

  const values = [
    {
      icon: Award,
      title: "Excellence",
      description:
        "We are committed to providing the highest quality education and learning experiences.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description:
        "We continuously evolve our platform with cutting-edge technology and teaching methods.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Shield,
      title: "Integrity",
      description:
        "We maintain the highest standards of honesty and transparency in all our operations.",
      color: "from-purple-500 to-violet-600",
    },
    {
      icon: Globe,
      title: "Accessibility",
      description:
        "We believe education should be accessible to everyone, regardless of background.",
      color: "from-orange-500 to-red-600",
    },
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Visionary leader with 15+ years in edtech",
    },
    {
      name: "Sarah Chen",
      role: "Chief Technology Officer",
      bio: "Tech innovator passionate about learning platforms",
    },
    {
      name: "Michael Brown",
      role: "Head of Content",
      bio: "Educational expert with extensive curriculum experience",
    },
    {
      name: "Emily Davis",
      role: "Community Manager",
      bio: "Dedicated to building a thriving learning community",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-violet-700 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About LeanrifyX
            </h1>
            <p className="text-xl text-violet-100 max-w-2xl">
              Empowering learners worldwide with accessible, high-quality
              education and expert instruction.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  At LeanrifyX, we believe that education is the key to
                  unlocking human potential. Our mission is to make world-class
                  education accessible to everyone, everywhere.
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  We connect passionate instructors with eager learners,
                  creating a global community dedicated to continuous growth and
                  skill development.
                </p>
                <button className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center space-x-2">
                  <span>Learn More</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 rounded-2xl h-96 flex items-center justify-center text-white text-6xl font-bold">
                LeanrifyX
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                By The Numbers
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our impact on global education
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-violet-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Our Core Values
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group text-center hover:transform hover:-translate-y-2 transition-all duration-500"
                >
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg`}
                  >
                    <value.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-violet-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Passionate professionals dedicated to transforming education
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100"
                >
                  <div className="h-40 bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-violet-600 font-semibold mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-violet-700 to-purple-600 text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Learning Community
            </h2>
            <p className="text-xl text-violet-100 max-w-2xl mx-auto mb-12">
              Start your journey to success with LeanrifyX today
            </p>
            <button className="bg-white text-violet-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-violet-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Get Started Now
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
