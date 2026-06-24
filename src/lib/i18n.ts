/**
 * i18n configuration for Arabic/English support with RTL.
 */

import { create } from "zustand";

export type Language = "en" | "ar";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.explore": "Explore",
    "nav.categories": "Categories",
    "nav.search": "Search",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.articles": "Articles",
    "nav.toggle_menu": "Toggle menu",

    // Hero
    "hero.badge": "100% Free · No Registration Required",
    "hero.title": "Discover Who You Really Are",
    "hero.subtitle":
      "Viral personality quizzes, IQ tests, and career assessments — take any quiz instantly and share your results with friends.",
    "hero.cta_explore": "Explore Quizzes",
    "hero.cta_categories": "Browse Categories",

    // Home
    "home.trending": "🔥 Trending Quizzes",
    "home.browse_category": "📂 Browse by Category",
    "home.popular_week": "Popular This Week",
    "home.cta.badge": "Ready to discover yourself?",
    "home.cta.title": "Take a Quiz — It's Completely Free",
    "home.cta.description":
      "No account needed. Start any quiz right now and share your results with friends.",
    "home.cta.explore_all": "Explore All Quizzes",
    "home.category.personality": "Personality",
    "home.category.iq": "IQ Tests",
    "home.category.mental_age": "Mental Age",
    "home.category.career": "Career",
    "home.category.relationship": "Relationship",
    "home.category.anime": "Anime",
    "home.category.entertainment": "Entertainment",
    "home.category.color": "Color Tests",

    // Buttons
    "btn.start": "Start Quiz",
    "btn.next": "Next",
    "btn.previous": "Previous",
    "btn.submit": "Submit",
    "btn.share": "Share",
    "btn.download": "Download",
    "btn.copy": "Copy",
    "btn.view_all": "View All",
    "lang.switch_to_ar": "العربية",
    "lang.switch_to_en": "English",
    "a11y.skip_content": "Skip to content",

    // Quiz
    "quiz.trending": "Trending Quizzes",
    "quiz.popular": "Popular Quizzes",
    "quiz.new": "New Quizzes",
    "quiz.featured": "Featured Quizzes",
    "quiz.related": "Related Quizzes",
    "quiz.suggested": "Try Another Quiz",

    // Admin
    "admin.dashboard": "Admin Dashboard",
    "admin.login": "Admin Login",
    "admin.logout": "Logout",
    "admin.quizzes": "Manage Quizzes",
    "admin.categories": "Categories",
    "admin.media": "Media Library",
    "admin.analytics": "Analytics",
    "admin.articles": "Manage Articles",
    "admin.settings": "Settings",
    "admin.overview": "Overview",
    "admin.area": "Admin Area",
    "admin.console": "Al-Maarefah Console",
    "admin.secure_workspace": "Secure Workspace",
    "admin.secure_note": "Admin-only workspace.",
    "admin.welcome": "Welcome back! Here's your quiz platform overview.",
    "admin.go_home": "Go to Homepage",
    "admin.quick_actions": "Quick Actions",
    "admin.recent_activity": "Recent Activity",
    "admin.stats.total_quizzes": "Total Quizzes",
    "admin.stats.published_quizzes": "Published Quizzes",
    "admin.stats.quiz_completions": "Quiz Completions",
    "admin.stats.categories": "Categories",
    "admin.action.create_quiz": "Create Quiz",
    "admin.action.manage_quizzes": "Manage Quizzes",
    "admin.action.categories": "Categories",
    "admin.action.media_library": "Media Library",
    "admin.action.analytics": "Analytics",
    "admin.action.settings": "Settings",
    "admin.common.cancel": "Cancel",
    "admin.categories.page_title": "Category Management",
    "admin.categories.page_subtitle": "Create and manage quiz categories",
    "admin.categories.new": "New Category",
    "admin.categories.edit_title": "Edit Category",
    "admin.categories.create_title": "Create New Category",
    "admin.categories.name_label": "Name *",
    "admin.categories.name_placeholder": "Category name",
    "admin.categories.slug_label": "Slug",
    "admin.categories.slug_placeholder": "category-slug (auto-generated if empty)",
    "admin.categories.icon_label": "Icon",
    "admin.categories.color_label": "Color",
    "admin.categories.description_label": "Description *",
    "admin.categories.description_placeholder": "Category description",
    "admin.categories.create": "Create Category",
    "admin.categories.update": "Update Category",
    "admin.categories.name_desc_required": "Name and description are required",
    "admin.categories.created": "Category created successfully",
    "admin.categories.updated": "Category updated successfully",
    "admin.categories.deleted": "Category deleted successfully",
    "admin.categories.delete_confirm": "Are you sure? This cannot be undone.",
    "admin.settings.page_title": "Website Settings",
    "admin.settings.page_subtitle": "Customize your website appearance and branding",
    "admin.settings.color_scheme": "Color Scheme",
    "admin.settings.primary_color": "Primary Color",
    "admin.settings.accent_color": "Accent Color",
    "admin.settings.preview": "Preview",
    "admin.settings.branding": "Branding",
    "admin.settings.website_logo": "Website Logo",
    "admin.settings.upload_logo": "Upload Logo",
    "admin.settings.favicon": "Favicon",
    "admin.settings.upload_favicon": "Upload Favicon",
    "admin.settings.reset": "Reset to Default",
    "admin.settings.save_changes": "Save Changes",
    "admin.settings.saving": "Saving...",
    "admin.settings.saved": "Settings saved successfully",
    "admin.settings.save_failed": "Failed to save settings",
    "admin.settings.logo_updated": "Logo updated successfully",
    "admin.settings.logo_upload_failed": "Failed to upload logo",
    "admin.settings.favicon_updated": "Favicon updated successfully",
    "admin.settings.favicon_upload_failed": "Failed to upload favicon",
    "admin.media.page_title": "Media Library",
    "admin.media.page_subtitle": "Manage and organize images and videos",
    "admin.media.upload_files": "Upload Files",
    "admin.media.upload_hint": "Drag and drop your images and videos here, or click to browse",
    "admin.media.uploading": "Uploading...",
    "admin.media.select_files": "Select Files",
    "admin.media.max_size": "Maximum file size: 50MB",
    "admin.media.total_files": "Total Files",
    "admin.media.images": "Images",
    "admin.media.total_size": "Total Size",
    "admin.media.no_files": "No files uploaded yet",
    "admin.media.copy_url": "Copy URL",
    "admin.media.download": "Download",
    "admin.media.delete": "Delete",
    "admin.media.upload_success": "Files uploaded successfully",
    "admin.media.file_deleted": "File deleted",
    "admin.media.url_copied": "URL copied to clipboard",
    "admin.media.delete_confirm": "Delete this file?",
    "admin.activity.quiz_created": "Quiz Created",
    "admin.activity.quiz_published": "Quiz Published",
    "admin.activity.category_added": "Category Added",
    "admin.activity.item1": "Personality Color Test",
    "admin.activity.item2": "IQ Test",
    "admin.activity.item3": "Career Tests",
    "admin.activity.time1": "2 hours ago",
    "admin.activity.time2": "1 day ago",
    "admin.activity.time3": "3 days ago",

    // Articles
    "articles.title": "Articles",
    "articles.latest": "Latest Articles",
    "articles.read_more": "Read More",
    "articles.published": "Published",
    "articles.subtitle":
      "Explore insights and tips about personality, psychology, and personal development",
    "articles.search_placeholder": "Search articles...",
    "articles.filter_all": "All",
    "articles.no_results": "No articles found matching your search",
    "articles.views_suffix": "views",

    // Explore
    "explore.title": "Explore All Quizzes",
    "explore.subtitle": "quizzes across categories — find your next favourite.",
    "explore.search_placeholder": "Search quizzes…",
    "explore.filter_all": "All",
    "explore.results_suffix": "results",
    "explore.none_title": "No quizzes found",
    "explore.none_subtitle": "Try a different keyword or category",
    "explore.clear_filters": "Clear Filters",
    "explore.found_suffix": "Quizzes Found",
    "explore.sort.trending": "🔥 Trending",
    "explore.sort.popular": "⭐ Popular",
    "explore.sort.newest": "🆕 Newest",
    "explore.sort.fastest": "⚡ Quickest",

    // Categories
    "categories.title": "Quiz Categories",
    "categories.subtitle": "Explore categories and find quizzes that match your curiosity.",
    "categories.count_suffix": "quizzes",
    "categories.cta.title": "Can't decide? Start with the most popular quiz.",
    "categories.cta.button": "🔥 Dark Personality Test",
    "categories.personality": "Personality",
    "categories.iq": "IQ Tests",
    "categories.mental-age": "Mental Age",
    "categories.career": "Career",
    "categories.relationship": "Relationship",
    "categories.friendship": "Friendship",
    "categories.stress": "Stress",
    "categories.memory": "Memory",
    "categories.entertainment": "Entertainment",
    "categories.anime": "Anime",
    "categories.color": "Color Personality",
    "categories.knowledge": "General Knowledge",
    "categories.desc.personality":
      "Uncover your unique traits, strengths and tendencies.",
    "categories.desc.iq": "Challenge your reasoning and problem-solving skills.",
    "categories.desc.mental-age":
      "Find out how young (or wise) your mind really is.",
    "categories.desc.career":
      "Discover which careers suit your natural strengths.",
    "categories.desc.relationship":
      "Explore your love language and relationship style.",
    "categories.desc.friendship": "Learn what kind of friend you truly are.",
    "categories.desc.stress":
      "Measure your stress and get personalized coping strategies.",
    "categories.desc.memory":
      "Test and train your short-term and long-term memory.",
    "categories.desc.entertainment":
      "Fun pop-culture and movie/TV quizzes for everyone.",
    "categories.desc.anime":
      "Which anime character or series matches your personality?",
    "categories.desc.color":
      "Reveal what your favorite colors say about you.",
    "categories.desc.knowledge":
      "Test your trivia and general knowledge across topics.",

    // Search page
    "search.title": "Search Quizzes",
    "search.subtitle": "Find your perfect quiz from our library",
    "search.placeholder": "Type to search…",
    "search.popular": "Popular Searches",
    "search.results_for": "results for",
    "search.none_title": "No results found",
    "search.none_subtitle": "Try different keywords or browse categories",
    "search.browse_categories": "Browse all categories",
    "search.trending_now": "🔥 Trending Now",
    "search.view_all": "View all quizzes",
    "search.filter_by_category": "Filter by Category",

    // Quiz detail
    "quizDetail.back": "Back",
    "quizDetail.notFound.title": "Quiz Not Found",
    "quizDetail.notFound.subtitle": "This quiz doesn't exist or has been removed.",
    "quizDetail.notFound.cta": "Browse All Quizzes",
    "quizDetail.questions": "questions",
    "quizDetail.minutes": "minutes",
    "quizDetail.min": "min",
    "quizDetail.taken": "taken",
    "quizDetail.related": "Related Quizzes",
    "quizDetail.ready": "Ready to start?",
    "quizDetail.startQuiz": "Start Quiz",
    "quizDetail.freeNote": "Free · No account required · Instant results",
    "quizDetail.share": "Share Quiz",
    "quizDetail.shareCopied": "Link Copied!",
    "quizDetail.category": "Category",
    "quizDetail.difficulty": "Difficulty",
    "quizDetail.type": "Type",
    "quizDetail.difficulty.easy": "Easy",
    "quizDetail.difficulty.medium": "Medium",
    "quizDetail.difficulty.hard": "Hard",
    "quizDetail.type.weighted_personality": "Weighted Personality",
    "quizDetail.type.personality_based": "Personality Based",
    "quizDetail.type.score_based": "Score Based",
    "quizDetail.type.percentage_matching": "Percentage Matching",
    "quizDetail.type.standard": "Standard",
    "quiz.seed.dark.title": "ما مدى ظلام شخصيتك؟",
    "quiz.seed.dark.description":
      "اكتشف الجانب المظلم من سمات شخصيتك بطريقة ممتعة وآمنة.",

    // Settings
    "settings.theme": "Theme Settings",
    "settings.colors": "Website Colors",
    "settings.logo": "Logo",
    "settings.save": "Save Changes",

    // Footer
    "footer.company": "Company",
    "footer.categories": "Categories",
    "footer.product": "Product",
    "footer.legal": "Legal",
    "footer.description":
      "Discover yourself through fun, accurate, and engaging personality quizzes.",
    "footer.all_categories": "All Categories",
    "footer.personality": "Personality",
    "footer.iq_tests": "IQ Tests",
    "footer.career": "Career",
    "footer.entertainment": "Entertainment",
    "footer.about_us": "About Us",
    "footer.contact": "Contact",
    "footer.faq": "FAQ",
    "footer.privacy_policy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.made_with": "Made with ❤️ for curious minds",
    "footer.rights_only": "All rights reserved.",
    "footer.copyright": "© 2026 Al-Maarefah. All rights reserved.",

    // About page
    "about.title": "About Al-Maarefah",
    "about.subtitle":
      "Al-Maarefah is a viral quiz platform built for curious minds. We believe self-discovery should be fun, fast, and free — no account required.",
    "about.value.speed.title": "Speed First",
    "about.value.speed.body":
      "Every quiz loads instantly and results appear the second you finish.",
    "about.value.accuracy.title": "Accuracy Matters",
    "about.value.accuracy.body":
      "Our quizzes are researched and validated to give meaningful, reliable insights.",
    "about.value.free.title": "Always Free",
    "about.value.free.body":
      "No paywall, no registration, no tricks. Al-Maarefah is free for everyone, forever.",
    "about.mission.title": "Our Mission",
    "about.mission.p1":
      "We created Al-Maarefah because great personality insights and IQ tests were locked behind paywalls, email signups, and intrusive apps. We wanted something different: a platform where you open the site, take a quiz, get your result, and share it — all in under five minutes.",
    "about.mission.p2":
      "Every quiz on Al-Maarefah is crafted with care: researched by psychology enthusiasts, written by storytellers, and designed by people who care about user experience. We're building the quiz platform we always wanted to use.",

    // Contact page
    "contact.title": "Contact Us",
    "contact.subtitle": "Have a question, suggestion, or just want to say hi?",
    "contact.email_title": "Email Us",
    "contact.sent.title": "Message sent!",
    "contact.sent.subtitle": "We'll get back to you within 24–48 hours.",
    "contact.sent.another": "Send another",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.subject": "Subject",
    "contact.form.message": "Message",
    "contact.form.name_placeholder": "Your name",
    "contact.form.email_placeholder": "you@example.com",
    "contact.form.subject_placeholder": "What's this about?",
    "contact.form.message_placeholder": "Tell us what's on your mind…",
    "contact.form.submit": "Send Message",

    // FAQ page
    "faq.title": "Frequently Asked Questions",
    "faq.subtitle": "Everything you need to know about Al-Maarefah.",
    "faq.q1": "Are all quizzes free?",
    "faq.a1":
      "Yes! Every quiz on Al-Maarefah is 100% free. No subscriptions, no hidden fees, no paywalls — ever.",
    "faq.q2": "Do I need to create an account?",
    "faq.a2":
      "Absolutely not. You can take any quiz instantly without signing up. Just visit the quiz page and start.",
    "faq.q3": "Are the results accurate?",
    "faq.a3":
      "Our quizzes are built with care and draw from established psychological frameworks. That said, they're designed for fun and self-reflection — not clinical diagnosis.",
    "faq.q4": "Can I share my result?",
    "faq.a4":
      "Yes! Every result page has share buttons for major social platforms, plus a copy-link option. Sharing is encouraged.",
    "faq.q5": "How often are new quizzes added?",
    "faq.a5":
      "We add new quizzes regularly — typically a few each week. Follow us on social media to be the first to know.",
    "faq.q6": "Is my data private?",
    "faq.a6":
      "We don't collect personal data beyond anonymous usage analytics used to improve the platform. We never sell your data. See our Privacy Policy for full details.",
    "faq.q7": "Can I suggest a quiz topic?",
    "faq.a7":
      "We'd love that! Use the Contact page to send us your idea and we'll consider it for a future quiz.",

    // Privacy page
    "privacy.title": "Privacy Policy",
    "privacy.updated": "Last updated: June 2025",
    "privacy.s1.title": "1. Information We Collect",
    "privacy.s1.p1":
      "Al-Maarefah does not require account creation. We collect no personally identifiable information from quiz takers.",
    "privacy.s1.p2":
      "We collect anonymous, aggregated usage data — such as which quizzes are viewed or started — to improve the platform.",
    "privacy.s2.title": "2. Cookies",
    "privacy.s2.p1":
      "We use minimal cookies for analytics and to remember your quiz progress locally. We do not use tracking cookies for advertising profiling.",
    "privacy.s2.p2":
      "You can disable cookies in your browser settings at any time. Some features (like auto-saving answers) may be affected.",
    "privacy.s3.title": "3. Analytics",
    "privacy.s3.p1":
      "We use privacy-respecting analytics to understand how visitors use the site. This includes page views and quiz completion rates — no personal data is collected.",
    "privacy.s4.title": "4. Google AdSense",
    "privacy.s4.p1":
      "Al-Maarefah may display advertisements served by Google AdSense. Google may use cookies to show relevant ads based on your browsing history. You can opt out via Google's Ad Settings.",
    "privacy.s5.title": "5. Third-Party Services",
    "privacy.s5.p1":
      "We use Firebase (Google) for our backend infrastructure. Firebase may process anonymized usage data in accordance with Google's Privacy Policy.",
    "privacy.s6.title": "6. Children's Privacy",
    "privacy.s6.p1":
      "Al-Maarefah is not directed at children under 13. We do not knowingly collect data from children.",
    "privacy.s7.title": "7. Changes to This Policy",
    "privacy.s7.p1":
      "We may update this policy periodically. Changes will be posted on this page with an updated date.",
    "privacy.s8.title": "8. Contact",
    "privacy.s8.p1": "Questions about this policy? Email us at",

    // Terms page
    "terms.title": "Terms & Conditions",
    "terms.updated": "Last updated: June 2025",
    "terms.s1.title": "1. Acceptance of Terms",
    "terms.s1.p1":
      "By accessing or using Al-Maarefah, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the platform.",
    "terms.s2.title": "2. Use of the Platform",
    "terms.s2.p1":
      "Al-Maarefah is provided for entertainment and personal insight purposes only. You agree to use it only for lawful purposes and in a manner that does not infringe the rights of others.",
    "terms.s2.p2":
      "You must not attempt to scrape, copy, reproduce, or distribute our quiz content without written permission.",
    "terms.s3.title": "3. Content Ownership",
    "terms.s3.p1":
      "All quiz content, including questions, results, and design, is the intellectual property of Al-Maarefah. Results generated are for personal, non-commercial use.",
    "terms.s3.p2":
      "When you share a result, you grant us a non-exclusive license to display that shared content.",
    "terms.s4.title": "4. Disclaimer",
    "terms.s4.p1":
      "Al-Maarefah quizzes are for entertainment and self-reflection only. They are not a substitute for professional psychological, medical, or career advice.",
    "terms.s4.p2":
      "Results are indicative and not scientifically validated clinical assessments.",
    "terms.s5.title": "5. Limitation of Liability",
    "terms.s5.p1":
      "Al-Maarefah is provided \"as is\" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.",
    "terms.s6.title": "6. Changes to Terms",
    "terms.s6.p1":
      "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.",
    "terms.s7.title": "7. Contact",
    "terms.s7.p1": "Questions? Email",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.explore": "استكشاف",
    "nav.categories": "الفئات",
    "nav.search": "بحث",
    "nav.about": "عن",
    "nav.contact": "اتصل",
    "nav.articles": "المقالات",
    "nav.toggle_menu": "فتح القائمة",

    // Hero
    "hero.badge": "100% مجاني · لا يتطلب تسجيل",
    "hero.title": "اكتشف من أنت حقاً",
    "hero.subtitle":
      "اختبارات شخصية فيروسية واختبارات ذكاء وتقييمات مهنية - أجب على أي اختبار على الفور وشارك النتائج مع الأصدقاء.",
    "hero.cta_explore": "استكشف الاختبارات",
    "hero.cta_categories": "تصفح الفئات",

    // Home
    "home.trending": "🔥 الاختبارات الرائجة",
    "home.browse_category": "📂 تصفح حسب الفئة",
    "home.popular_week": "الأكثر شهرة هذا الأسبوع",
    "home.cta.badge": "جاهز لاكتشاف نفسك؟",
    "home.cta.title": "ابدأ اختباراً الآن — مجاناً بالكامل",
    "home.cta.description":
      "لا تحتاج إلى حساب. ابدأ أي اختبار فوراً وشارك نتيجتك مع الأصدقاء.",
    "home.cta.explore_all": "استكشف كل الاختبارات",
    "home.category.personality": "الشخصية",
    "home.category.iq": "اختبارات الذكاء",
    "home.category.mental_age": "العمر العقلي",
    "home.category.career": "المسار المهني",
    "home.category.relationship": "العلاقات",
    "home.category.anime": "الأنمي",
    "home.category.entertainment": "الترفيه",
    "home.category.color": "اختبارات الألوان",

    // Buttons
    "btn.start": "ابدأ الاختبار",
    "btn.next": "التالي",
    "btn.previous": "السابق",
    "btn.submit": "إرسال",
    "btn.share": "مشاركة",
    "btn.download": "تحميل",
    "btn.copy": "نسخ",
    "btn.view_all": "عرض الكل",
    "lang.switch_to_ar": "العربية",
    "lang.switch_to_en": "English",
    "a11y.skip_content": "تخطي إلى المحتوى",

    // Quiz
    "quiz.trending": "الاختبارات الرائجة",
    "quiz.popular": "الاختبارات الشهيرة",
    "quiz.new": "اختبارات جديدة",
    "quiz.featured": "اختبارات مميزة",
    "quiz.related": "اختبارات ذات صلة",
    "quiz.suggested": "جرب اختبار آخر",

    // Admin
    "admin.dashboard": "لوحة تحكم المسؤول",
    "admin.login": "دخول المسؤول",
    "admin.logout": "تسجيل الخروج",
    "admin.quizzes": "إدارة الاختبارات",
    "admin.categories": "الفئات",
    "admin.media": "مكتبة الوسائط",
    "admin.analytics": "التحليلات",
    "admin.articles": "إدارة المقالات",
    "admin.settings": "الإعدادات",
    "admin.overview": "نظرة عامة",
    "admin.area": "منطقة الإدارة",
    "admin.console": "لوحة المعرفة",
    "admin.secure_workspace": "مساحة عمل آمنة",
    "admin.secure_note": "مساحة مخصصة للمشرفين فقط.",
    "admin.welcome": "مرحبًا بعودتك! هذه نظرة عامة على منصة الاختبارات.",
    "admin.go_home": "العودة للصفحة الرئيسية",
    "admin.quick_actions": "إجراءات سريعة",
    "admin.recent_activity": "النشاط الأخير",
    "admin.stats.total_quizzes": "إجمالي الاختبارات",
    "admin.stats.published_quizzes": "الاختبارات المنشورة",
    "admin.stats.quiz_completions": "إكمال الاختبارات",
    "admin.stats.categories": "الفئات",
    "admin.action.create_quiz": "إنشاء اختبار",
    "admin.action.manage_quizzes": "إدارة الاختبارات",
    "admin.action.categories": "الفئات",
    "admin.action.media_library": "مكتبة الوسائط",
    "admin.action.analytics": "التحليلات",
    "admin.action.settings": "الإعدادات",
    "admin.common.cancel": "إلغاء",
    "admin.categories.page_title": "إدارة الفئات",
    "admin.categories.page_subtitle": "أنشئ فئات الاختبارات وقم بإدارتها",
    "admin.categories.new": "فئة جديدة",
    "admin.categories.edit_title": "تعديل الفئة",
    "admin.categories.create_title": "إنشاء فئة جديدة",
    "admin.categories.name_label": "الاسم *",
    "admin.categories.name_placeholder": "اسم الفئة",
    "admin.categories.slug_label": "المعرف",
    "admin.categories.slug_placeholder": "category-slug (يُنشأ تلقائيًا إذا تُرك فارغًا)",
    "admin.categories.icon_label": "الأيقونة",
    "admin.categories.color_label": "اللون",
    "admin.categories.description_label": "الوصف *",
    "admin.categories.description_placeholder": "وصف الفئة",
    "admin.categories.create": "إنشاء الفئة",
    "admin.categories.update": "تحديث الفئة",
    "admin.categories.name_desc_required": "الاسم والوصف مطلوبان",
    "admin.categories.created": "تم إنشاء الفئة بنجاح",
    "admin.categories.updated": "تم تحديث الفئة بنجاح",
    "admin.categories.deleted": "تم حذف الفئة بنجاح",
    "admin.categories.delete_confirm": "هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.",
    "admin.settings.page_title": "إعدادات الموقع",
    "admin.settings.page_subtitle": "خصّص مظهر الموقع والهوية البصرية",
    "admin.settings.color_scheme": "نظام الألوان",
    "admin.settings.primary_color": "اللون الأساسي",
    "admin.settings.accent_color": "لون التمييز",
    "admin.settings.preview": "معاينة",
    "admin.settings.branding": "الهوية البصرية",
    "admin.settings.website_logo": "شعار الموقع",
    "admin.settings.upload_logo": "رفع الشعار",
    "admin.settings.favicon": "أيقونة الموقع",
    "admin.settings.upload_favicon": "رفع أيقونة الموقع",
    "admin.settings.reset": "إعادة للوضع الافتراضي",
    "admin.settings.save_changes": "حفظ التغييرات",
    "admin.settings.saving": "جاري الحفظ...",
    "admin.settings.saved": "تم حفظ الإعدادات بنجاح",
    "admin.settings.save_failed": "فشل حفظ الإعدادات",
    "admin.settings.logo_updated": "تم تحديث الشعار بنجاح",
    "admin.settings.logo_upload_failed": "فشل رفع الشعار",
    "admin.settings.favicon_updated": "تم تحديث أيقونة الموقع بنجاح",
    "admin.settings.favicon_upload_failed": "فشل رفع أيقونة الموقع",
    "admin.media.page_title": "مكتبة الوسائط",
    "admin.media.page_subtitle": "إدارة وتنظيم الصور والفيديوهات",
    "admin.media.upload_files": "رفع الملفات",
    "admin.media.upload_hint": "اسحب وأفلت الصور والفيديوهات هنا، أو اضغط للاختيار",
    "admin.media.uploading": "جاري الرفع...",
    "admin.media.select_files": "اختيار الملفات",
    "admin.media.max_size": "أقصى حجم للملف: 50MB",
    "admin.media.total_files": "إجمالي الملفات",
    "admin.media.images": "الصور",
    "admin.media.total_size": "إجمالي الحجم",
    "admin.media.no_files": "لا توجد ملفات مرفوعة بعد",
    "admin.media.copy_url": "نسخ الرابط",
    "admin.media.download": "تنزيل",
    "admin.media.delete": "حذف",
    "admin.media.upload_success": "تم رفع الملفات بنجاح",
    "admin.media.file_deleted": "تم حذف الملف",
    "admin.media.url_copied": "تم نسخ الرابط",
    "admin.media.delete_confirm": "حذف هذا الملف؟",
    "admin.activity.quiz_created": "تم إنشاء اختبار",
    "admin.activity.quiz_published": "تم نشر اختبار",
    "admin.activity.category_added": "تمت إضافة فئة",
    "admin.activity.item1": "اختبار لون الشخصية",
    "admin.activity.item2": "اختبار الذكاء",
    "admin.activity.item3": "اختبارات المسار المهني",
    "admin.activity.time1": "منذ ساعتين",
    "admin.activity.time2": "منذ يوم",
    "admin.activity.time3": "منذ 3 أيام",

    // Articles
    "articles.title": "المقالات",
    "articles.latest": "أحدث المقالات",
    "articles.read_more": "اقرأ المزيد",
    "articles.published": "منشور",
    "articles.subtitle":
      "اكتشف مقالات ونصائح حول الشخصية وعلم النفس وتطوير الذات",
    "articles.search_placeholder": "ابحث في المقالات...",
    "articles.filter_all": "الكل",
    "articles.no_results": "لم يتم العثور على مقالات مطابقة",
    "articles.views_suffix": "مشاهدة",

    // Explore
    "explore.title": "استكشف كل الاختبارات",
    "explore.subtitle": "اختبارًا عبر فئات متعددة — اختر اختبارك التالي.",
    "explore.search_placeholder": "ابحث عن اختبار…",
    "explore.filter_all": "الكل",
    "explore.results_suffix": "نتيجة",
    "explore.none_title": "لم يتم العثور على اختبارات",
    "explore.none_subtitle": "جرّب كلمات مختلفة أو فئة أخرى",
    "explore.clear_filters": "مسح الفلاتر",
    "explore.found_suffix": "اختبار متاح",
    "explore.sort.trending": "🔥 الرائج",
    "explore.sort.popular": "⭐ الأشهر",
    "explore.sort.newest": "🆕 الأحدث",
    "explore.sort.fastest": "⚡ الأسرع",

    // Categories
    "categories.title": "فئات الاختبارات",
    "categories.subtitle": "استكشف الفئات واختر الاختبارات المناسبة لاهتماماتك.",
    "categories.count_suffix": "اختبار",
    "categories.cta.title": "محتار؟ ابدأ بالاختبار الأكثر شهرة.",
    "categories.cta.button": "🔥 اختبار الشخصية المظلمة",
    "categories.personality": "الشخصية",
    "categories.iq": "اختبارات الذكاء",
    "categories.mental-age": "العمر العقلي",
    "categories.career": "المسار المهني",
    "categories.relationship": "العلاقات",
    "categories.friendship": "الصداقة",
    "categories.stress": "الضغط النفسي",
    "categories.memory": "الذاكرة",
    "categories.entertainment": "الترفيه",
    "categories.anime": "الأنمي",
    "categories.color": "شخصية الألوان",
    "categories.knowledge": "المعرفة العامة",
    "categories.desc.personality":
      "اكتشف سماتك ونقاط قوتك وطريقة تفكيرك.",
    "categories.desc.iq": "تحدَّ قدراتك في التحليل وحل المشكلات.",
    "categories.desc.mental-age":
      "اكتشف العمر العقلي الحقيقي لطريقة تفكيرك.",
    "categories.desc.career":
      "تعرف على المسارات المهنية المناسبة لقدراتك.",
    "categories.desc.relationship":
      "اكتشف أسلوبك في الحب والعلاقات.",
    "categories.desc.friendship": "تعرّف على نوع الصديق الذي تمثله.",
    "categories.desc.stress":
      "قِس مستوى التوتر لديك واحصل على نصائح مناسبة.",
    "categories.desc.memory":
      "اختبر ودرّب ذاكرتك قصيرة وطويلة المدى.",
    "categories.desc.entertainment":
      "اختبارات ترفيهية ممتعة في الثقافة الشعبية.",
    "categories.desc.anime":
      "أي شخصية أنمي تشبهك أكثر؟",
    "categories.desc.color":
      "اكتشف ما تقوله ألوانك المفضلة عن شخصيتك.",
    "categories.desc.knowledge":
      "اختبر معلوماتك العامة في مواضيع متعددة.",

    // Search page
    "search.title": "البحث عن الاختبارات",
    "search.subtitle": "اعثر على الاختبار المناسب من مكتبتنا",
    "search.placeholder": "اكتب للبحث…",
    "search.popular": "عمليات البحث الشائعة",
    "search.results_for": "نتيجة لـ",
    "search.none_title": "لا توجد نتائج",
    "search.none_subtitle": "جرّب كلمات مختلفة أو تصفح الفئات",
    "search.browse_categories": "تصفح كل الفئات",
    "search.trending_now": "🔥 الرائج الآن",
    "search.view_all": "عرض كل الاختبارات",
    "search.filter_by_category": "التصفية حسب الفئة",

    // Quiz detail
    "quizDetail.back": "رجوع",
    "quizDetail.notFound.title": "الاختبار غير موجود",
    "quizDetail.notFound.subtitle": "هذا الاختبار غير متوفر أو تمت إزالته.",
    "quizDetail.notFound.cta": "تصفح كل الاختبارات",
    "quizDetail.questions": "سؤال",
    "quizDetail.minutes": "دقيقة",
    "quizDetail.min": "د",
    "quizDetail.taken": "إكمال",
    "quizDetail.related": "اختبارات مشابهة",
    "quizDetail.ready": "مستعد للبدء؟",
    "quizDetail.startQuiz": "ابدأ الاختبار",
    "quizDetail.freeNote": "مجاني · بدون حساب · نتائج فورية",
    "quizDetail.share": "مشاركة الاختبار",
    "quizDetail.shareCopied": "تم نسخ الرابط!",
    "quizDetail.category": "الفئة",
    "quizDetail.difficulty": "المستوى",
    "quizDetail.type": "النوع",
    "quizDetail.difficulty.easy": "سهل",
    "quizDetail.difficulty.medium": "متوسط",
    "quizDetail.difficulty.hard": "صعب",
    "quizDetail.type.weighted_personality": "شخصية موزونة",
    "quizDetail.type.personality_based": "مبني على الشخصية",
    "quizDetail.type.score_based": "نقاط",
    "quizDetail.type.percentage_matching": "مطابقة بالنسب",
    "quizDetail.type.standard": "قياسي",
    "quiz.seed.dark.title": "ما مدى ظلام شخصيتك؟",
    "quiz.seed.dark.description":
      "استكشف الجانب المظلم من شخصيتك بطريقة ممتعة وآمنة.",

    // Settings
    "settings.theme": "إعدادات المظهر",
    "settings.colors": "ألوان الموقع",
    "settings.logo": "الشعار",
    "settings.save": "حفظ التغييرات",

    // Footer
    "footer.company": "الشركة",
    "footer.categories": "الفئات",
    "footer.product": "المنتج",
    "footer.legal": "قانوني",
    "footer.description":
      "اكتشف نفسك عبر اختبارات شخصية ممتعة ودقيقة وتفاعلية.",
    "footer.all_categories": "كل الفئات",
    "footer.personality": "الشخصية",
    "footer.iq_tests": "اختبارات الذكاء",
    "footer.career": "المسار المهني",
    "footer.entertainment": "الترفيه",
    "footer.about_us": "من نحن",
    "footer.contact": "اتصل بنا",
    "footer.faq": "الأسئلة الشائعة",
    "footer.privacy_policy": "سياسة الخصوصية",
    "footer.terms": "الشروط والأحكام",
    "footer.made_with": "صُنع بـ ❤️ للعقول الفضولية",
    "footer.rights_only": "جميع الحقوق محفوظة.",
    "footer.copyright": "© 2026 Al-Maarefah. جميع الحقوق محفوظة.",

    // About page
    "about.title": "عن المعرفة",
    "about.subtitle":
      "المعرفة منصة اختبارات فيروسية للعقول الفضولية. نؤمن أن اكتشاف الذات يجب أن يكون ممتعًا وسريعًا ومجانيًا — بدون إنشاء حساب.",
    "about.value.speed.title": "السرعة أولًا",
    "about.value.speed.body":
      "كل اختبار يفتح فورًا وتظهر النتيجة مباشرة بعد الانتهاء.",
    "about.value.accuracy.title": "الدقة مهمة",
    "about.value.accuracy.body":
      "اختباراتنا مبنية بعناية لتقديم نتائج مفيدة وموثوقة.",
    "about.value.free.title": "مجانًا دائمًا",
    "about.value.free.body":
      "لا جدار دفع، لا تسجيل، ولا حيل. المعرفة مجاني للجميع دائمًا.",
    "about.mission.title": "مهمتنا",
    "about.mission.p1":
      "أنشأنا المعرفة لأن اختبارات الشخصية والذكاء كانت غالبًا خلف اشتراكات وتسجيل بريد وتطبيقات مزعجة. أردنا تجربة مختلفة: تدخل الموقع، تجيب الاختبار، تحصل على النتيجة، وتشاركها — خلال دقائق.",
    "about.mission.p2":
      "كل اختبار في المعرفة يُصنع بعناية: بحث، كتابة، وتجربة استخدام عالية. نحن نبني منصة الاختبارات التي تمنينا استخدامها دائمًا.",

    // Contact page
    "contact.title": "اتصل بنا",
    "contact.subtitle": "هل لديك سؤال أو اقتراح أو تريد فقط إلقاء التحية؟",
    "contact.email_title": "راسلنا عبر البريد",
    "contact.sent.title": "تم إرسال الرسالة!",
    "contact.sent.subtitle": "سنرد عليك خلال 24–48 ساعة.",
    "contact.sent.another": "إرسال رسالة أخرى",
    "contact.form.name": "الاسم",
    "contact.form.email": "البريد الإلكتروني",
    "contact.form.subject": "الموضوع",
    "contact.form.message": "الرسالة",
    "contact.form.name_placeholder": "اسمك",
    "contact.form.email_placeholder": "you@example.com",
    "contact.form.subject_placeholder": "عن ماذا الرسالة؟",
    "contact.form.message_placeholder": "اكتب رسالتك هنا…",
    "contact.form.submit": "إرسال الرسالة",

    // FAQ page
    "faq.title": "الأسئلة الشائعة",
    "faq.subtitle": "كل ما تحتاج معرفته عن المعرفة.",
    "faq.q1": "هل كل الاختبارات مجانية؟",
    "faq.a1":
      "نعم! كل الاختبارات في المعرفة مجانية 100٪. بدون اشتراكات أو رسوم مخفية أو جدار دفع.",
    "faq.q2": "هل أحتاج إلى إنشاء حساب؟",
    "faq.a2":
      "أبدًا. يمكنك البدء بأي اختبار فورًا بدون تسجيل.",
    "faq.q3": "هل النتائج دقيقة؟",
    "faq.a3":
      "نبني اختباراتنا بعناية وتستند إلى أطر نفسية معروفة. لكنها مخصصة للمتعة والتأمل الذاتي وليست تشخيصًا طبيًا.",
    "faq.q4": "هل يمكنني مشاركة نتيجتي؟",
    "faq.a4":
      "نعم! صفحة النتيجة تحتوي أزرار مشاركة ومن خيار نسخ الرابط.",
    "faq.q5": "كم مرة تضيفون اختبارات جديدة؟",
    "faq.a5":
      "نضيف اختبارات جديدة بشكل مستمر — غالبًا عدة اختبارات أسبوعيًا.",
    "faq.q6": "هل بياناتي خاصة؟",
    "faq.a6":
      "لا نجمع بيانات شخصية، فقط إحصاءات استخدام مجهولة لتحسين المنصة. ولا نبيع بياناتك أبدًا.",
    "faq.q7": "هل يمكنني اقتراح فكرة اختبار؟",
    "faq.a7":
      "أكيد! استخدم صفحة التواصل وأرسل فكرتك وسنأخذها بعين الاعتبار.",

    // Privacy page
    "privacy.title": "سياسة الخصوصية",
    "privacy.updated": "آخر تحديث: يونيو 2025",
    "privacy.s1.title": "1. المعلومات التي نجمعها",
    "privacy.s1.p1":
      "المعرفة لا يتطلب إنشاء حساب. نحن لا نجمع بيانات تعريف شخصية من المستخدمين.",
    "privacy.s1.p2":
      "نجمع بيانات استخدام مجهولة ومجمعة — مثل الاختبارات التي تمت مشاهدتها أو البدء بها — لتحسين المنصة.",
    "privacy.s2.title": "2. ملفات تعريف الارتباط",
    "privacy.s2.p1":
      "نستخدم ملفات تعريف ارتباط محدودة للتحليلات وحفظ التقدم محليًا. لا نستخدم ملفات تتبع للإعلانات السلوكية.",
    "privacy.s2.p2":
      "يمكنك تعطيل الكوكيز من إعدادات المتصفح في أي وقت. بعض الميزات مثل الحفظ التلقائي قد تتأثر.",
    "privacy.s3.title": "3. التحليلات",
    "privacy.s3.p1":
      "نستخدم تحليلات تراعي الخصوصية لفهم استخدام الموقع، مثل مشاهدات الصفحات ومعدلات إكمال الاختبارات.",
    "privacy.s4.title": "4. إعلانات Google AdSense",
    "privacy.s4.p1":
      "قد يعرض المعرفة إعلانات عبر Google AdSense. قد تستخدم Google ملفات تعريف ارتباط لعرض إعلانات مناسبة ويمكنك إيقاف ذلك من إعدادات الإعلانات لدى Google.",
    "privacy.s5.title": "5. خدمات الطرف الثالث",
    "privacy.s5.p1":
      "نستخدم Firebase (من Google) للبنية الخلفية، وقد تتم معالجة بيانات استخدام مجهولة حسب سياسة خصوصية Google.",
    "privacy.s6.title": "6. خصوصية الأطفال",
    "privacy.s6.p1":
      "المعرفة غير موجه للأطفال دون 13 عامًا، ولا نجمع بيانات منهم عمدًا.",
    "privacy.s7.title": "7. التغييرات على هذه السياسة",
    "privacy.s7.p1":
      "قد نقوم بتحديث هذه السياسة بشكل دوري، وسيتم نشر أي تعديل في هذه الصفحة مع تاريخ التحديث.",
    "privacy.s8.title": "8. التواصل",
    "privacy.s8.p1": "للاستفسار حول هذه السياسة، راسلنا على",

    // Terms page
    "terms.title": "الشروط والأحكام",
    "terms.updated": "آخر تحديث: يونيو 2025",
    "terms.s1.title": "1. قبول الشروط",
    "terms.s1.p1":
      "باستخدامك منصة المعرفة، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا لم توافق، يرجى عدم استخدام المنصة.",
    "terms.s2.title": "2. استخدام المنصة",
    "terms.s2.p1":
      "المعرفة مخصص للترفيه وفهم الذات. يجب استخدامه بشكل قانوني ودون انتهاك حقوق الآخرين.",
    "terms.s2.p2":
      "يُمنع نسخ أو سحب أو إعادة نشر محتوى الاختبارات دون إذن كتابي.",
    "terms.s3.title": "3. ملكية المحتوى",
    "terms.s3.p1":
      "جميع محتويات الاختبارات وتصميمها ملكية فكرية للمعرفة. النتائج للاستخدام الشخصي وغير التجاري.",
    "terms.s3.p2":
      "عند مشاركة نتيجتك، تمنحنا ترخيصًا غير حصريًا لعرض المحتوى الذي تمت مشاركته.",
    "terms.s4.title": "4. إخلاء المسؤولية",
    "terms.s4.p1":
      "اختبارات المعرفة للترفيه والتأمل الذاتي فقط، ولا تعد بديلاً عن الاستشارة النفسية أو الطبية أو المهنية.",
    "terms.s4.p2":
      "النتائج استرشادية وليست تقييمات سريرية معتمدة علميًا.",
    "terms.s5.title": "5. حدود المسؤولية",
    "terms.s5.p1":
      "تُقدم منصة المعرفة كما هي دون ضمانات، ولسنا مسؤولين عن أي أضرار مباشرة أو غير مباشرة تنتج عن الاستخدام.",
    "terms.s6.title": "6. تعديل الشروط",
    "terms.s6.p1":
      "نحتفظ بحق تعديل هذه الشروط في أي وقت، ويعد استمرارك في الاستخدام موافقة على الشروط الجديدة.",
    "terms.s7.title": "7. التواصل",
    "terms.s7.p1": "للاستفسارات، راسل",
  },
};

interface LanguageStore {
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
  getDirection: () => "ltr" | "rtl";
}

export const useLanguage = create<LanguageStore>((set, get) => ({
  language: (localStorage.getItem("language") as Language) || "en",

  t: (key: string) => {
    const { language } = get();
    return translations[language][key] || translations["en"][key] || key;
  },

  setLanguage: (lang: Language) => {
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    set({ language: lang });
  },

  getDirection: () => {
    return get().language === "ar" ? "rtl" : "ltr";
  },
}));
