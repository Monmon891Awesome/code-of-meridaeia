// Java Tier 5: Mastery - System Design & Real-World Projects
// 10 Project-Based Challenges

const javaTier5Mastery = [
    // ========== REAL-WORLD PROJECTS ==========

    // PROJECT 1: REST API
    {
        id: 'java_t5_project_1',
        tier: 5,
        chapter: 5,
        category: 'java',
        difficulty: 'expert',
        topic: 'System Design',
        type: 'project',
        question: 'Design a REST API endpoint for user registration',
        requirements: [
            'Accept POST request with username, email, password',
            'Validate email format',
            'Hash password before storing',
            'Return 201 Created on success, 400 Bad Request on validation error',
            'Handle duplicate email gracefully'
        ],
        starterCode: `@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        // Your implementation here
        
    }
}`,
        solution: `@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        // Validate email
        if (!isValidEmail(userDTO.getEmail())) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        // Check for duplicate
        if (userService.emailExists(userDTO.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        
        // Hash password
        String hashedPassword = BCrypt.hashpw(userDTO.getPassword(), BCrypt.gensalt());
        userDTO.setPassword(hashedPassword);
        
        // Save user
        User user = userService.createUser(userDTO);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    
    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
}`,
        hints: [
            'Use ResponseEntity for HTTP responses',
            'Validate input before processing',
            'Use BCrypt for password hashing',
            'Return appropriate status codes'
        ],
        explanation: 'REST APIs need validation, security (password hashing), error handling, and proper HTTP status codes.',
        realWorldContext: 'Every web application needs user registration. This is production-ready code.',
        xpReward: 100
    },

    // PROJECT 2: Caching Layer
    {
        id: 'java_t5_project_2',
        tier: 5,
        chapter: 5,
        category: 'java',
        difficulty: 'expert',
        topic: 'Performance',
        type: 'project',
        question: 'Implement a thread-safe LRU cache with TTL (time-to-live)',
        requirements: [
            'Generic cache: Cache<K, V>',
            'Maximum capacity (evict oldest when full)',
            'TTL: entries expire after N seconds',
            'Thread-safe for concurrent access',
            'O(1) get and put operations'
        ],
        starterCode: `public class LRUCache<K, V> {
    private final int maxSize;
    private final long ttlMillis;
    
    public LRUCache(int maxSize, long ttlSeconds) {
        this.maxSize = maxSize;
        this.ttlMillis = ttlSeconds * 1000;
        // Your implementation here
    }
    
    public V get(K key) {
        // Your implementation here
    }
    
    public void put(K key, V value) {
        // Your implementation here
    }
}`,
        solution: `public class LRUCache<K, V> {
    private final int maxSize;
    private final long ttlMillis;
    private final Map<K, CacheEntry<V>> cache;
    
    private static class CacheEntry<V> {
        V value;
        long timestamp;
        
        CacheEntry(V value) {
            this.value = value;
            this.timestamp = System.currentTimeMillis();
        }
        
        boolean isExpired(long ttl) {
            return System.currentTimeMillis() - timestamp > ttl;
        }
    }
    
    public LRUCache(int maxSize, long ttlSeconds) {
        this.maxSize = maxSize;
        this.ttlMillis = ttlSeconds * 1000;
        this.cache = Collections.synchronizedMap(
            new LinkedHashMap<K, CacheEntry<V>>(maxSize, 0.75f, true) {
                protected boolean removeEldestEntry(Map.Entry eldest) {
                    return size() > maxSize;
                }
            }
        );
    }
    
    public V get(K key) {
        CacheEntry<V> entry = cache.get(key);
        if (entry == null || entry.isExpired(ttlMillis)) {
            cache.remove(key);
            return null;
        }
        return entry.value;
    }
    
    public void put(K key, V value) {
        cache.put(key, new CacheEntry<>(value));
    }
}`,
        hints: [
            'Use LinkedHashMap for LRU ordering',
            'Wrap values with timestamp for TTL',
            'Collections.synchronizedMap for thread safety',
            'Check expiration on get()'
        ],
        explanation: 'Production caches need: size limits, expiration, thread safety, and fast access.',
        realWorldContext: 'Used in: API response caching, database query caching, session storage.',
        xpReward: 100
    },

    // PROJECT 3: Rate Limiter
    {
        id: 'java_t5_project_3',
        tier: 5,
        chapter: 5,
        category: 'java',
        difficulty: 'expert',
        topic: 'System Design',
        type: 'project',
        question: 'Implement a token bucket rate limiter',
        requirements: [
            'Allow N requests per second per user',
            'Reject requests exceeding rate limit',
            'Thread-safe',
            'Efficient (no background threads)'
        ],
        starterCode: `public class RateLimiter {
    private final int maxTokens;
    private final long refillIntervalMillis;
    
    public RateLimiter(int requestsPerSecond) {
        this.maxTokens = requestsPerSecond;
        this.refillIntervalMillis = 1000;
        // Your implementation here
    }
    
    public boolean allowRequest(String userId) {
        // Your implementation here
    }
}`,
        solution: `public class RateLimiter {
    private final int maxTokens;
    private final long refillIntervalMillis;
    private final ConcurrentHashMap<String, TokenBucket> buckets;
    
    private static class TokenBucket {
        int tokens;
        long lastRefill;
        
        TokenBucket(int maxTokens) {
            this.tokens = maxTokens;
            this.lastRefill = System.currentTimeMillis();
        }
        
        synchronized boolean tryConsume(int maxTokens, long refillInterval) {
            refill(maxTokens, refillInterval);
            if (tokens > 0) {
                tokens--;
                return true;
            }
            return false;
        }
        
        private void refill(int maxTokens, long refillInterval) {
            long now = System.currentTimeMillis();
            long elapsed = now - lastRefill;
            int tokensToAdd = (int) (elapsed / refillInterval);
            if (tokensToAdd > 0) {
                tokens = Math.min(maxTokens, tokens + tokensToAdd);
                lastRefill = now;
            }
        }
    }
    
    public RateLimiter(int requestsPerSecond) {
        this.maxTokens = requestsPerSecond;
        this.refillIntervalMillis = 1000;
        this.buckets = new ConcurrentHashMap<>();
    }
    
    public boolean allowRequest(String userId) {
        TokenBucket bucket = buckets.computeIfAbsent(userId, 
            k -> new TokenBucket(maxTokens));
        return bucket.tryConsume(maxTokens, refillIntervalMillis);
    }
}`,
        hints: [
            'Token bucket: refill tokens over time',
            'ConcurrentHashMap for per-user buckets',
            'Synchronized method for thread safety',
            'Refill based on elapsed time'
        ],
        explanation: 'Rate limiting prevents abuse. Token bucket allows bursts while maintaining average rate.',
        realWorldContext: 'Protecting APIs from: DDoS, brute force, resource exhaustion.',
        xpReward: 100
    },

    // PROJECT 4: Event-Driven System
    {
        id: 'java_t5_project_4',
        tier: 5,
        chapter: 5,
        category: 'java',
        difficulty: 'expert',
        topic: 'Design Patterns',
        type: 'project',
        question: 'Implement an event bus for pub-sub messaging',
        requirements: [
            'Subscribe to events by type',
            'Publish events to all subscribers',
            'Async event delivery',
            'Type-safe subscriptions'
        ],
        starterCode: `public class EventBus {
    
    public <T> void subscribe(Class<T> eventType, Consumer<T> handler) {
        // Your implementation here
    }
    
    public <T> void publish(T event) {
        // Your implementation here
    }
}`,
        solution: `public class EventBus {
    private final Map<Class<?>, List<Consumer<?>>> subscribers = new ConcurrentHashMap<>();
    private final ExecutorService executor = Executors.newCachedThreadPool();
    
    public <T> void subscribe(Class<T> eventType, Consumer<T> handler) {
        subscribers.computeIfAbsent(eventType, k -> new CopyOnWriteArrayList<>())
                   .add(handler);
    }
    
    @SuppressWarnings("unchecked")
    public <T> void publish(T event) {
        Class<?> eventType = event.getClass();
        List<Consumer<?>> handlers = subscribers.get(eventType);
        
        if (handlers != null) {
            handlers.forEach(handler -> {
                executor.submit(() -> {
                    ((Consumer<T>) handler).accept(event);
                });
            });
        }
    }
    
    public void shutdown() {
        executor.shutdown();
    }
}`,
        hints: [
            'Map event types to handler lists',
            'ExecutorService for async delivery',
            'CopyOnWriteArrayList for thread-safe iteration',
            'Type casting with @SuppressWarnings'
        ],
        explanation: 'Event buses decouple components. Publishers don\'t know about subscribers.',
        realWorldContext: 'Microservices, UI frameworks, game engines, notification systems.',
        xpReward: 100
    },

    // PROJECT 5: Connection Pool
    {
        id: 'java_t5_project_5',
        tier: 5,
        chapter: 5,
        category: 'java',
        difficulty: 'expert',
        topic: 'Resource Management',
        type: 'project',
        question: 'Implement a database connection pool',
        requirements: [
            'Pool of reusable connections',
            'Max pool size',
            'Block when pool exhausted',
            'Return connections to pool after use',
            'Close idle connections'
        ],
        starterCode: `public class ConnectionPool {
    private final int maxSize;
    private final BlockingQueue<Connection> pool;
    
    public ConnectionPool(int maxSize) {
        this.maxSize = maxSize;
        this.pool = new LinkedBlockingQueue<>(maxSize);
        // Initialize pool
    }
    
    public Connection getConnection() throws InterruptedException {
        // Your implementation here
    }
    
    public void returnConnection(Connection conn) {
        // Your implementation here
    }
}`,
        solution: `public class ConnectionPool {
    private final int maxSize;
    private final BlockingQueue<Connection> pool;
    private final AtomicInteger activeConnections = new AtomicInteger(0);
    
    public ConnectionPool(int maxSize) {
        this.maxSize = maxSize;
        this.pool = new LinkedBlockingQueue<>(maxSize);
    }
    
    public Connection getConnection() throws InterruptedException {
        Connection conn = pool.poll();
        
        if (conn == null && activeConnections.get() < maxSize) {
            conn = createNewConnection();
            activeConnections.incrementAndGet();
        } else if (conn == null) {
            // Wait for available connection
            conn = pool.take();
        }
        
        return conn;
    }
    
    public void returnConnection(Connection conn) {
        if (conn != null) {
            pool.offer(conn);
        }
    }
    
    private Connection createNewConnection() {
        // Create actual DB connection
        return DriverManager.getConnection("jdbc:...");
    }
    
    public void shutdown() {
        pool.forEach(conn -> {
            try { conn.close(); } catch (SQLException e) {}
        });
    }
}`,
        hints: [
            'BlockingQueue for thread-safe pool',
            'AtomicInteger for connection count',
            'poll() for non-blocking, take() for blocking',
            'Create new connections up to maxSize'
        ],
        explanation: 'Connection pools reuse expensive resources, improving performance dramatically.',
        realWorldContext: 'Every production app uses connection pooling (HikariCP, C3P0, DBCP).',
        xpReward: 100
    },

    // REMAINING 5 PROJECTS (Shorter descriptions for space)

    // PROJECT 6: Retry Logic
    {
        id: 'java_t5_project_6',
        tier: 5,
        chapter: 5,
        category: 'java',
        difficulty: 'expert',
        topic: 'Resilience',
        type: 'build-from-scratch',
        question: 'Implement exponential backoff retry logic',
        starterCode: `public <T> T retryWithBackoff(Callable<T> task, int maxRetries) throws Exception {
    // Your implementation here
}`,
        solution: `public <T> T retryWithBackoff(Callable<T> task, int maxRetries) throws Exception {
    int attempt = 0;
    while (true) {
        try {
            return task.call();
        } catch (Exception e) {
            if (++attempt >= maxRetries) {
                throw e;
            }
            long waitTime = (long) Math.pow(2, attempt) * 1000; // Exponential
            Thread.sleep(waitTime);
        }
    }
}`,
        hints: ['Exponential: 2^attempt * 1000ms', 'Catch, wait, retry', 'Throw after max attempts'],
        explanation: 'Exponential backoff prevents overwhelming failing services.',
        realWorldContext: 'API calls, database queries, network requests.',
        xpReward: 100
    },

    // PROJECT 7: Circuit Breaker
    {
        id: 'java_t5_project_7',
        tier: 5,
        chapter: 5,
        category: 'java',
        difficulty: 'expert',
        topic: 'Resilience',
        type: 'project',
        question: 'Implement a circuit breaker pattern',
        requirements: ['Open after N failures', 'Half-open after timeout', 'Close on success'],
        starterCode: `public class CircuitBreaker {
    private enum State { CLOSED, OPEN, HALF_OPEN }
    // Your implementation
}`,
        hints: ['Track failure count', 'State transitions', 'Timeout for half-open'],
        explanation: 'Circuit breakers prevent cascading failures in distributed systems.',
        realWorldContext: 'Microservices, external APIs, database calls.',
        xpReward: 100
    },

    // PROJECT 8: Async Job Queue
    {
        id: 'java_t5_project_8',
        tier: 5,
        chapter: 5,
        category: 'java',
        difficulty: 'expert',
        topic: 'Concurrency',
        type: 'project',
        question: 'Build an async job queue with priority',
        requirements: ['Priority queue', 'Worker threads', 'Job status tracking'],
        starterCode: `public class JobQueue {
    public void submit(Job job, int priority) {}
    public JobStatus getStatus(String jobId) {}
}`,
        hints: ['PriorityBlockingQueue', 'ExecutorService', 'ConcurrentHashMap for status'],
        explanation: 'Job queues enable background processing without blocking main thread.',
        realWorldContext: 'Email sending, report generation, image processing.',
        xpReward: 100
    },

    // PROJECT 9: Distributed Lock
    {
        id: 'java_t5_project_9',
        tier: 5,
        chapter: 5,
        category: 'java',
        difficulty: 'expert',
        topic: 'Distributed Systems',
        type: 'project',
        question: 'Implement a distributed lock using Redis',
        requirements: ['Acquire lock with TTL', 'Release lock', 'Handle lock expiration'],
        starterCode: `public class DistributedLock {
    public boolean acquire(String lockKey, long ttlSeconds) {}
    public void release(String lockKey) {}
}`,
        hints: ['Redis SETNX for atomic acquire', 'SET with EX for TTL', 'DEL to release'],
        explanation: 'Distributed locks coordinate access across multiple servers.',
        realWorldContext: 'Preventing duplicate job execution, resource allocation.',
        xpReward: 100
    },

    // PROJECT 10: Metrics Collector
    {
        id: 'java_t5_project_10',
        tier: 5,
        chapter: 5,
        category: 'java',
        difficulty: 'expert',
        topic: 'Observability',
        type: 'project',
        question: 'Build a metrics collector for monitoring',
        requirements: ['Counter, Gauge, Histogram', 'Thread-safe', 'Export to Prometheus format'],
        starterCode: `public class MetricsCollector {
    public void incrementCounter(String name) {}
    public void recordGauge(String name, double value) {}
    public String exportPrometheus() {}
}`,
        hints: ['AtomicLong for counters', 'ConcurrentHashMap for storage', 'Format: name value timestamp'],
        explanation: 'Metrics are essential for monitoring production systems.',
        realWorldContext: 'Request counts, response times, error rates, resource usage.',
        xpReward: 100
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = javaTier5Mastery;
}
