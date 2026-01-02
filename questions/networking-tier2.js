// Networking Tier 2: APIs & Web
// 15 Questions - REST, WebSockets, CORS, Authentication

const networkingTier2APIs = [
    // ========== SECTION 1: REST APIs ==========
    {
        id: 'net_t2_1',
        tier: 2,
        chapter: 2,
        category: 'networking',
        difficulty: 'easy',
        topic: 'REST',
        type: 'multiple-choice',
        question: 'What does REST stand for?',
        options: [
            'Remote Execution Service Transfer',
            'Representational State Transfer',
            'Request-Response Service Technology',
            'Resource Endpoint System Transfer'
        ],
        correctAnswer: 1,
        explanation: 'REST = Representational State Transfer. It\'s an architectural style using stateless operations on resources via HTTP.',
        hints: ['It\'s about transferring state', 'An architectural style, not a protocol'],
        xpReward: 10
    },
    {
        id: 'net_t2_2',
        tier: 2,
        chapter: 2,
        category: 'networking',
        difficulty: 'medium',
        topic: 'REST',
        type: 'multiple-choice',
        question: 'Which HTTP method should be used to update a specific resource?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correctAnswer: 2,
        explanation: 'PUT updates/replaces an existing resource. POST creates new resources. PATCH is for partial updates.',
        hints: ['Think: "PUT the new version"', 'Replaces the entire resource'],
        xpReward: 15
    },
    {
        id: 'net_t2_3',
        tier: 2,
        chapter: 2,
        category: 'networking',
        difficulty: 'medium',
        topic: 'REST',
        type: 'multiple-choice',
        question: 'What does "idempotent" mean for HTTP methods?',
        options: [
            'The request is encrypted',
            'Multiple identical requests have the same effect as a single request',
            'The request cannot be cached',
            'The request requires authentication'
        ],
        correctAnswer: 1,
        explanation: 'GET, PUT, DELETE are idempotent - calling them multiple times produces the same result. POST is not idempotent.',
        hints: ['Same action repeated = same result', 'POST creates new each time, so not idempotent'],
        xpReward: 20
    },
    {
        id: 'net_t2_4',
        tier: 2,
        chapter: 2,
        category: 'networking',
        difficulty: 'easy',
        topic: 'REST',
        type: 'code-typing',
        question: 'Complete the REST endpoint for getting user with ID 123',
        template: '/api/users/___',
        blanks: [
            { position: 0, correctAnswer: '123', alternatives: [] }
        ],
        explanation: 'REST URLs identify resources. /api/users/123 refers to the user with ID 123.',
        hints: ['Resource identification in the URL'],
        xpReward: 10
    },
    {
        id: 'net_t2_5',
        tier: 2,
        chapter: 2,
        category: 'networking',
        difficulty: 'medium',
        topic: 'JSON',
        type: 'output',
        question: 'What does this fetch code log?',
        code: `fetch('/api/users')
    .then(response => response.json())
    .then(data => console.log(typeof data));`,
        options: ['string', 'object', 'array', 'undefined'],
        correctAnswer: 1,
        explanation: 'response.json() parses JSON into a JavaScript object. Even arrays return "object" for typeof.',
        hints: ['.json() parses the response body', 'typeof array returns "object" in JS'],
        xpReward: 15
    },

    // ========== SECTION 2: WEBSOCKETS ==========
    {
        id: 'net_t2_6',
        tier: 2,
        chapter: 2,
        category: 'networking',
        difficulty: 'medium',
        topic: 'WebSockets',
        type: 'multiple-choice',
        question: 'What advantage do WebSockets have over HTTP?',
        options: [
            'WebSockets are more secure',
            'WebSockets enable full-duplex, persistent connections',
            'WebSockets load pages faster',
            'WebSockets use less data'
        ],
        correctAnswer: 1,
        explanation: 'WebSockets maintain a persistent connection where both client and server can send messages anytime. HTTP is request-response only.',
        hints: ['Think: real-time chat', 'Bidirectional communication'],
        xpReward: 15
    },
    {
        id: 'net_t2_7',
        tier: 2,
        chapter: 2,
        category: 'networking',
        difficulty: 'medium',
        topic: 'WebSockets',
        type: 'code-typing',
        question: 'Create a WebSocket connection to a server',
        template: `const socket = new _____('wss://example.com');`,
        blanks: [
            { position: 0, correctAnswer: 'WebSocket', alternatives: [] }
        ],
        explanation: 'WebSocket is the constructor for creating WebSocket connections. wss:// is the secure version.',
        hints: ['Same name as the protocol', 'wss:// is like https:// for WebSockets'],
        xpReward: 15
    },
    {
        id: 'net_t2_8',
        tier: 2,
        chapter: 2,
        category: 'networking',
        difficulty: 'medium',
        topic: 'WebSockets',
        type: 'multiple-choice',
        question: 'Which applications benefit most from WebSockets?',
        options: [
            'Static websites',
            'Real-time chat, live updates, multiplayer games',
            'File downloads',
            'Form submissions'
        ],
        correctAnswer: 1,
        explanation: 'WebSockets are ideal when you need real-time, bidirectional communication: chat apps, live sports scores, collaborative editing, gaming.',
        hints: ['Real-time = WebSockets', 'Anywhere updates need to push to clients'],
        xpReward: 15
    },

    // ========== SECTION 3: CORS ==========
    {
        id: 'net_t2_9',
        tier: 2,
        chapter: 2,
        category: 'networking',
        difficulty: 'medium',
        topic: 'CORS',
        type: 'multiple-choice',
        question: 'What is CORS (Cross-Origin Resource Sharing)?',
        options: [
            'A data compression method',
            'A security mechanism controlling cross-origin HTTP requests',
            'A caching strategy',
            'A load balancing technique'
        ],
        correctAnswer: 1,
        explanation: 'CORS allows servers to specify which origins can access their resources, preventing malicious cross-site requests.',
        hints: ['About security', 'Controls which websites can access your API'],
        xpReward: 15
    },
    {
        id: 'net_t2_10',
        tier: 2,
        chapter: 2,
        category: 'networking',
        difficulty: 'hard',
        topic: 'CORS',
        type: 'multiple-choice',
        question: 'What is a CORS preflight request?',
        options: [
            'A request to download files',
            'An OPTIONS request sent before certain requests to check server permissions',
            'A request to cache data',
            'A request to establish WebSocket connection'
        ],
        correctAnswer: 1,
        explanation: 'For "non-simple" requests (custom headers, PUT/DELETE), browsers first send an OPTIONS preflight to check if the server allows it.',
        hints: ['OPTIONS method', 'Browser asks permission first'],
        xpReward: 25
    },
    {
        id: 'net_t2_11',
        tier: 2,
        chapter: 2,
        category: 'networking',
        difficulty: 'medium',
        topic: 'CORS',
        type: 'multiple-choice',
        question: 'Which header allows a server to accept requests from any origin?',
        options: [
            'Access-Control-Allow-Origin: *',
            'Content-Type: any',
            'Accept-Origin: all',
            'Allow-Cross-Origin: true'
        ],
        correctAnswer: 0,
        explanation: 'Access-Control-Allow-Origin: * allows any origin. For credentials, you must specify the exact origin.',
        hints: ['Access-Control-Allow-Origin is the CORS header', '* means wildcard/any'],
        xpReward: 20
    },

    // ========== SECTION 4: AUTHENTICATION ==========
    {
        id: 'net_t2_12',
        tier: 2,
        chapter: 2,
        category: 'networking',
        difficulty: 'medium',
        topic: 'JWT',
        type: 'multiple-choice',
        question: 'What is a JWT (JSON Web Token)?',
        options: [
            'A database for JSON data',
            'A signed token containing claims for stateless authentication',
            'A JavaScript testing framework',
            'A JSON compression format'
        ],
        correctAnswer: 1,
        explanation: 'JWT is a compact, signed token containing user claims (info). The server doesn\'t need to store session data.',
        hints: ['Used for authentication', 'Contains encoded claims'],
        xpReward: 15
    },
    {
        id: 'net_t2_13',
        tier: 2,
        chapter: 2,
        category: 'networking',
        difficulty: 'medium',
        topic: 'JWT',
        type: 'multiple-choice',
        question: 'What are the three parts of a JWT?',
        options: [
            'Username, Password, Token',
            'Header, Payload, Signature',
            'ID, Type, Data',
            'Key, Value, Hash'
        ],
        correctAnswer: 1,
        explanation: 'JWT = Header (algorithm) + Payload (claims/data) + Signature (verification). Separated by dots: xxx.yyy.zzz',
        hints: ['Three parts separated by dots', 'The signature verifies authenticity'],
        xpReward: 20
    },
    {
        id: 'net_t2_14',
        tier: 2,
        chapter: 2,
        category: 'networking',
        difficulty: 'medium',
        topic: 'Authentication',
        type: 'code-typing',
        question: 'Complete the Authorization header for Bearer token',
        template: `headers: {
    Authorization: '_____ ' + token
}`,
        blanks: [
            { position: 0, correctAnswer: 'Bearer', alternatives: [] }
        ],
        explanation: 'Bearer tokens are sent in the Authorization header with "Bearer" prefix.',
        hints: ['The token "bears" authentication', 'Standard OAuth 2.0 format'],
        xpReward: 15
    },
    {
        id: 'net_t2_15',
        tier: 2,
        chapter: 2,
        category: 'networking',
        difficulty: 'hard',
        topic: 'Authentication',
        type: 'multiple-choice',
        question: 'What is the difference between authentication and authorization?',
        options: [
            'They are the same thing',
            'Authentication verifies WHO you are; Authorization verifies WHAT you can access',
            'Authentication is for APIs; Authorization is for websites',
            'Authentication uses tokens; Authorization uses passwords'
        ],
        correctAnswer: 1,
        explanation: 'Authentication = identity verification (login). Authorization = permission checking (can this user access this resource?).',
        hints: ['AuthN = who are you?', 'AuthZ = what can you do?'],
        xpReward: 20
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = networkingTier2APIs;
}
