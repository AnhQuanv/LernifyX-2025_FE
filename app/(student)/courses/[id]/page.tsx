"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Star,
  Users,
  Clock,
  ArrowLeft,
  Heart,
  ShoppingCart,
  CheckCircle,
  PlayCircle,
  Award,
  BookOpen,
  TrendingDown,
} from "lucide-react";
import Image from "next/image";

const allCourses = [
  {
    id: 1,
    title: "Complete React Development Course",
    instructor: "John Smith",
    rating: 4.8,
    students: 12500,
    price: 89.99,
    originalPrice: 199.99,
    discount: 55,
    level: "Intermediate",
    duration: "40 hours",
    category: "Programming",
    discountExpiresAt: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    image: "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    description:
      "Master React from basics to advanced concepts. Learn hooks, state management, routing, and build real-world applications.",
    learnings: [
      "React fundamentals and JSX",
      "Hooks and functional components",
      "State management with Redux",
      "React Router for navigation",
      "Building real-world projects",
      "Performance optimization",
    ],
    requirements: [
      "Basic JavaScript knowledge",
      "HTML and CSS fundamentals",
      "A code editor (VS Code recommended)",
    ],
    sections: [
      { title: "Getting Started", lessons: 8 },
      { title: "React Fundamentals", lessons: 15 },
      { title: "Advanced Concepts", lessons: 12 },
      { title: "Projects & Practice", lessons: 10 },
    ],
    reviews: [
      {
        id: 1,
        author: "Sarah Chen",
        avatar: "/diverse-woman-avatar.png",
        rating: 5,
        date: "2 weeks ago",
        content:
          "Excellent course! The instructor explains complex concepts in a very clear and understandable way. Highly recommended!",
      },
      {
        id: 2,
        author: "Michael Johnson",
        avatar: "/man-avatar.png",
        rating: 4,
        date: "1 month ago",
        content:
          "Great content and well-structured. The projects at the end really helped solidify my understanding of React.",
      },
      {
        id: 3,
        author: "Emma Wilson",
        avatar: "/diverse-woman-avatar.png",
        rating: 5,
        date: "1 month ago",
        content:
          "Best React course I've taken. The instructor is very knowledgeable and responsive to questions.",
      },
    ],
  },
  {
    id: 2,
    title: "Digital Marketing Masterclass",
    instructor: "Sarah Johnson",
    rating: 4.9,
    students: 8900,
    price: 149.99,
    originalPrice: null,
    discount: null,
    level: "Beginner",
    duration: "25 hours",
    category: "Marketing",
    discountExpiresAt: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    image: "/digital-marketing-course.jpg",
    description:
      "Learn digital marketing strategies from industry experts. Cover SEO, social media, email marketing, and analytics.",
    learnings: [
      "Digital marketing fundamentals",
      "SEO optimization techniques",
      "Social media marketing",
      "Email marketing campaigns",
      "Analytics and reporting",
      "Marketing automation",
    ],
    requirements: [
      "Basic computer skills",
      "Internet connection",
      "Willingness to learn",
    ],
    sections: [
      { title: "Marketing Basics", lessons: 6 },
      { title: "SEO & Content", lessons: 8 },
      { title: "Social Media", lessons: 7 },
      { title: "Analytics", lessons: 4 },
    ],
    reviews: [
      {
        id: 1,
        author: "David Lee",
        avatar: "/man-avatar.png",
        rating: 5,
        date: "3 weeks ago",
        content:
          "Comprehensive and practical. I've already applied several strategies to my business.",
      },
      {
        id: 2,
        author: "Lisa Park",
        avatar: "/diverse-woman-avatar.png",
        rating: 4,
        date: "1 month ago",
        content:
          "Very informative course. The instructor knows the industry well.",
      },
    ],
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    instructor: "Mike Chen",
    rating: 4.7,
    students: 15200,
    price: 69.99,
    originalPrice: 129.99,
    discount: 46,
    level: "Beginner",
    duration: "30 hours",
    category: "Design",
    discountExpiresAt: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    image: "/ui-ux-design-course.jpg",
    description:
      "Learn UI/UX design principles and create beautiful, user-friendly interfaces. Includes Figma tutorials.",
    learnings: [
      "Design principles and theory",
      "User research and personas",
      "Wireframing and prototyping",
      "Figma essentials",
      "Design systems",
      "Usability testing",
    ],
    requirements: [
      "No prior design experience needed",
      "Figma account (free)",
      "Creative mindset",
    ],
    sections: [
      { title: "Design Fundamentals", lessons: 7 },
      { title: "Figma Basics", lessons: 9 },
      { title: "Advanced Design", lessons: 8 },
      { title: "Real Projects", lessons: 6 },
    ],
    reviews: [
      {
        id: 1,
        author: "Alex Turner",
        avatar: "/man-avatar.png",
        rating: 5,
        date: "2 weeks ago",
        content:
          "Perfect for beginners! The Figma tutorials are especially helpful.",
      },
    ],
  },
  {
    id: 4,
    title: "Python for Data Science",
    instructor: "Lisa Wang",
    rating: 4.9,
    students: 20100,
    price: 179.99,
    originalPrice: null,
    discount: null,
    level: "Advanced",
    duration: "50 hours",
    category: "Data Science",
    discountExpiresAt: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    image: "/python-data-science-course.jpg",
    description:
      "Master Python for data science. Learn pandas, NumPy, matplotlib, and machine learning basics.",
    learnings: [
      "Python fundamentals",
      "Data manipulation with pandas",
      "NumPy for numerical computing",
      "Data visualization",
      "Statistical analysis",
      "Introduction to ML",
    ],
    requirements: [
      "Basic programming knowledge",
      "Python installed",
      "Jupyter Notebook",
    ],
    sections: [
      { title: "Python Basics", lessons: 10 },
      { title: "Data Manipulation", lessons: 12 },
      { title: "Visualization", lessons: 8 },
      { title: "ML Basics", lessons: 10 },
    ],
    reviews: [
      {
        id: 1,
        author: "James Brown",
        avatar: "/man-avatar.png",
        rating: 5,
        date: "1 week ago",
        content:
          "Excellent course for data science beginners. Very comprehensive!",
      },
    ],
  },
  {
    id: 5,
    title: "Machine Learning Bootcamp",
    instructor: "David Brown",
    rating: 4.8,
    students: 18400,
    price: 109.99,
    originalPrice: 249.99,
    discount: 56,
    level: "Advanced",
    duration: "60 hours",
    category: "Data Science",
    discountExpiresAt: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    image: "/machine-learning-bootcamp.jpg",
    description:
      "Comprehensive machine learning bootcamp. Learn algorithms, model training, and deployment.",
    learnings: [
      "ML algorithms and theory",
      "Supervised learning",
      "Unsupervised learning",
      "Neural networks",
      "Model evaluation",
      "Deployment strategies",
    ],
    requirements: [
      "Python proficiency",
      "Statistics knowledge",
      "Linear algebra basics",
    ],
    sections: [
      { title: "ML Fundamentals", lessons: 12 },
      { title: "Supervised Learning", lessons: 14 },
      { title: "Deep Learning", lessons: 16 },
      { title: "Projects", lessons: 8 },
    ],
    reviews: [
      {
        id: 1,
        author: "Rachel Green",
        avatar: "/diverse-woman-avatar.png",
        rating: 5,
        date: "3 days ago",
        content:
          "Intensive and thorough. This bootcamp really prepared me for ML projects.",
      },
    ],
  },
  {
    id: 6,
    title: "WordPress Development",
    instructor: "Emma Wilson",
    rating: 4.6,
    students: 9200,
    price: 119.99,
    originalPrice: null,
    discount: null,
    level: "Beginner",
    duration: "20 hours",
    category: "Web Development",
    discountExpiresAt: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    image: "/wordpress-development-course.jpg",
    description:
      "Build professional websites with WordPress. Learn themes, plugins, and customization.",
    learnings: [
      "WordPress setup and basics",
      "Theme customization",
      "Plugin development",
      "SEO optimization",
      "E-commerce integration",
      "Security best practices",
    ],
    requirements: ["Basic web knowledge", "WordPress account", "Web hosting"],
    sections: [
      { title: "WordPress Basics", lessons: 5 },
      { title: "Themes & Plugins", lessons: 7 },
      { title: "Customization", lessons: 5 },
      { title: "Advanced Topics", lessons: 3 },
    ],
    reviews: [
      {
        id: 1,
        author: "Tom Wilson",
        avatar: "/man-avatar.png",
        rating: 4,
        date: "2 weeks ago",
        content:
          "Good course for WordPress beginners. Clear instructions and practical examples.",
      },
    ],
  },
  {
    id: 7,
    title: "Photoshop Mastery Course",
    instructor: "Alex Turner",
    rating: 4.9,
    students: 13800,
    price: 74.99,
    originalPrice: 159.99,
    discount: 53,
    level: "Intermediate",
    duration: "35 hours",
    category: "Design",
    discountExpiresAt: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    image: "/photoshop-mastery-course.jpg",
    description:
      "Master Adobe Photoshop. Learn photo editing, graphic design, and professional techniques.",
    learnings: [
      "Photoshop interface and tools",
      "Photo editing techniques",
      "Graphic design basics",
      "Layer management",
      "Advanced effects",
      "Professional workflows",
    ],
    requirements: [
      "Adobe Photoshop installed",
      "Basic design knowledge",
      "Creative vision",
    ],
    sections: [
      { title: "Getting Started", lessons: 6 },
      { title: "Photo Editing", lessons: 9 },
      { title: "Graphic Design", lessons: 10 },
      { title: "Advanced Techniques", lessons: 10 },
    ],
    reviews: [
      {
        id: 1,
        author: "Nina Patel",
        avatar: "/diverse-woman-avatar.png",
        rating: 5,
        date: "1 week ago",
        content:
          "Outstanding course! The instructor is a true Photoshop expert.",
      },
    ],
  },
  {
    id: 8,
    title: "JavaScript Advanced Concepts",
    instructor: "Maria Garcia",
    rating: 4.8,
    students: 16700,
    price: 179.99,
    originalPrice: null,
    discount: null,
    level: "Advanced",
    duration: "45 hours",
    category: "Programming",
    discountExpiresAt: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    image: "/javascript-advanced-concepts.jpg",
    description:
      "Deep dive into advanced JavaScript. Learn closures, async programming, and design patterns.",
    learnings: [
      "Closures and scope",
      "Async/await and promises",
      "Design patterns",
      "Functional programming",
      "Event handling",
      "Performance optimization",
    ],
    requirements: ["JavaScript fundamentals", "ES6+ knowledge", "Code editor"],
    sections: [
      { title: "Advanced Concepts", lessons: 11 },
      { title: "Async Programming", lessons: 10 },
      { title: "Design Patterns", lessons: 12 },
      { title: "Projects", lessons: 12 },
    ],
    reviews: [
      {
        id: 1,
        author: "Carlos Rodriguez",
        avatar: "/man-avatar.png",
        rating: 5,
        date: "2 weeks ago",
        content:
          "Deep and comprehensive. Really helped me understand advanced JS concepts.",
      },
    ],
  },
  {
    id: 9,
    title: "SEO Optimization Masterclass",
    instructor: "Tom Wilson",
    rating: 4.7,
    students: 7600,
    price: 64.99,
    originalPrice: 129.99,
    discount: 50,
    level: "Intermediate",
    duration: "28 hours",
    category: "Marketing",
    discountExpiresAt: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    image: "/seo-optimization-masterclass.jpg",
    description:
      "Master SEO strategies to rank higher on Google. Learn keyword research, link building, and technical SEO.",
    learnings: [
      "SEO fundamentals",
      "Keyword research",
      "On-page optimization",
      "Technical SEO",
      "Link building",
      "Analytics and tracking",
    ],
    requirements: ["Basic marketing knowledge", "Website access", "SEO tools"],
    sections: [
      { title: "SEO Basics", lessons: 7 },
      { title: "Keyword Research", lessons: 6 },
      { title: "Technical SEO", lessons: 8 },
      { title: "Link Building", lessons: 7 },
    ],
    reviews: [
      {
        id: 1,
        author: "Sophie Martin",
        avatar: "/diverse-woman-avatar.png",
        rating: 5,
        date: "3 weeks ago",
        content:
          "Practical SEO strategies that actually work. Highly recommended!",
      },
    ],
  },
  {
    id: 10,
    title: "Web Design with Figma",
    instructor: "Lisa Park",
    rating: 4.8,
    students: 11200,
    price: 149.99,
    originalPrice: null,
    discount: null,
    level: "Beginner",
    duration: "32 hours",
    category: "Design",
    discountExpiresAt: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    image: "/web-design-with-figma.jpg",
    description:
      "Learn modern web design with Figma. Create responsive designs and prototypes.",
    learnings: [
      "Figma interface",
      "Design systems",
      "Responsive design",
      "Prototyping",
      "Collaboration features",
      "Design to code",
    ],
    requirements: ["Figma account", "Design basics", "Creative tools"],
    sections: [
      { title: "Figma Basics", lessons: 8 },
      { title: "Web Design", lessons: 10 },
      { title: "Prototyping", lessons: 8 },
      { title: "Advanced Features", lessons: 6 },
    ],
    reviews: [
      {
        id: 1,
        author: "Marcus Johnson",
        avatar: "/man-avatar.png",
        rating: 5,
        date: "1 week ago",
        content:
          "Great introduction to Figma. Perfect for aspiring web designers.",
      },
    ],
  },
  {
    id: 11,
    title: "Node.js Backend Development",
    instructor: "James Lee",
    rating: 4.9,
    students: 14500,
    price: 99.99,
    originalPrice: 199.99,
    discount: 50,
    level: "Intermediate",
    duration: "48 hours",
    category: "Programming",
    discountExpiresAt: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    image: "/node-js-backend-development.jpg",
    description:
      "Build scalable backend applications with Node.js. Learn Express, databases, and APIs.",
    learnings: [
      "Node.js fundamentals",
      "Express framework",
      "Database design",
      "RESTful APIs",
      "Authentication",
      "Deployment",
    ],
    requirements: [
      "JavaScript knowledge",
      "Node.js installed",
      "Database basics",
    ],
    sections: [
      { title: "Node.js Basics", lessons: 10 },
      { title: "Express Framework", lessons: 12 },
      { title: "Databases", lessons: 10 },
      { title: "APIs & Deployment", lessons: 16 },
    ],
    reviews: [
      {
        id: 1,
        author: "Olivia Chen",
        avatar: "/diverse-woman-avatar.png",
        rating: 5,
        date: "5 days ago",
        content:
          "Excellent backend course. The projects are very practical and real-world.",
      },
    ],
  },
  {
    id: 12,
    title: "Content Marketing Strategy",
    instructor: "Rachel Green",
    rating: 4.6,
    students: 6800,
    price: 139.99,
    originalPrice: null,
    discount: null,
    level: "Beginner",
    duration: "22 hours",
    category: "Marketing",
    discountExpiresAt: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    image: "/content-marketing-strategy.jpg",
    description:
      "Learn content marketing strategies to attract and engage your audience.",
    learnings: [
      "Content strategy",
      "Blog writing",
      "Video content",
      "Social media content",
      "Email newsletters",
      "Content distribution",
    ],
    requirements: [
      "Basic writing skills",
      "Content creation tools",
      "Audience understanding",
    ],
    sections: [
      { title: "Strategy Basics", lessons: 5 },
      { title: "Content Creation", lessons: 8 },
      { title: "Distribution", lessons: 6 },
      { title: "Analytics", lessons: 3 },
    ],
    reviews: [
      {
        id: 1,
        author: "Kevin White",
        avatar: "/man-avatar.png",
        rating: 4,
        date: "2 weeks ago",
        content:
          "Solid content marketing course. Very useful strategies and tips.",
      },
    ],
  },
];
const CountdownTimer = ({ expiresAt }: { expiresAt: string }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(expiresAt).getTime();
      const difference = expiryTime - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const formatNumber = (num: number) => (num < 10 ? `0${num}` : num);

      setTimeLeft(
        `${formatNumber(days)}d : ${formatNumber(hours)}h : ${formatNumber(
          minutes
        )}m : ${formatNumber(seconds)}s`
      );
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return <span className="text-xs font-semibold text-white">{timeLeft}</span>;
};

export default function CourseDetailPageWrapper({ params }: { params: any }) {
  const unwrappedParams = React.use(params); // unwrap params
  return <CourseDetailPage params={unwrappedParams} />;
}

function CourseDetailPage({ params }: { params: { id: string } }) {
  const courseId = Number.parseInt(params.id);
  const course = allCourses.find((c) => c.id === courseId);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Course Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The course you're looking for doesn't exist.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl hover:bg-violet-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {course.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-xl text-violet-100 mb-6">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-300 fill-current" />
                  <span className="font-semibold">{course.rating} Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">
                    {course.students.toLocaleString()} Students
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">{course.level}</span>
                </div>
              </div>

              <p className="text-violet-100 mt-6">
                <span className="font-semibold">Instructor:</span>{" "}
                {course.instructor}
              </p>
            </div>

            {/* Image Course */}
            <div className="space-y-6">
              {/* Course Image */}
              <div className="rounded-xl overflow-hidden shadow-xl -mx-8 -mt-8 mb-6 relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src={
                    course.image && course.image.startsWith("http")
                      ? course.image
                      : "/placeholder.svg"
                  }
                  alt={course.title}
                  width={400} // width bắt buộc phải là number
                  height={250} // height bắt buộc phải là number
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-12">
              {/* What You'll Learn */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-violet-600" />
                  What You'll Learn
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.learnings.map((learning, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{learning}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Sections */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <PlayCircle className="w-8 h-8 text-violet-600" />
                  Course Sections
                </h2>
                <div className="space-y-4">
                  {course.sections.map((section, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-4 hover:border-violet-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">
                          {section.title}
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {section.lessons} lessons
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {course.requirements.map((requirement, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <div className="w-2 h-2 bg-violet-600 rounded-full mt-2 flex-shrink-0"></div>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Star className="w-8 h-8 text-violet-600" />
                  Student Reviews
                </h2>
                <div className="space-y-6">
                  {course.reviews && course.reviews.length > 0 ? (
                    course.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border border-gray-200 rounded-xl p-6 hover:border-violet-300 transition-colors"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.author}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-800">
                                {review.author}
                              </h3>
                              <span className="text-sm text-gray-500">
                                {review.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-700">{review.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">
                      No reviews yet. Be the first to review this course!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Sticky Info */}
            <div className="md:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Price Info */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4">
                  {/* Pricing Section */}
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3">
                          <span className="text-5xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                            ${course.price}
                          </span>
                          {course.originalPrice && (
                            <div className="flex flex-col">
                              <span className="text-xl text-gray-400 line-through font-medium">
                                ${course.originalPrice}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Discount & Countdown Row */}
                  <div className="h-[60px]">
                    {course.discount && (
                      <div className="flex items-center gap-3">
                        {/* Discount Badge */}
                        <div className="relative flex-shrink-0">
                          <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-red-400/50 backdrop-blur-sm animate-pulse">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl animate-shimmer"></div>
                            <TrendingDown className="w-5 h-5 flex-shrink-0 drop-shadow-lg" />
                            <span className="text-base tracking-wide drop-shadow-lg whitespace-nowrap">
                              -{course.discount}%
                            </span>
                          </div>
                        </div>

                        {/* Countdown Timer */}
                        <div className="relative group flex-1">
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                          <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-3 py-2 rounded-lg font-bold shadow-xl border border-orange-500/30">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-orange-400 animate-pulse flex-shrink-0" />
                                <span className="text-orange-300 text-xs font-semibold whitespace-nowrap">
                                  Kết thúc:
                                </span>
                              </div>
                              <div className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-red-300 to-pink-300">
                                <CountdownTimer
                                  expiresAt={course.discountExpiresAt}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                      Enroll Now
                    </button>
                    <button
                      onClick={() => setIsInCart(!isInCart)}
                      className={`w-full px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 ${
                        isInCart
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {isInCart ? "In Cart" : "Add to Cart"}
                    </button>
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`w-full px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 ${
                        isWishlisted
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isWishlisted ? "fill-current" : ""
                        }`}
                      />
                      {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                    </button>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Level</span>
                    <span className="font-semibold text-gray-800">
                      {course.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold text-gray-800">
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Students</span>
                    <span className="font-semibold text-gray-800">
                      {course.students.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-800">
                        {course.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200">
                  <h3 className="font-bold text-gray-800 mb-2">Instructor</h3>
                  <p className="text-gray-700 font-semibold">
                    {course.instructor}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Expert instructor with years of industry experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
