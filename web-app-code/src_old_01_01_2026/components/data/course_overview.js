const courseOverview = {
  course_id: "90348ndkjsn3",
  title: "JavaScript Essentials",
  description: "Learn core JavaScript concepts and how they are used in modern web development.",
  thumbnail: "https://i.ytimg.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
  total_lessons: 3,
  students: 2300,
  rating: 4.8,
  difficulty: "moderate",
  language: "English",
  duration: "4 hours 32 mins",
  oldPrice: 2000,
  offerPrice: 399,
  price: 399,
  pricePlan: "full",
  author: "Yotta Academy",
  certificate: "Upon completion of the course",
  resources: "12 files",
  critique: "Individual recordings",
  requirements: [
    "You will need a computer with internet access.",
    "You will create free accounts with Figma and Webflow."
  ],
  learnings: [
    "You will learn how to design beautiful websites using Figma, an interface design tool used by designers at Uber, Airbnb and Microsoft.",
    "You will learn how to take the designs and build them into websites using Webflow — a powerful site builder used by teams at Adobe, Dell, NASA and more."
  ],
  assignment:
    "Plan to dedicate a minimum of 1-2 hours a day to watch lecture videos, engage in sessions and complete assignments.",
  modules: [
    {
      lesson_id: "les_001",
      title: "Introduction to JavaScript",
      orderIndex: 1,
      topics: [
        {
          topic_id: "top_001",
          title: "What is JavaScript?",
          type: "video",
          description:
            "An introduction to JavaScript, its history, and how it powers the modern web.",
          thumbnail: "https://i.ytimg.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
          duration: "3 mins",
          contentUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk"
        },
        {
          topic_id: "top_002",
          title: "Setting up your environment",
          type: "article",
          description:
            "Learn how to set up your code editor, browser, and developer tools to start coding in JavaScript.",
          thumbnail:
            "https://developer.mozilla.org/static/img/opengraph-logo.72382e605ce3.png",
          contentUrl:
            "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction"
        }
      ]
    },
    {
      lesson_id: "les_002",
      title: "Variables and Data Types",
      orderIndex: 2,
      topics: [
        {
          topic_id: "top_003",
          title: "Understanding Variables",
          type: "video",
          description:
            "Explore how variables work in JavaScript and the differences between var, let, and const.",
          thumbnail: "https://i.ytimg.com/vi/qoSksQ4s_hg/maxresdefault.jpg",
          duration: "4.3 mins",
          contentUrl: "https://www.youtube.com/watch?v=qoSksQ4s_hg"
        },
        {
          topic_id: "top_004",
          title: "Data Types in JavaScript",
          type: "quiz",
          description:
            "Test your understanding of different data types such as strings, numbers, booleans, and objects in JavaScript.",
          thumbnail:
            "https://developer.mozilla.org/static/img/opengraph-logo.72382e605ce3.png",
          estimatedTime: "5 mins",
          contentUrl:
            "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Values,_variables,_and_literals"
        }
      ]
    },
    {
      lesson_id: "les_003",
      title: "Functions and Scope",
      orderIndex: 3,
      topics: [
        {
          topic_id: "top_005",
          title: "Function Declarations vs Expressions",
          type: "video",
          description:
            "Learn the difference between function declarations and expressions and when to use each.",
          thumbnail: "https://i.ytimg.com/vi/FtaQSdrl7YA/maxresdefault.jpg",
          duration: "3.4 mins",
          contentUrl: "https://www.youtube.com/watch?v=FtaQSdrl7YA"
        }
      ]
    }
  ]
};

export default courseOverview;