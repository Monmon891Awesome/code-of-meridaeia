// Networking Questions - Learn networking fundamentals
const networkingQuestions = [
    {
        id: 'net_1',
        category: 'networking',
        difficulty: 'easy',
        type: 'concept',
        question: 'Which HTTP method is typically used to retrieve data from a server?',
        code: null,
        options: [
            'POST',
            'GET',
            'PUT',
            'DELETE'
        ],
        correctAnswer: 1,
        explanation: 'GET is used to retrieve/read data. POST creates new resources, PUT updates existing resources, DELETE removes resources. These form the CRUD operations.'
    },
    {
        id: 'net_2',
        category: 'networking',
        difficulty: 'medium',
        type: 'concept',
        question: 'What does the HTTP status code 403 mean?',
        code: null,
        options: [
            'Not Found - resource doesn\'t exist',
            'Forbidden - server refuses to authorize the request',
            'Bad Request - malformed request syntax',
            'Internal Server Error'
        ],
        correctAnswer: 1,
        explanation: '403 Forbidden means the server understood the request but refuses to authorize it. Unlike 401 (Unauthorized), re-authenticating won\'t help. 404 is Not Found, 400 is Bad Request, 500 is Server Error.'
    },
    {
        id: 'net_3',
        category: 'networking',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is the main difference between TCP and UDP?',
        code: null,
        options: [
            'TCP is faster than UDP',
            'TCP guarantees delivery and order; UDP is faster but unreliable',
            'UDP is more secure than TCP',
            'TCP is used for video streaming, UDP for web browsing'
        ],
        correctAnswer: 1,
        explanation: 'TCP is connection-oriented with guaranteed delivery, ordering, and error checking. UDP is connectionless, faster, but doesn\'t guarantee delivery - used for streaming, gaming, DNS.'
    },
    {
        id: 'net_4',
        category: 'networking',
        difficulty: 'hard',
        type: 'concept',
        question: 'In the OSI model, which layer handles end-to-end communication and flow control?',
        code: null,
        options: [
            'Network Layer (Layer 3)',
            'Transport Layer (Layer 4)',
            'Session Layer (Layer 5)',
            'Data Link Layer (Layer 2)'
        ],
        correctAnswer: 1,
        explanation: 'Transport Layer (Layer 4) handles end-to-end communication, flow control, and error recovery. This is where TCP and UDP operate.'
    },
    {
        id: 'net_5',
        category: 'networking',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is a WebSocket and why is it used?',
        code: null,
        options: [
            'A secure version of HTTP',
            'A protocol for full-duplex, persistent connections between client and server',
            'A type of database connection',
            'A JavaScript library for HTTP requests'
        ],
        correctAnswer: 1,
        explanation: 'WebSocket enables bidirectional, full-duplex communication over a single TCP connection. Unlike HTTP request-response, both sides can send messages anytime - ideal for chat, gaming, live updates.'
    },
    {
        id: 'net_6',
        category: 'networking',
        difficulty: 'easy',
        type: 'concept',
        question: 'What does REST stand for in REST API?',
        code: null,
        options: [
            'Remote Execution Service Transfer',
            'Representational State Transfer',
            'Request-Response Service Technology',
            'Resource Endpoint System Transfer'
        ],
        correctAnswer: 1,
        explanation: 'REST = Representational State Transfer. It\'s an architectural style using stateless operations on resources identified by URLs, typically using HTTP methods (GET, POST, PUT, DELETE).'
    },
    {
        id: 'net_7',
        category: 'networking',
        difficulty: 'medium',
        type: 'output',
        question: 'What does this JavaScript fetch call return?',
        code: `fetch('https://api.example.com/users')
    .then(response => response.json())
    .then(data => console.log(typeof data));`,
        options: [
            'string',
            'object',
            'undefined',
            'Promise'
        ],
        correctAnswer: 1,
        explanation: 'response.json() parses the JSON response body into a JavaScript object. Arrays are also objects in JavaScript, so typeof returns "object".'
    },
    {
        id: 'net_8',
        category: 'networking',
        difficulty: 'hard',
        type: 'concept',
        question: 'What is the purpose of CORS (Cross-Origin Resource Sharing)?',
        code: null,
        options: [
            'Encrypting data in transit',
            'Allowing or blocking cross-origin HTTP requests for security',
            'Compressing network traffic',
            'Load balancing across servers'
        ],
        correctAnswer: 1,
        explanation: 'CORS is a security mechanism that allows servers to specify which origins can access their resources. Browsers enforce CORS to prevent malicious cross-site requests.'
    },
    {
        id: 'net_9',
        category: 'networking',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is the difference between HTTP and HTTPS?',
        code: null,
        options: [
            'HTTPS is faster than HTTP',
            'HTTPS encrypts data using TLS/SSL; HTTP sends data in plain text',
            'HTTP supports more features',
            'HTTPS is only for banking websites'
        ],
        correctAnswer: 1,
        explanation: 'HTTPS = HTTP + TLS/SSL encryption. Data is encrypted in transit, preventing eavesdropping and tampering. Modern best practice is HTTPS for all websites.'
    },
    {
        id: 'net_10',
        category: 'networking',
        difficulty: 'hard',
        type: 'concept',
        question: 'What is the purpose of DNS?',
        code: null,
        options: [
            'Encrypting domain traffic',
            'Translating domain names to IP addresses',
            'Storing website files',
            'Authenticating users'
        ],
        correctAnswer: 1,
        explanation: 'DNS (Domain Name System) translates human-readable domain names (google.com) to IP addresses (142.250.xxx.xxx) that computers use to identify each other on the network.'
    },
    {
        id: 'net_11',
        category: 'networking',
        difficulty: 'medium',
        type: 'concept',
        question: 'In a RESTful API, what is the purpose of the PUT method?',
        code: null,
        options: [
            'Create a new resource',
            'Update/replace an existing resource',
            'Delete a resource',
            'Retrieve a resource'
        ],
        correctAnswer: 1,
        explanation: 'PUT is used to update or replace an existing resource entirely. PATCH is for partial updates. PUT is idempotent - multiple identical requests have the same effect as one.'
    },
    {
        id: 'net_12',
        category: 'networking',
        difficulty: 'hard',
        type: 'concept',
        question: 'What is a JWT (JSON Web Token) typically used for?',
        code: null,
        options: [
            'Encrypting database connections',
            'Stateless authentication - containing user claims in a signed token',
            'Compressing JSON data',
            'Formatting API responses'
        ],
        correctAnswer: 1,
        explanation: 'JWT is a compact, URL-safe token containing claims (user info, permissions). It\'s signed to prevent tampering and commonly used for stateless authentication where the server doesn\'t need to store sessions.'
    }
];
