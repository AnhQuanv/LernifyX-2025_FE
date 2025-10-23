"use client";

import { useState } from "react";
import { Star, Mail, Linkedin, Twitter, Search } from "lucide-react";

const TeachersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const allTeachers = [
    {
      id: 1,
      name: "John Smith",
      specialty: "Programming",
      bio: "Expert React developer with 10+ years of experience",
      rating: 4.8,
      students: 12500,
      courses: 5,
      image: "/placeholder.svg",
      email: "john@example.com",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      id: 2,
      name: "Sarah Johnson",
      specialty: "Marketing",
      bio: "Digital marketing strategist and content creator",
      rating: 4.9,
      students: 8900,
      courses: 3,
      image: "/placeholder.svg",
      email: "sarah@example.com",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      id: 3,
      name: "Mike Chen",
      specialty: "Design",
      bio: "UI/UX designer with award-winning portfolio",
      rating: 4.7,
      students: 15200,
      courses: 4,
      image: "/placeholder.svg",
      email: "mike@example.com",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      id: 4,
      name: "Lisa Wang",
      specialty: "Data Science",
      bio: "Data scientist and machine learning specialist",
      rating: 4.9,
      students: 20100,
      courses: 6,
      image: "/placeholder.svg",
      email: "lisa@example.com",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      id: 5,
      name: "David Brown",
      specialty: "Data Science",
      bio: "ML engineer with expertise in deep learning",
      rating: 4.8,
      students: 18400,
      courses: 5,
      image: "/placeholder.svg",
      email: "david@example.com",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      id: 6,
      name: "Emma Wilson",
      specialty: "Programming",
      bio: "Full-stack developer and web development mentor",
      rating: 4.6,
      students: 9200,
      courses: 4,
      image: "/placeholder.svg",
      email: "emma@example.com",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      id: 7,
      name: "Alex Turner",
      specialty: "Design",
      bio: "Creative director and graphic design expert",
      rating: 4.9,
      students: 13800,
      courses: 5,
      image: "/placeholder.svg",
      email: "alex@example.com",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      id: 8,
      name: "Maria Garcia",
      specialty: "Programming",
      bio: "JavaScript specialist and coding instructor",
      rating: 4.8,
      students: 16700,
      courses: 6,
      image: "/placeholder.svg",
      email: "maria@example.com",
      social: { linkedin: "#", twitter: "#" },
    },
  ];

  const specialties = [
    "All",
    "Programming",
    "Design",
    "Marketing",
    "Data Science",
  ];

  const filteredTeachers = allTeachers.filter((teacher) => {
    const matchesSpecialty =
      selectedSpecialty === "All" || teacher.specialty === selectedSpecialty;
    const matchesSearch = teacher.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-violet-700 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Our Expert Instructors
            </h1>
            <p className="text-xl text-violet-100 max-w-2xl">
              Learn from industry professionals with years of real-world
              experience and proven track records.
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="bg-white border-b border-gray-200 sticky top-20 z-40">
          <div className="container mx-auto px-4 md:px-6 py-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search instructors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Specialty Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Specialty
              </label>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => setSelectedSpecialty(specialty)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      selectedSpecialty === specialty
                        ? "bg-violet-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Teachers Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8">
              <p className="text-gray-600 text-lg">
                Showing {filteredTeachers.length} instructors
              </p>
            </div>

            {filteredTeachers.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer border border-gray-100 hover:border-violet-200 transform hover:-translate-y-2"
                  >
                    {/* Image Section */}
                    <div className="relative h-48 bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-violet-600 z-10">
                        {teacher.name.charAt(0)}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-violet-600 transition-colors duration-300">
                          {teacher.name}
                        </h3>
                        <p className="text-violet-600 font-medium text-sm">
                          {teacher.specialty}
                        </p>
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2">
                        {teacher.bio}
                      </p>

                      {/* Stats */}
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Rating</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-semibold text-gray-700">
                              {teacher.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Students</span>
                          <span className="font-semibold text-gray-700">
                            {teacher.students.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Courses</span>
                          <span className="font-semibold text-gray-700">
                            {teacher.courses}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4">
                        <button className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl">
                          View Profile
                        </button>
                        <button className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg hover:bg-violet-100 hover:text-violet-600 transition-all duration-300 flex items-center justify-center">
                          <Mail className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Social Links */}
                      <div className="flex gap-2 justify-center pt-2">
                        <a
                          href={teacher.social.linkedin}
                          className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full hover:bg-violet-100 hover:text-violet-600 transition-all duration-300 flex items-center justify-center"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                        <a
                          href={teacher.social.twitter}
                          className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full hover:bg-violet-100 hover:text-violet-600 transition-all duration-300 flex items-center justify-center"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600">
                  No instructors found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default TeachersPage;
