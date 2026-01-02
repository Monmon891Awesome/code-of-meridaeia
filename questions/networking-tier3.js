// Networking Tier 3: Security & Advanced
// 15 Questions - TLS/SSL, Security, Caching, CDN

const networkingTier3Security = [
    // ========== SECTION 1: TLS/SSL ==========
    {
        id: 'net_t3_1',
        tier: 3,
        chapter: 3,
        category: 'networking',
        difficulty: 'medium',
        topic: 'TLS/SSL',
        type: 'multiple-choice',
        question: 'What does TLS provide for HTTPS?',
        options: [
            'Faster page loads',
            'Encryption, authentication, and data integrity',
            'Better SEO rankings only',
            'Compression of data'
        ],
        correctAnswer: 1,
        explanation: 'TLS provides: Encryption (privacy), Authentication (verify server identity via certificates), Integrity (detect tampering).',
        hints: ['The "S" in HTTPS', 'Protects data in transit'],
        xpReward: 15
    },
    {
        id: 'net_t3_2',
        tier: 3,
        chapter: 3,
        category: 'networking',
        difficulty: 'hard',
        topic: 'TLS Handshake',
        type: 'multiple-choice',
        question: 'What happens during a TLS handshake?',
        options: [
            'Files are downloaded',
            'Client and server agree on encryption methods and exchange keys',
            'User enters username and password',
            'Data is compressed'
        ],
        correctAnswer: 1,
        explanation: 'TLS handshake: negotiate cipher suite, verify server certificate, exchange keys (using asymmetric crypto), then switch to symmetric encryption.',
        hints: ['Establishes the secure connection', 'Before any application data is sent'],
        xpReward: 25
    },
    {
        id: 'net_t3_3',
        tier: 3,
        chapter: 3,
        category: 'networking',
        difficulty: 'medium',
        topic: 'Certificates',
        type: 'multiple-choice',
        question: 'What does an SSL/TLS certificate verify?',
        options: [
            'The user\'s identity',
            'The server\'s identity and ownership of the domain',
            'The speed of the connection',
            'The type of data being sent'
        ],
        correctAnswer: 1,
        explanation: 'Certificates are issued by Certificate Authorities (CAs) to verify that a server is who it claims to be.',
        hints: ['Think: ID card for servers', 'Prevents man-in-the-middle attacks'],
        xpReward: 15
    },

    // ========== SECTION 2: WEB SECURITY ==========
    {
        id: 'net_t3_4',
        tier: 3,
        chapter: 3,
        category: 'networking',
        difficulty: 'medium',
        topic: 'Security',
        type: 'multiple-choice',
        question: 'What is XSS (Cross-Site Scripting)?',
        options: [
            'A way to style websites',
            'An attack that injects malicious scripts into web pages',
            'A cross-platform programming language',
            'A method to speed up websites'
        ],
        correctAnswer: 1,
        explanation: 'XSS attacks inject malicious JavaScript that runs in victims\' browsers. Prevent by sanitizing user input and using CSP.',
        hints: ['Script injection attack', 'Affects other users viewing the page'],
        xpReward: 20
    },
    {
        id: 'net_t3_5',
        tier: 3,
        chapter: 3,
        category: 'networking',
        difficulty: 'hard',
        topic: 'Security',
        type: 'multiple-choice',
        question: 'What is a CSRF (Cross-Site Request Forgery) attack?',
        options: [
            'Stealing passwords',
            'Tricking a user\'s browser into making unwanted requests to a site they\'re logged into',
            'Injecting SQL commands',
            'Intercepting network traffic'
        ],
        correctAnswer: 1,
        explanation: 'CSRF exploits the user\'s authenticated session. If logged into bank, malicious site can make requests to bank on your behalf.',
        hints: ['Uses the victim\'s session', 'Prevented by CSRF tokens'],
        xpReward: 25
    },
    {
        id: 'net_t3_6',
        tier: 3,
        chapter: 3,
        category: 'networking',
        difficulty: 'medium',
        topic: 'Security',
        type: 'multiple-choice',
        question: 'What is SQL injection?',
        options: [
            'A way to speed up database queries',
            'An attack that inserts malicious SQL through user input',
            'A database backup method',
            'A SQL optimization technique'
        ],
        correctAnswer: 1,
        explanation: 'SQL injection occurs when user input is directly included in SQL queries. Prevent with parameterized queries/prepared statements.',
        hints: ['Input manipulation attack', 'Famous attack: \'; DROP TABLE users; --'],
        xpReward: 20
    },
    {
        id: 'net_t3_7',
        tier: 3,
        chapter: 3,
        category: 'networking',
        difficulty: 'medium',
        topic: 'Security Headers',
        type: 'multiple-choice',
        question: 'What does the Content-Security-Policy (CSP) header do?',
        options: [
            'Compresses content',
            'Specifies allowed sources for scripts, styles, and other resources',
            'Encrypts the content',
            'Caches the content'
        ],
        correctAnswer: 1,
        explanation: 'CSP tells browsers which sources are allowed for scripts, styles, images, etc. Helps prevent XSS attacks.',
        hints: ['Whitelist approach to security', 'Controls what can run on your page'],
        xpReward: 20
    },

    // ========== SECTION 3: CACHING ==========
    {
        id: 'net_t3_8',
        tier: 3,
        chapter: 3,
        category: 'networking',
        difficulty: 'medium',
        topic: 'Caching',
        type: 'multiple-choice',
        question: 'What does the Cache-Control: max-age=3600 header mean?',
        options: [
            'The file is 3600 bytes',
            'The browser can cache this resource for 3600 seconds',
            'The server took 3600ms to respond',
            'The file was created 3600 seconds ago'
        ],
        correctAnswer: 1,
        explanation: 'max-age specifies how long (in seconds) the browser can cache the resource without checking with the server.',
        hints: ['3600 seconds = 1 hour', 'Reduces server requests'],
        xpReward: 15
    },
    {
        id: 'net_t3_9',
        tier: 3,
        chapter: 3,
        category: 'networking',
        difficulty: 'hard',
        topic: 'Caching',
        type: 'multiple-choice',
        question: 'What is the purpose of an ETag header?',
        options: [
            'To track users',
            'To provide a unique identifier for a specific version of a resource',
            'To encrypt the data',
            'To compress the response'
        ],
        correctAnswer: 1,
        explanation: 'ETag is a fingerprint of a resource version. The browser can send If-None-Match to check if it changed, getting 304 Not Modified if unchanged.',
        hints: ['Used for conditional requests', 'Like a version number'],
        xpReward: 25
    },
    {
        id: 'net_t3_10',
        tier: 3,
        chapter: 3,
        category: 'networking',
        difficulty: 'medium',
        topic: 'Caching',
        type: 'multiple-choice',
        question: 'What does HTTP status 304 mean?',
        options: [
            'Request accepted',
            'Not Modified - use cached version',
            'Redirect to another URL',
            'Server error'
        ],
        correctAnswer: 1,
        explanation: '304 Not Modified means the resource hasn\'t changed since the cached version. Browser uses its cache instead of downloading again.',
        hints: ['Part of conditional requests', 'Saves bandwidth'],
        xpReward: 15
    },

    // ========== SECTION 4: CDN & PERFORMANCE ==========
    {
        id: 'net_t3_11',
        tier: 3,
        chapter: 3,
        category: 'networking',
        difficulty: 'medium',
        topic: 'CDN',
        type: 'multiple-choice',
        question: 'What is a CDN (Content Delivery Network)?',
        options: [
            'A type of database',
            'A distributed network of servers that delivers content from locations close to users',
            'A programming framework',
            'A security scanning tool'
        ],
        correctAnswer: 1,
        explanation: 'CDNs cache content at edge servers worldwide. Users are served from the nearest location, reducing latency.',
        hints: ['Distributed geographically', 'Reduces latency by proximity'],
        xpReward: 15
    },
    {
        id: 'net_t3_12',
        tier: 3,
        chapter: 3,
        category: 'networking',
        difficulty: 'medium',
        topic: 'Performance',
        type: 'multiple-choice',
        question: 'What is the benefit of HTTP/2 over HTTP/1.1?',
        options: [
            'HTTP/2 is more secure',
            'HTTP/2 uses multiplexing to send multiple requests over one connection',
            'HTTP/2 uses less encryption',
            'HTTP/2 only works with WebSockets'
        ],
        correctAnswer: 1,
        explanation: 'HTTP/2 uses multiplexing (multiple streams on one connection), header compression, and server push for better performance.',
        hints: ['Solves head-of-line blocking', 'Binary protocol vs HTTP/1.1\'s text'],
        xpReward: 20
    },
    {
        id: 'net_t3_13',
        tier: 3,
        chapter: 3,
        category: 'networking',
        difficulty: 'hard',
        topic: 'Performance',
        type: 'multiple-choice',
        question: 'What is TTFB (Time To First Byte)?',
        options: [
            'Total time to download a file',
            'Time from request until the first byte of response is received',
            'Time to render the page',
            'Time to execute JavaScript'
        ],
        correctAnswer: 1,
        explanation: 'TTFB measures server responsiveness - how long until the server starts sending data. High TTFB indicates server-side issues.',
        hints: ['A key performance metric', 'Measures server speed, not download speed'],
        xpReward: 25
    },
    {
        id: 'net_t3_14',
        tier: 3,
        chapter: 3,
        category: 'networking',
        difficulty: 'medium',
        topic: 'Load Balancing',
        type: 'multiple-choice',
        question: 'What is the purpose of a load balancer?',
        options: [
            'To compress files',
            'To distribute incoming requests across multiple servers',
            'To cache static assets',
            'To encrypt traffic'
        ],
        correctAnswer: 1,
        explanation: 'Load balancers distribute traffic across servers to prevent overloading any single server and provide redundancy.',
        hints: ['Distributes the "load"', 'Enables horizontal scaling'],
        xpReward: 15
    },
    {
        id: 'net_t3_15',
        tier: 3,
        chapter: 3,
        category: 'networking',
        difficulty: 'hard',
        topic: 'Rate Limiting',
        type: 'multiple-choice',
        question: 'What HTTP status code indicates rate limiting?',
        options: [
            '403 Forbidden',
            '404 Not Found',
            '429 Too Many Requests',
            '503 Service Unavailable'
        ],
        correctAnswer: 2,
        explanation: '429 Too Many Requests means the client has exceeded the rate limit. Usually includes Retry-After header.',
        hints: ['Related to request frequency', 'Client made too many requests'],
        xpReward: 20
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = networkingTier3Security;
}
