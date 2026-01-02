// Networking Tier 1: Foundations
// 15 Questions - HTTP, TCP/IP, OSI Model

const networkingTier1Foundations = [
    // ========== SECTION 1: HTTP BASICS ==========
    {
        id: 'net_t1_1',
        tier: 1,
        chapter: 1,
        category: 'networking',
        difficulty: 'easy',
        topic: 'HTTP Methods',
        type: 'multiple-choice',
        question: 'Which HTTP method is used to retrieve data from a server?',
        options: ['POST', 'GET', 'PUT', 'DELETE'],
        correctAnswer: 1,
        explanation: 'GET retrieves data. POST creates, PUT updates, DELETE removes. These form the CRUD operations.',
        hints: ['Think of GET as "getting" information', 'Read-only operation'],
        xpReward: 10
    },
    {
        id: 'net_t1_2',
        tier: 1,
        chapter: 1,
        category: 'networking',
        difficulty: 'easy',
        topic: 'HTTP Methods',
        type: 'code-typing',
        question: 'Complete the fetch request to get data',
        template: `fetch('/api/users', {
    method: '___'
})`,
        blanks: [
            { position: 0, correctAnswer: 'GET', alternatives: [] }
        ],
        explanation: 'GET is the default method for fetch, but specifying it explicitly is good practice.',
        hints: ['What method retrieves data?'],
        xpReward: 15
    },
    {
        id: 'net_t1_3',
        tier: 1,
        chapter: 1,
        category: 'networking',
        difficulty: 'medium',
        topic: 'HTTP Status Codes',
        type: 'multiple-choice',
        question: 'What does HTTP status code 404 mean?',
        options: [
            'Request was successful',
            'Server error occurred',
            'Resource not found',
            'Access forbidden'
        ],
        correctAnswer: 2,
        explanation: '404 = Not Found. 200 = OK. 500 = Server Error. 403 = Forbidden. The first digit indicates the category.',
        hints: ['The famous "page not found"', '4xx errors are client errors'],
        xpReward: 15
    },
    {
        id: 'net_t1_4',
        tier: 1,
        chapter: 1,
        category: 'networking',
        difficulty: 'medium',
        topic: 'HTTP Status Codes',
        type: 'multiple-choice',
        question: 'What category do 5xx status codes indicate?',
        options: [
            'Successful responses',
            'Client errors',
            'Server errors',
            'Redirects'
        ],
        correctAnswer: 2,
        explanation: '1xx = Informational, 2xx = Success, 3xx = Redirect, 4xx = Client Error, 5xx = Server Error.',
        hints: ['5xx means something went wrong on the server', '500 is Internal Server Error'],
        xpReward: 15
    },
    {
        id: 'net_t1_5',
        tier: 1,
        chapter: 1,
        category: 'networking',
        difficulty: 'easy',
        topic: 'HTTP Headers',
        type: 'multiple-choice',
        question: 'What does the Content-Type header specify?',
        options: [
            'The size of the response',
            'The format/media type of the data',
            'The server version',
            'The authentication method'
        ],
        correctAnswer: 1,
        explanation: 'Content-Type tells the client what format the data is in, like application/json, text/html, or image/png.',
        hints: ['It describes WHAT type of content is being sent'],
        xpReward: 10
    },

    // ========== SECTION 2: TCP/IP ==========
    {
        id: 'net_t1_6',
        tier: 1,
        chapter: 1,
        category: 'networking',
        difficulty: 'medium',
        topic: 'TCP vs UDP',
        type: 'multiple-choice',
        question: 'What is the main difference between TCP and UDP?',
        options: [
            'TCP is faster than UDP',
            'TCP guarantees delivery and order; UDP is faster but unreliable',
            'UDP is more secure',
            'TCP is used for video, UDP for web'
        ],
        correctAnswer: 1,
        explanation: 'TCP is reliable but slower (handshakes, acknowledgments). UDP is fast but may lose packets. Video streaming often uses UDP.',
        hints: ['TCP = reliable, UDP = fast', 'Gaming uses UDP for low latency'],
        xpReward: 15
    },
    {
        id: 'net_t1_7',
        tier: 1,
        chapter: 1,
        category: 'networking',
        difficulty: 'medium',
        topic: 'TCP Handshake',
        type: 'multiple-choice',
        question: 'What is the TCP three-way handshake?',
        options: [
            'GET, POST, DELETE',
            'SYN, SYN-ACK, ACK',
            'HELLO, CONFIRM, READY',
            'OPEN, DATA, CLOSE'
        ],
        correctAnswer: 1,
        explanation: 'Client sends SYN, server responds SYN-ACK, client sends ACK. This establishes a reliable connection.',
        hints: ['SYN = synchronize', 'ACK = acknowledge'],
        xpReward: 20
    },
    {
        id: 'net_t1_8',
        tier: 1,
        chapter: 1,
        category: 'networking',
        difficulty: 'easy',
        topic: 'Ports',
        type: 'multiple-choice',
        question: 'What port does HTTP typically use?',
        options: ['21', '22', '80', '443'],
        correctAnswer: 2,
        explanation: '80 = HTTP, 443 = HTTPS, 22 = SSH, 21 = FTP. These are well-known ports.',
        hints: ['HTTPS adds 363 to HTTP\'s port', 'Standard web port'],
        xpReward: 10
    },
    {
        id: 'net_t1_9',
        tier: 1,
        chapter: 1,
        category: 'networking',
        difficulty: 'easy',
        topic: 'Ports',
        type: 'code-typing',
        question: 'Complete the URL to use HTTPS on its default port',
        template: 'https://example.com:___/page',
        blanks: [
            { position: 0, correctAnswer: '443', alternatives: [] }
        ],
        explanation: 'HTTPS uses port 443 by default, though it\'s usually omitted in URLs.',
        hints: ['HTTPS default port'],
        xpReward: 10
    },

    // ========== SECTION 3: OSI MODEL ==========
    {
        id: 'net_t1_10',
        tier: 1,
        chapter: 1,
        category: 'networking',
        difficulty: 'medium',
        topic: 'OSI Model',
        type: 'multiple-choice',
        question: 'Which OSI layer handles end-to-end communication?',
        options: [
            'Layer 2 - Data Link',
            'Layer 3 - Network',
            'Layer 4 - Transport',
            'Layer 7 - Application'
        ],
        correctAnswer: 2,
        explanation: 'Transport Layer (4) handles end-to-end communication, error recovery, and flow control. TCP and UDP operate here.',
        hints: ['Where TCP lives', 'Between Network and Session'],
        xpReward: 15
    },
    {
        id: 'net_t1_11',
        tier: 1,
        chapter: 1,
        category: 'networking',
        difficulty: 'hard',
        topic: 'OSI Model',
        type: 'multiple-choice',
        question: 'What is the order of OSI layers from bottom to top?',
        options: [
            'Physical, Data Link, Network, Transport, Session, Presentation, Application',
            'Application, Presentation, Session, Transport, Network, Data Link, Physical',
            'Physical, Network, Transport, Session, Data Link, Presentation, Application',
            'Application, Transport, Network, Session, Presentation, Data Link, Physical'
        ],
        correctAnswer: 0,
        explanation: 'Remember: Please Do Not Throw Sausage Pizza Away (Physical, Data Link, Network, Transport, Session, Presentation, Application).',
        hints: ['Physical is the lowest (hardware)', 'Application is the highest (HTTP, etc.)'],
        xpReward: 25
    },

    // ========== SECTION 4: DNS & IP ==========
    {
        id: 'net_t1_12',
        tier: 1,
        chapter: 1,
        category: 'networking',
        difficulty: 'easy',
        topic: 'DNS',
        type: 'multiple-choice',
        question: 'What does DNS do?',
        options: [
            'Encrypts network traffic',
            'Translates domain names to IP addresses',
            'Stores website files',
            'Authenticates users'
        ],
        correctAnswer: 1,
        explanation: 'DNS (Domain Name System) is like the internet\'s phone book - it translates human-readable names (google.com) to IP addresses.',
        hints: ['Domain Name System', 'Maps names to numbers'],
        xpReward: 10
    },
    {
        id: 'net_t1_13',
        tier: 1,
        chapter: 1,
        category: 'networking',
        difficulty: 'easy',
        topic: 'IP Addresses',
        type: 'multiple-choice',
        question: 'Which is a valid IPv4 address?',
        options: [
            '192.168.1.256',
            '192.168.1.1',
            '192.168.1',
            '192.168.1.1.1'
        ],
        correctAnswer: 1,
        explanation: 'IPv4 has 4 octets (0-255 each), separated by dots. 256 is out of range, and we need exactly 4 parts.',
        hints: ['4 numbers, each 0-255', 'Separated by dots'],
        xpReward: 10
    },
    {
        id: 'net_t1_14',
        tier: 1,
        chapter: 1,
        category: 'networking',
        difficulty: 'medium',
        topic: 'IP Addresses',
        type: 'multiple-choice',
        question: 'What is the localhost IP address?',
        options: ['0.0.0.0', '127.0.0.1', '255.255.255.255', '192.168.0.1'],
        correctAnswer: 1,
        explanation: '127.0.0.1 is the loopback address, referring to the current machine. Also known as "localhost".',
        hints: ['The "home" address', 'Points to your own computer'],
        xpReward: 15
    },
    {
        id: 'net_t1_15',
        tier: 1,
        chapter: 1,
        category: 'networking',
        difficulty: 'medium',
        topic: 'HTTP vs HTTPS',
        type: 'multiple-choice',
        question: 'What does the "S" in HTTPS stand for?',
        options: [
            'Simple',
            'Secure',
            'Standard',
            'Speed'
        ],
        correctAnswer: 1,
        explanation: 'HTTPS = HTTP Secure. It uses TLS/SSL encryption to protect data in transit from eavesdropping.',
        hints: ['Security-related', 'Uses encryption'],
        xpReward: 10
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = networkingTier1Foundations;
}
