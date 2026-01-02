// Java Tier 4: Advanced - Concurrency, JVM & Performance
// 5 Concept Questions + 10 Hands-On Coding Exercises

const javaTier4Advanced = [
    // ========== SECTION 1: ADVANCED CONCURRENCY ==========

    // CONCEPT QUESTION 1
    {
        id: 'java_t4_concept_1',
        tier: 4,
        chapter: 4,
        category: 'java',
        difficulty: 'hard',
        topic: 'Advanced Concurrency',
        type: 'multiple-choice',
        question: 'What is the difference between synchronized and ReentrantLock?',
        options: [
            'ReentrantLock offers more flexibility: tryLock, timed locks, interruptible locks',
            'synchronized is faster in all cases',
            'ReentrantLock is thread-safe, synchronized is not',
            'There is no difference'
        ],
        correctAnswer: 0,
        explanation: 'ReentrantLock provides advanced features like tryLock() (non-blocking), lock with timeout, and interruptible locking.',
        hints: [
            'Think about additional features',
            'ReentrantLock has more control'
        ],
        realWorldContext: 'Use ReentrantLock when you need fairness, try-lock patterns, or lock interruption.',
        xpReward: 50
    },

    // CODING EXERCISE 1: CompletableFuture
    {
        id: 'java_t4_code_1',
        tier: 4,
        chapter: 4,
        category: 'java',
        difficulty: 'hard',
        topic: 'Advanced Concurrency',
        type: 'build-from-scratch',
        question: 'Use CompletableFuture to run an async task and handle the result',
        starterCode: `CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    // Simulate long-running task
    try { Thread.sleep(1000); } catch (InterruptedException e) {}
    return "Task completed!";
});

// Chain a callback to print the result
future./* Your code here */

// Wait for completion
future.join();`,
        solution: `CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    try { Thread.sleep(1000); } catch (InterruptedException e) {}
    return "Task completed!";
});

future.thenAccept(result -> System.out.println(result));

future.join();`,
        testCases: [
            { description: 'Prints "Task completed!" asynchronously' }
        ],
        hints: [
            'Use .thenAccept() to handle result',
            'Lambda: result -> System.out.println(result)',
            'join() waits for completion'
        ],
        explanation: 'CompletableFuture enables async programming. thenAccept() runs when the future completes.',
        realWorldContext: 'Async API calls, parallel data processing, non-blocking I/O.',
        xpReward: 60
    },

    // CODING EXERCISE 2: ConcurrentHashMap
    {
        id: 'java_t4_code_2',
        tier: 4,
        chapter: 4,
        category: 'java',
        difficulty: 'hard',
        topic: 'Advanced Concurrency',
        type: 'code-typing',
        question: 'Use ConcurrentHashMap to safely increment a counter from multiple threads',
        template: `ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

// Atomic increment
map.___(\"counter\", 1, (oldVal, newVal) -> oldVal + newVal);`,
        blanks: [
            { position: 0, correctAnswer: 'merge', alternatives: ['compute'] }
        ],
        explanation: 'merge() atomically updates a value. If key exists, applies the function; otherwise, uses the initial value.',
        hints: [
            'Use .merge() for atomic updates',
            'Syntax: merge(key, initialValue, mergeFunction)'
        ],
        realWorldContext: 'Thread-safe counters, caches, metrics collection.',
        xpReward: 50
    },

    // CODING EXERCISE 3: ExecutorService
    {
        id: 'java_t4_code_3',
        tier: 4,
        chapter: 4,
        category: 'java',
        difficulty: 'hard',
        topic: 'Advanced Concurrency',
        type: 'build-from-scratch',
        question: 'Create a thread pool and submit 5 tasks',
        starterCode: `ExecutorService executor = Executors./* Create thread pool */

for (int i = 0; i < 5; i++) {
    final int taskId = i;
    executor.submit(() -> {
        System.out.println("Task " + taskId + " running");
    });
}

executor.shutdown();`,
        solution: `ExecutorService executor = Executors.newFixedThreadPool(3);

for (int i = 0; i < 5; i++) {
    final int taskId = i;
    executor.submit(() -> {
        System.out.println("Task " + taskId + " running");
    });
}

executor.shutdown();`,
        testCases: [
            { description: 'Creates thread pool with 3 threads' },
            { description: 'Submits 5 tasks' },
            { description: 'Shuts down gracefully' }
        ],
        hints: [
            'Use Executors.newFixedThreadPool(n)',
            'n = number of threads (e.g., 3)',
            'submit() adds tasks to queue'
        ],
        explanation: 'Thread pools reuse threads, avoiding overhead of creating/destroying threads for each task.',
        realWorldContext: 'Web servers, batch processing, parallel computations.',
        xpReward: 60
    },

    // ========== SECTION 2: JVM INTERNALS ==========

    // CONCEPT QUESTION 2
    {
        id: 'java_t4_concept_2',
        tier: 4,
        chapter: 4,
        category: 'java',
        difficulty: 'hard',
        topic: 'JVM Internals',
        type: 'multiple-choice',
        question: 'What is the difference between heap and stack memory?',
        options: [
            'Heap stores objects, stack stores method calls and local variables',
            'Heap is faster than stack',
            'Stack stores objects, heap stores primitives',
            'There is no difference'
        ],
        correctAnswer: 0,
        explanation: 'Stack: method frames, local variables, fast access. Heap: objects, slower access, garbage collected.',
        hints: [
            'Think about object vs primitive storage',
            'Stack is for method execution'
        ],
        realWorldContext: 'Understanding memory helps debug OutOfMemoryError and StackOverflowError.',
        xpReward: 50
    },

    // CODING EXERCISE 4: Garbage collection
    {
        id: 'java_t4_code_4',
        tier: 4,
        chapter: 4,
        category: 'java',
        difficulty: 'hard',
        topic: 'JVM Internals',
        type: 'multiple-choice',
        question: 'Which GC algorithm is best for low-latency applications?',
        options: [
            'G1GC (Garbage First)',
            'Serial GC',
            'Parallel GC',
            'ZGC (Z Garbage Collector)'
        ],
        correctAnswer: 3,
        explanation: 'ZGC is designed for ultra-low latency (<10ms pause times), even with large heaps.',
        hints: [
            'Think about pause times',
            'Newest GC for low latency'
        ],
        realWorldContext: 'Trading systems, gaming servers, real-time applications need low GC pauses.',
        xpReward: 50
    },

    // CODING EXERCISE 5: Memory leaks
    {
        id: 'java_t4_code_5',
        tier: 4,
        chapter: 4,
        category: 'java',
        difficulty: 'hard',
        topic: 'JVM Internals',
        type: 'fix-bug',
        question: 'Fix the memory leak in this code',
        brokenCode: `public class Cache {
    private static Map<String, byte[]> cache = new HashMap<>();
    
    public void addToCache(String key, byte[] data) {
        cache.put(key, data);
        // Memory leak: cache grows forever!
    }
}`,
        errorLine: 5,
        errorMessage: 'Cache never removes old entries, causing memory leak',
        correctCode: `public class Cache {
    private static Map<String, byte[]> cache = new LinkedHashMap<>(100, 0.75f, true) {
        protected boolean removeEldestEntry(Map.Entry eldest) {
            return size() > 100;
        }
    };
    
    public void addToCache(String key, byte[] data) {
        cache.put(key, data);
    }
}`,
        explanation: 'LinkedHashMap with removeEldestEntry() creates an LRU cache that auto-evicts old entries.',
        hints: [
            'Use LinkedHashMap for LRU',
            'Override removeEldestEntry()',
            'Limit cache size'
        ],
        realWorldContext: 'Unbounded caches are a common cause of OutOfMemoryError in production.',
        xpReward: 60
    },

    // ========== SECTION 3: PERFORMANCE OPTIMIZATION ==========

    // CONCEPT QUESTION 3
    {
        id: 'java_t4_concept_3',
        tier: 4,
        chapter: 4,
        category: 'java',
        difficulty: 'hard',
        topic: 'Performance',
        type: 'multiple-choice',
        question: 'What is the most effective way to improve Java application performance?',
        options: [
            'Profile first, then optimize hotspots',
            'Optimize everything from the start',
            'Use more threads',
            'Increase heap size'
        ],
        correctAnswer: 0,
        explanation: 'Premature optimization is wasteful. Profile to find bottlenecks (usually 10% of code causes 90% of slowness).',
        hints: [
            'Measure before optimizing',
            'Focus on the biggest problems'
        ],
        realWorldContext: 'Use profilers like JProfiler, YourKit, or VisualVM to find slow code.',
        xpReward: 50
    },

    // CODING EXERCISE 6: Lazy initialization
    {
        id: 'java_t4_code_6',
        tier: 4,
        chapter: 4,
        category: 'java',
        difficulty: 'hard',
        topic: 'Performance',
        type: 'build-from-scratch',
        question: 'Implement lazy initialization for an expensive object',
        starterCode: `public class ExpensiveResource {
    private static ExpensiveResource instance;
    
    private ExpensiveResource() {
        // Expensive initialization
        System.out.println("Creating expensive resource...");
    }
    
    public static ExpensiveResource getInstance() {
        // Implement lazy initialization here
        
    }
}`,
        solution: `public class ExpensiveResource {
    private static ExpensiveResource instance;
    
    private ExpensiveResource() {
        System.out.println("Creating expensive resource...");
    }
    
    public static ExpensiveResource getInstance() {
        if (instance == null) {
            instance = new ExpensiveResource();
        }
        return instance;
    }
}`,
        testCases: [
            { description: 'Only creates instance when first accessed' },
            { description: 'Reuses same instance on subsequent calls' }
        ],
        hints: [
            'Check if instance is null',
            'Create only if needed',
            'Return the instance'
        ],
        explanation: 'Lazy initialization delays object creation until first use, saving resources.',
        realWorldContext: 'Database connections, file handles, network sockets - create only when needed.',
        xpReward: 50
    },

    // CODING EXERCISE 7: String intern
    {
        id: 'java_t4_code_7',
        tier: 4,
        chapter: 4,
        category: 'java',
        difficulty: 'hard',
        topic: 'Performance',
        type: 'code-typing',
        question: 'Use String.intern() to reduce memory usage',
        template: `// Without intern: creates many duplicate strings
String s1 = new String("hello");
String s2 = new String("hello");

// With intern: reuses same string
String s3 = new String("hello").___();
String s4 = new String("hello").___();

System.out.println(s3 == s4); // true`,
        blanks: [
            { position: 0, correctAnswer: 'intern', alternatives: [] },
            { position: 1, correctAnswer: 'intern', alternatives: [] }
        ],
        explanation: 'intern() returns a canonical representation from the string pool, saving memory for duplicate strings.',
        hints: [
            'Use .intern() method',
            'Returns string from pool'
        ],
        realWorldContext: 'Useful when processing large datasets with many duplicate strings (logs, CSV files).',
        xpReward: 50
    },

    // ========== SECTION 4: ADVANCED STREAMS ==========

    // CONCEPT QUESTION 4
    {
        id: 'java_t4_concept_4',
        tier: 4,
        chapter: 4,
        category: 'java',
        difficulty: 'hard',
        topic: 'Advanced Streams',
        type: 'multiple-choice',
        question: 'When should you use parallel streams?',
        options: [
            'For CPU-intensive operations on large datasets',
            'Always, they are always faster',
            'For I/O operations',
            'For small datasets'
        ],
        correctAnswer: 0,
        explanation: 'Parallel streams benefit CPU-bound tasks on large data. Overhead makes them slower for small datasets or I/O.',
        hints: [
            'Think about when parallelism helps',
            'CPU-intensive + large data'
        ],
        realWorldContext: 'Image processing, data analysis, mathematical computations on millions of records.',
        xpReward: 50
    },

    // CODING EXERCISE 8: Parallel stream
    {
        id: 'java_t4_code_8',
        tier: 4,
        chapter: 4,
        category: 'java',
        difficulty: 'hard',
        topic: 'Advanced Streams',
        type: 'code-typing',
        question: 'Convert a stream to parallel and process data',
        template: `List<Integer> numbers = IntStream.range(1, 1000000).boxed().collect(Collectors.toList());

long sum = numbers.___()
    .mapToLong(n -> n * n)
    .sum();`,
        blanks: [
            { position: 0, correctAnswer: 'parallelStream', alternatives: ['stream().parallel'] }
        ],
        explanation: 'parallelStream() or stream().parallel() splits work across multiple threads.',
        hints: [
            'Use .parallelStream()',
            'Or .stream().parallel()'
        ],
        realWorldContext: 'Processing large files, batch computations, data transformations.',
        xpReward: 50
    },

    // CODING EXERCISE 9: Custom collector
    {
        id: 'java_t4_code_9',
        tier: 4,
        chapter: 4,
        category: 'java',
        difficulty: 'hard',
        topic: 'Advanced Streams',
        type: 'build-from-scratch',
        question: 'Use Collectors.partitioningBy to split numbers into even/odd',
        starterCode: `List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

Map<Boolean, List<Integer>> partitioned = numbers.stream()
    // Your code here
    
System.out.println("Even: " + partitioned.get(true));
System.out.println("Odd: " + partitioned.get(false));`,
        solution: `List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

Map<Boolean, List<Integer>> partitioned = numbers.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));
    
System.out.println("Even: " + partitioned.get(true));
System.out.println("Odd: " + partitioned.get(false));`,
        testCases: [
            { description: 'Even: [2, 4, 6, 8, 10]' },
            { description: 'Odd: [1, 3, 5, 7, 9]' }
        ],
        hints: [
            'Use Collectors.partitioningBy()',
            'Predicate: n -> n % 2 == 0',
            'Returns Map<Boolean, List<Integer>>'
        ],
        explanation: 'partitioningBy() splits into two groups based on a predicate (true/false).',
        realWorldContext: 'Splitting data: valid/invalid, active/inactive, passed/failed.',
        xpReward: 60
    },

    // ========== SECTION 5: REACTIVE PROGRAMMING ==========

    // CONCEPT QUESTION 5
    {
        id: 'java_t4_concept_5',
        tier: 4,
        chapter: 4,
        category: 'java',
        difficulty: 'hard',
        topic: 'Reactive Programming',
        type: 'multiple-choice',
        question: 'What is the main benefit of reactive programming?',
        options: [
            'Non-blocking, event-driven, handles backpressure',
            'Faster than traditional programming',
            'Easier to understand',
            'Uses less memory'
        ],
        correctAnswer: 0,
        explanation: 'Reactive programming handles asynchronous data streams efficiently, with backpressure to prevent overwhelming consumers.',
        hints: [
            'Think about async data streams',
            'Handles data flow control'
        ],
        realWorldContext: 'Real-time dashboards, streaming data, microservices communication.',
        xpReward: 50
    },

    // CODING EXERCISE 10: CompletableFuture chaining
    {
        id: 'java_t4_code_10',
        tier: 4,
        chapter: 4,
        category: 'java',
        difficulty: 'hard',
        topic: 'Reactive Programming',
        type: 'build-from-scratch',
        question: 'Chain multiple async operations using CompletableFuture',
        starterCode: `CompletableFuture.supplyAsync(() -> "User123")
    .thenApply(userId -> {
        // Fetch user details
        return "User: " + userId;
    })
    .thenApply(user -> {
        // Process user
        return user.toUpperCase();
    })
    .thenAccept(result -> {
        // Your code here
        
    })
    .join();`,
        solution: `CompletableFuture.supplyAsync(() -> "User123")
    .thenApply(userId -> {
        return "User: " + userId;
    })
    .thenApply(user -> {
        return user.toUpperCase();
    })
    .thenAccept(result -> {
        System.out.println(result);
    })
    .join();`,
        testCases: [
            { description: 'Prints "USER: USER123"' }
        ],
        hints: [
            'Use thenAccept() to consume final result',
            'Print the result',
            'join() waits for completion'
        ],
        explanation: 'Chaining async operations creates pipelines: fetch → transform → process → output.',
        realWorldContext: 'API calls: get user → fetch orders → calculate total → send email.',
        xpReward: 60
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = javaTier4Advanced;
}
