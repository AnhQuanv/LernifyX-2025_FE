export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: number;
  videoUrl: string;
  content: string;
  hasQuiz: boolean;
  completed: boolean;
  canViewVideo?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  completed?: boolean;
  score?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface CourseDetail {
  id: string;
  title: string;
  instructor: string;
  image: string;
  description: string;
  duration: number; // total duration in hours
  level: "Beginner" | "Intermediate" | "Advanced";
  chapters: Chapter[];
  progress: number;
  completedLessons: number;
  totalLessons: number;
  status: "in-progress" | "completed" | "purchased";
}

export const mockCoursesDetail: Record<string, CourseDetail> = {
  "1": {
    id: "1",
    title: "React Advanced Patterns",
    instructor: "John Doe",
    image: "/react-course.jpg",
    description:
      "Master advanced React patterns including custom hooks, render props, higher-order components, and more.",
    duration: 12,
    level: "Advanced",
    progress: 65,
    completedLessons: 8,
    totalLessons: 12,
    status: "in-progress",
    chapters: [
      {
        id: "ch1",
        title: "Chapter 1: Advanced Hooks",
        lessons: [
          {
            id: "l1",
            title: "useCallback and useMemo",
            duration: 25,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content:
              "Learn how to optimize performance with useCallback and useMemo hooks.",
            hasQuiz: true,
            completed: true,
            notes:
              "Key Points:\n- useCallback memoizes functions to prevent unnecessary re-renders\n- useMemo memoizes expensive computations\n- Both should be used carefully to avoid over-optimization\n- Use dependency arrays correctly to avoid bugs",
            comments: [
              {
                id: "c1",
                author: "Alex Johnson",
                avatar: "/diverse-avatars.png",
                text: "Great explanation! This really helped me understand the difference between useCallback and useMemo.",
                timestamp: "2 days ago",
                likes: 5,
              },
              {
                id: "c2",
                author: "Sarah Lee",
                avatar: "/diverse-avatars.png",
                text: "Can you provide more examples of when to use these hooks?",
                timestamp: "1 day ago",
                likes: 2,
              },
            ],
          },
          {
            id: "l2",
            title: "Custom Hooks Deep Dive",
            duration: 30,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Create reusable logic with custom hooks.",
            hasQuiz: true,
            completed: false,
            notes:
              'Important Topics:\n- Rules of Hooks (can only call at top level)\n- Naming convention (must start with "use")\n- Extract logic into custom hooks for reusability\n- Share state logic between components',
            comments: [
              {
                id: "c1",
                author: "Mike Chen",
                avatar: "/diverse-avatars.png",
                text: "The custom hook examples were very practical!",
                timestamp: "3 days ago",
                likes: 8,
              },
            ],
          },
        ],
      },
      {
        id: "ch2",
        title: "Chapter 2: Render Props & HOC",
        lessons: [
          {
            id: "l3",
            title: "Render Props Pattern",
            duration: 20,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content:
              "Master the render props pattern for component composition.",
            hasQuiz: false,
            completed: true,
            notes:
              "Remember:\n- Render props is a function as a child pattern\n- Allows components to share code more flexibly\n- Alternative to HOC for reusing component logic",
            comments: [],
          },
          {
            id: "l4",
            title: "Higher Order Components",
            duration: 28,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Create HOCs for advanced component logic reuse.",
            hasQuiz: true,
            completed: true,
            notes:
              "HOC Best Practices:\n- Static methods must be copied\n- Refs will not be passed through\n- Use with caution - can make code harder to follow\n- Consider using render props or custom hooks instead",
            comments: [
              {
                id: "c1",
                author: "Emma Davis",
                avatar: "/diverse-avatars.png",
                text: "This was enlightening! Modern hooks are definitely the way to go.",
                timestamp: "5 days ago",
                likes: 12,
              },
            ],
          },
        ],
      },
    ],
  },
  "2": {
    id: "2",
    title: "TypeScript Mastery",
    instructor: "Jane Smith",
    image: "/typescript-course.jpg",
    description:
      "Complete guide to TypeScript from basics to advanced type system features.",
    duration: 15,
    level: "Intermediate",
    progress: 45,
    completedLessons: 7,
    totalLessons: 15,
    status: "in-progress",
    chapters: [
      {
        id: "ch1",
        title: "Chapter 1: TypeScript Basics",
        lessons: [
          {
            id: "l1",
            title: "Type Annotations",
            duration: 20,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Learn basic type annotations in TypeScript.",
            hasQuiz: true,
            completed: true,
            notes:
              "Basic Types:\n- string, number, boolean, array\n- any (avoid when possible)\n- union types: string | number\n- Type inference helps reduce annotations",
            comments: [
              {
                id: "c1",
                author: "John Smith",
                avatar: "/diverse-avatars.png",
                text: "Finally a clear explanation of TypeScript types!",
                timestamp: "4 days ago",
                likes: 6,
              },
            ],
          },
          {
            id: "l2",
            title: "Interfaces and Types",
            duration: 25,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content:
              "Understanding the difference between interfaces and types.",
            hasQuiz: true,
            completed: true,
            notes:
              "Key Differences:\n- Interfaces can be merged, types cannot\n- Types can use union and mapped types\n- Interfaces are better for object shapes\n- Use types for more complex scenarios",
            comments: [],
          },
        ],
      },
      {
        id: "ch2",
        title: "Chapter 2: Advanced Types",
        lessons: [
          {
            id: "l3",
            title: "Generic Types",
            duration: 30,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Create reusable components with generics.",
            hasQuiz: true,
            completed: false,
            notes:
              "Generics Concepts:\n- Type parameters: <T>\n- Constraints: <T extends Type>\n- Multiple type parameters: <T, U>\n- Useful for creating flexible, reusable types",
            comments: [],
          },
          {
            id: "l4",
            title: "Union and Intersection Types",
            duration: 22,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Combine types with union and intersection.",
            hasQuiz: false,
            completed: false,
            notes:
              "Type Operators:\n- Union (|): can be one or another\n- Intersection (&): must be all of them\n- Useful for complex type compositions",
            comments: [],
          },
        ],
      },
    ],
  },
  "3": {
    id: "3",
    title: "Next.js Full Stack",
    instructor: "Mike Johnson",
    image: "/nextjs-course.jpg",
    description:
      "Build complete full-stack applications with Next.js 13+ and latest features.",
    duration: 20,
    level: "Advanced",
    progress: 100,
    completedLessons: 20,
    totalLessons: 20,
    status: "completed",
    chapters: [
      {
        id: "ch1",
        title: "Chapter 1: App Router",
        lessons: [
          {
            id: "l1",
            title: "Introduction to App Router",
            duration: 25,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Getting started with Next.js App Router.",
            hasQuiz: true,
            completed: true,
            notes:
              "App Router Features:\n- File-based routing\n- Server Components by default\n- Improved layouts and nested routes\n- Better data fetching with async components",
            comments: [
              {
                id: "c1",
                author: "Lisa Wong",
                avatar: "/diverse-avatars.png",
                text: "App Router completely changed how I build with Next.js!",
                timestamp: "1 week ago",
                likes: 15,
              },
            ],
          },
          {
            id: "l2",
            title: "Dynamic Routes",
            duration: 20,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Create dynamic routes in Next.js.",
            hasQuiz: true,
            completed: true,
            notes:
              "Dynamic Routing:\n- Use [id] for dynamic segments\n- Use [...slug] for catch-all routes\n- Access params via useParams()\n- Perfect for blog posts, product pages",
            comments: [],
          },
        ],
      },
    ],
  },
  "4": {
    id: "4",
    title: "Tailwind CSS Fundamentals",
    instructor: "Sarah Williams",
    image: "/tailwind-course.jpg",
    description:
      "Master Tailwind CSS and create beautiful designs with utility-first CSS.",
    duration: 10,
    level: "Beginner",
    progress: 100,
    completedLessons: 10,
    totalLessons: 10,
    status: "completed",
    chapters: [
      {
        id: "ch1",
        title: "Chapter 1: Getting Started",
        lessons: [
          {
            id: "l1",
            title: "Setup and Installation",
            duration: 15,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Setup Tailwind CSS in your project.",
            hasQuiz: false,
            completed: true,
            notes:
              "Setup Steps:\n1. Install Tailwind via npm\n2. Configure template paths\n3. Add directives to CSS\n4. Start using utility classes",
            comments: [],
          },
        ],
      },
    ],
  },
  "5": {
    id: "5",
    title: "GraphQL API Development",
    instructor: "Alex Brown",
    image: "/graphql-course.jpg",
    description:
      "Build efficient APIs with GraphQL. Learn schemas, resolvers, and best practices.",
    duration: 18,
    level: "Intermediate",
    progress: 0,
    completedLessons: 0,
    totalLessons: 18,
    status: "purchased",
    chapters: [
      {
        id: "ch1",
        title: "Chapter 1: GraphQL Basics",
        lessons: [
          {
            id: "l1",
            title: "What is GraphQL?",
            duration: 20,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Introduction to GraphQL and its advantages.",
            hasQuiz: true,
            completed: false,
            notes:
              "GraphQL Intro:\n- Query language for APIs\n- Strongly typed schema\n- Get exactly what you ask for\n- Better than REST in many scenarios",
            comments: [],
          },
          {
            id: "l2",
            title: "Schema Definition",
            duration: 25,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Define GraphQL schemas.",
            hasQuiz: true,
            completed: false,
            notes:
              "Schema Basics:\n- Types define structure\n- Queries are read operations\n- Mutations are write operations\n- Subscriptions for real-time updates",
            comments: [],
          },
        ],
      },
    ],
  },
  "6": {
    id: "6",
    title: "Python Web Scraping",
    instructor: "Emma Davis",
    image: "/python-course.jpg",
    description:
      "Learn web scraping techniques using Python. Extract and analyze web data.",
    duration: 14,
    level: "Beginner",
    progress: 0,
    completedLessons: 0,
    totalLessons: 14,
    status: "purchased",
    chapters: [
      {
        id: "ch1",
        title: "Chapter 1: Web Scraping Basics",
        lessons: [
          {
            id: "l1",
            title: "Introduction to BeautifulSoup",
            duration: 30,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Get started with BeautifulSoup library.",
            hasQuiz: false,
            completed: false,
            notes:
              "BeautifulSoup Guide:\n- Parse HTML/XML\n- Navigate document tree\n- Search and filter elements\n- Extract data reliably",
            comments: [],
          },
        ],
      },
    ],
  },
};

export const getCourseMockData = (
  courseId: string
): CourseDetail | undefined => {
  return mockCoursesDetail[courseId];
};

const mockLesson = {
  id: "1-1",
  title: "Introduction to HTML",
  duration: "15 min",
  completed: false,
  hasQuiz: false,
  videoUrl:
    "https://res.cloudinary.com/drc4b7rmj/video/upload/v1763726091/h4ogqnwmsshbvfneixkv.mp4",
  content: "Learn the basics of HTML including tags, elements, and structure.",
  chapter: "Chapter 1: HTML Fundamentals",
  chapterIndex: 0,
  lessonIndex: 0,
};

const mockChapters = [
  {
    id: "1",
    title: "Chapter 1: HTML Fundamentals",
    lessons: [
      {
        id: "1-1",
        title: "Introduction to HTML",
        duration: "15 min",
        completed: true,
      },
      {
        id: "1-2",
        title: "HTML Tags and Elements",
        duration: "25 min",
        completed: true,
      },
      {
        id: "1-3",
        title: "Forms and Input",
        duration: "20 min",
        completed: false,
      },
    ],
  },
  {
    id: "2",
    title: "Chapter 2: CSS Styling",
    lessons: [
      {
        id: "2-1",
        title: "CSS Selectors",
        duration: "18 min",
        completed: false,
      },
      { id: "2-2", title: "Box Model", duration: "22 min", completed: false },
      {
        id: "2-3",
        title: "Flexbox and Grid",
        duration: "30 min",
        completed: false,
      },
    ],
  },
  {
    id: "3",
    title: "Chapter 3: JavaScript Basics",
    lessons: [
      {
        id: "3-1",
        title: "Variables and Data Types",
        duration: "20 min",
        completed: false,
      },
      {
        id: "3-2",
        title: "Functions and Scope",
        duration: "25 min",
        completed: false,
      },
      {
        id: "3-3",
        title: "DOM Manipulation",
        duration: "28 min",
        completed: false,
      },
    ],
  },
];

const mockComments = [
  {
    id: "1",
    author: "John Smith",
    avatar:
      "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    content:
      "Great explanation! I finally understand how HTML structure works.",
    createdAt: "2024-11-15",
    replies: 2,
  },
  {
    id: "2",
    author: "Sarah Johnson",
    avatar:
      "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    content:
      "Can you explain the difference between semantic and non-semantic tags?",
    createdAt: "2024-11-10",
    replies: 1,
  },
];

const mockQuiz = [
  {
    id: "1",
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
    ],
    correctAnswer: 0,
  },
  {
    id: "2",
    question: "Which tag is used for the largest heading?",
    options: ["<h6>", "<h1>", "<head>", "<header>"],
    correctAnswer: 1,
  },
  {
    id: "3",
    question: "What is the correct syntax for a comment in HTML?",
    options: [
      "// comment",
      "<!-- comment -->",
      "{ comment }",
      "{ // comment }",
    ],
    correctAnswer: 1,
  },
];

const mockComments = [
  {
    id: "1",
    author: "John Smith",
    avatar:
      "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    content:
      "Great explanation! I finally understand how HTML structure works.",
    createdAt: "2024-11-15",
    replies: 2,
  },
  {
    id: "2",
    author: "Sarah Johnson",
    avatar:
      "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    content:
      "Can you explain the difference between semantic and non-semantic tags?",
    createdAt: "2024-11-10",
    replies: 1,
  },
];
