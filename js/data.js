/*
 * Portfolio content. Edit this file to change projects, links and contact details.
 * live:   public link to the running project ('' hides the button)
 * source: link to the code, e.g. a GitHub repo ('' shows "code on request")
 */
window.SITE = {
  name: 'Sam Walker',
  role: 'Full-Stack Developer',
  email: 'sam@threadandtrace.com',
  github: '',     // e.g. 'https://github.com/samwalker'
  linkedin: '',   // e.g. 'https://www.linkedin.com/in/samwalker'
};

window.PROJECTS = [
  {
    id: 'fanhub', title: 'Fan Hub Plus', cat: 'php', label: 'Full-stack platform', year: 'Live',
    stack: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap 5'],
    live: 'https://fanhubplus.site.je/?i=2', source: '',
    colors: ['#3b0d2e', '#ff3b2f'],
    summary: 'A fandom platform that brings Anime, Gaming, Movies, TV, K-Pop, Comics, Manga and Cosplay communities into one place.',
    features: ['User authentication and profiles', 'Content management for articles and character profiles', 'Search and filtering across eight categories', 'Events, multimedia and personalised content', 'Responsive dark interface'],
  },
  {
    id: 'pccentre', title: 'PC Centre', cat: 'frontend', label: 'E-commerce interface', year: 'Live',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Vercel'],
    live: 'https://pc-centre.vercel.app/', source: '',
    colors: ['#0b1d2e', '#3aa0ff'],
    summary: 'A dark, modern storefront for PC parts and tech, focused on fast, pleasant product browsing on any screen.',
    features: ['Category navigation and product browsing', 'Product cards and detail UI', 'JavaScript interactions', 'Responsive layout from desktop to phone'],
  },
  {
    id: 'furshield', title: 'FurShield', cat: 'php', label: 'PHP web application', year: 'Live',
    stack: ['PHP', 'MySQL', 'HTML5', 'CSS3'],
    live: 'https://furshieldpet.site.je/furshield/index.php', source: '',
    colors: ['#13261d', '#4ade80'],
    summary: 'A pet-focused website built in PHP, with dynamic server-rendered pages and a MySQL-oriented structure.',
    features: ['PHP backend rendering dynamic pages', 'Application structure built around MySQL data', 'Reusable page components', 'Interactive, responsive UI'],
  },
  {
    id: 'pulse', title: 'Pulse Admin', cat: 'frontend', label: 'Analytics dashboard', year: '2026',
    stack: ['Bootstrap 5', 'Chart.js', 'JavaScript'],
    live: 'https://claude.ai/artifact/XQG9GLTzq1AkXrnNcoJChG', source: '',
    colors: ['#1e1b4b', '#818cf8'],
    summary: 'A sales dashboard with live charts, KPI comparisons and a sortable, searchable orders table.',
    features: ['Three Chart.js charts with 7/30/90-day ranges', 'Orders table: search, filter, sort, paginate, export CSV', 'Order modal with ship and refund actions', 'Light and dark mode'],
  },
  {
    id: 'seatpick', title: 'SeatPick', cat: 'frontend', label: 'Cinema booking', year: '2026',
    stack: ['Bootstrap 5', 'JavaScript', 'localStorage'],
    live: 'https://claude.ai/artifact/T3KE9kAHfsXny8JDP3Sium', source: '',
    colors: ['#1a1405', '#ffc531'],
    summary: 'Pick a film, a showtime and exact seats on a 152-seat map, then get a printable ticket.',
    features: ['Seat map with three price tiers and aisles', 'Live price summary and 8-seat limit', 'Validated checkout and printable ticket', 'Bookings saved; cancelling releases seats'],
  },
  {
    id: 'invoicely', title: 'Invoicely', cat: 'frontend', label: 'Invoice generator', year: '2026',
    stack: ['Bootstrap 5', 'JavaScript', 'Print CSS'],
    live: 'https://claude.ai/artifact/JCJRmDNVnvGHycQnqcCu6H', source: '',
    colors: ['#0f2a3f', '#7dd3fc'],
    summary: 'Write an invoice and watch an A4 preview update live, then save it as a PDF.',
    features: ['Live preview with logo upload', 'Tax, discount and five currencies', 'Autosave and invoice history', 'Print stylesheet for clean PDFs'],
  },
  {
    id: 'quizcraft', title: 'QuizCraft', cat: 'frontend', label: 'Quiz app', year: '2026',
    stack: ['Bootstrap 5', 'JavaScript'],
    live: 'https://claude.ai/artifact/HyUKHFWNNHPHfB11WfPMNX', source: '',
    colors: ['#2a1d05', '#fde047'],
    summary: 'Timed quizzes on HTML, CSS, JavaScript, PHP and MySQL, with an explanation for every answer.',
    features: ['30 questions, shuffled every round', 'Per-question timer, score and streak', 'Answer review and local leaderboard', 'Keyboard controls'],
  },
  {
    id: 'kanban', title: 'Kanban Flow', cat: 'frontend', label: 'Task board', year: '2026',
    stack: ['HTML5', 'CSS3', 'JavaScript'],
    live: 'https://claude.ai/artifact/2wxHTiGqdRkcYJ2uwCai1N', source: '',
    colors: ['#0e1a33', '#6d8dff'],
    summary: 'A drag-and-drop task board with priorities, due dates and search, saved in the browser.',
    features: ['Drag and drop between four columns', 'Priorities, tags and overdue highlighting', 'Search, filter, JSON import/export', 'Light and dark theme'],
  },
  {
    id: 'typerush', title: 'TypeRush', cat: 'frontend', label: 'Typing test', year: '2026',
    stack: ['JavaScript', 'Canvas'],
    live: 'https://claude.ai/artifact/34hSBPJyJ1e7ajTk7xawZ7', source: '',
    colors: ['#1f1a10', '#f2b134'],
    summary: 'A typing speed test with live WPM, accuracy and a results graph drawn on canvas.',
    features: ['15, 30 and 60 second modes', 'Per-letter error highlighting', 'WPM-over-time chart', 'Personal bests saved locally'],
  },
  {
    id: 'stockroom', title: 'StockRoom', cat: 'php', label: 'Inventory system', year: '2026',
    stack: ['PHP 8', 'MySQL', 'PDO'],
    live: '', source: '',
    colors: ['#14231a', '#86efac'],
    summary: 'Inventory management with secure login, stock in/out tracking and low-stock alerts.',
    features: ['Dashboard with value, low-stock and a 14-day chart', 'Products CRUD with search, filters and pagination', 'Transactions with row locking, so stock never goes negative', 'CSRF protection and prepared statements throughout'],
  },
  {
    id: 'linklite', title: 'LinkLite', cat: 'php', label: 'URL shortener', year: '2026',
    stack: ['PHP 8', 'MySQL', 'SVG'],
    live: '', source: '',
    colors: ['#2b1408', '#fb923c'],
    summary: 'Short links with custom aliases and click analytics: referrers, devices and a 30-day chart.',
    features: ['Clean short URLs via Apache rewrite', 'Click tracking with bot filtering', 'Server-rendered SVG charts', 'Rate limiting and hashed visitor data'],
  },
  {
    id: 'clinic', title: 'Clinic Booking API', cat: 'dotnet', label: 'ASP.NET Core API', year: '2026',
    stack: ['C#', 'ASP.NET Core 8', 'EF Core', 'SQLite'],
    live: '', source: '',
    colors: ['#062a2a', '#2dd4bf'],
    summary: 'A REST API for doctors, patients and appointments, with a dashboard that books real slots.',
    features: ['Minimal API endpoints documented with Swagger', 'Slot availability from doctor working hours', 'Double-booking protection inside a transaction', 'Validation problem responses and status workflow'],
  },
  {
    id: 'expense', title: 'Expense Tracker', cat: 'dotnet', label: 'C# desktop app', year: '2026',
    stack: ['C#', 'WinForms', '.NET 8'],
    live: '', source: '',
    colors: ['#101b33', '#60a5fa'],
    summary: 'A Windows app for tracking spending against a monthly budget, with a category breakdown.',
    features: ['Add, edit and delete with validation', 'Monthly budget with progress and remaining', 'Category chart drawn with GDI+', 'CSV export and JSON storage'],
  },
];

window.SKILLS = [
  { group: 'Frontend', items: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Bootstrap 5', 'Responsive design', 'GSAP', 'Three.js', 'UI/UX'],
    text: 'Interfaces that load fast, read clearly and move with purpose, from 320px phones to wide monitors.' },
  { group: 'Backend', items: ['PHP', 'MySQL', 'C#', 'ASP.NET Core', 'Backend architecture', 'Database development'],
    text: 'Server logic, authentication and well-modelled data, so features stay simple to build and safe to run.' },
  { group: 'Tools', items: ['Visual Studio 2022', 'Visual Studio 2026', 'VS Code', 'Git & GitHub'],
    text: 'The everyday kit: debugging, version control and keeping projects tidy enough to hand over.' },
];
