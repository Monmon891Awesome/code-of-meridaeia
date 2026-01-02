// Java Tier 3: Intermediate - Streams, Lambdas & Multithreading
// 5 Concept Questions + 10 Hands-On Coding Exercises

const javaTier3Intermediate = [
    // ========== SECTION 1: STREAMS API ==========

    // CONCEPT QUESTION 1
    {
        id: 'java_t3_concept_1',
        tier: 3,
        chapter: 3,
        category: 'java',
        difficulty: 'medium',
        topic: 'Streams API',
        type: 'multiple-choice',
        question: 'What is the main advantage of using Java Streams?',
        options: [
            'Declarative, functional-style operations on collections',
            'Faster than loops in all cases',
            'Automatic parallelization',
            'Less memory usage'
        ],
        correctAnswer: 0,
        explanation: 'Streams provide a declarative way to process data. Code is more readable and expressive than traditional loops.',
        hints: [
            'Think about code readability',
            'It\'s about expressing WHAT, not HOW'
        ],
        realWorldContext: 'Streams make data processing pipelines clean: filter users → map to names → collect to list.',
        xpReward: 30
    },

    // CODING EXERCISE 1: Filter and collect
    {
        id: 'java_t3_code_1',
        tier: 3,
        chapter: 3,
        category: 'java',
        difficulty: 'medium',
        topic: 'Streams API',
        type: 'build-from-scratch',
        question: 'Use streams to filter even numbers from a list and collect them',
        starterCode: `List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// Use streams to get only even numbers
List<Integer> evenNumbers = numbers.stream()
    // Your code here
    
System.out.println(evenNumbers);`,
        solution: `List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

List<Integer> evenNumbers = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
    
System.out.println(evenNumbers);`,
        testCases: [
            { description: 'Returns [2, 4, 6, 8, 10]', output: ['[2, 4, 6, 8, 10]'] }
        ],
        hints: [
            'Use .filter() with a lambda',
            'Lambda: n -> n % 2 == 0',
            'Use .collect(Collectors.toList())'
        ],
        explanation: 'filter() keeps elements matching the predicate. collect() gathers results into a collection.',
        realWorldContext: 'Filtering data: active users, valid orders, products in stock, etc.',
        xpReward: 35
    },

    // CODING EXERCISE 2: Map and reduce
    {
        id: 'java_t3_code_2',
        tier: 3,
        chapter: 3,
        category: 'java',
        difficulty: 'medium',
        topic: 'Streams API',
        type: 'code-typing',
        question: 'Complete the stream to double each number and sum them',
        template: `List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5);
int sum = nums.stream()
    .___(n -> n * 2)
    .___(Integer::sum)
    .orElse(0);`,
        blanks: [
            { position: 0, correctAnswer: 'mapToInt', alternatives: ['map'] },
            { position: 1, correctAnswer: 'reduce', alternatives: [] }
        ],
        explanation: 'mapToInt() transforms elements. reduce() combines them into a single value.',
        hints: [
            'Use mapToInt() to transform to int',
            'Use reduce() to sum all values'
        ],
        realWorldContext: 'Calculating totals: cart total, average rating, total revenue, etc.',
        xpReward: 30
    },

    // ========== SECTION 2: LAMBDA EXPRESSIONS ==========

    // CONCEPT QUESTION 2
    {
        id: 'java_t3_concept_2',
        tier: 3,
        chapter: 3,
        category: 'java',
        difficulty: 'medium',
        topic: 'Lambda Expressions',
        type: 'multiple-choice',
        question: 'What is a functional interface in Java?',
        options: [
            'An interface with exactly one abstract method',
            'An interface that extends Function',
            'An interface with no methods',
            'An interface with multiple default methods'
        ],
        correctAnswer: 0,
        explanation: 'Functional interfaces have exactly one abstract method and can be implemented with lambdas.',
        hints: [
            'Think about the requirement for lambdas',
            'How many abstract methods?'
        ],
        realWorldContext: 'Examples: Runnable, Comparator, Predicate, Function, Consumer.',
        xpReward: 30
    },

    // CODING EXERCISE 3: Lambda with Comparator
    {
        id: 'java_t3_code_3',
        tier: 3,
        chapter: 3,
        category: 'java',
        difficulty: 'medium',
        topic: 'Lambda Expressions',
        type: 'build-from-scratch',
        question: 'Sort a list of strings by length using a lambda',
        starterCode: `List<String> words = Arrays.asList("apple", "pie", "banana", "cat");

// Sort by length using lambda
words.sort(/* Your lambda here */);

System.out.println(words);`,
        solution: `List<String> words = Arrays.asList("apple", "pie", "banana", "cat");

words.sort((a, b) -> a.length() - b.length());

System.out.println(words);`,
        testCases: [
            { description: 'Sorts by length: [pie, cat, apple, banana]', output: ['[pie, cat, apple, banana]'] }
        ],
        hints: [
            'Lambda takes two parameters: (a, b)',
            'Compare lengths: a.length() - b.length()',
            'Negative = a first, Positive = b first'
        ],
        explanation: 'Lambdas replace anonymous inner classes. Much cleaner syntax for simple operations.',
        realWorldContext: 'Sorting: products by price, users by age, files by size, etc.',
        xpReward: 35
    },

    // CODING EXERCISE 4: Method references
    {
        id: 'java_t3_code_4',
        tier: 3,
        chapter: 3,
        category: 'java',
        difficulty: 'medium',
        topic: 'Lambda Expressions',
        type: 'code-typing',
        question: 'Convert this lambda to a method reference',
        template: `List<String> names = Arrays.asList("alice", "bob", "charlie");

// Lambda version:
// names.forEach(name -> System.out.println(name));

// Method reference version:
names.forEach(System.out::___);`,
        blanks: [
            { position: 0, correctAnswer: 'println', alternatives: [] }
        ],
        explanation: 'Method references (::) are shorthand for lambdas that just call one method.',
        hints: [
            'Syntax: Class::method',
            'We\'re calling println method'
        ],
        realWorldContext: 'Method references make code cleaner when lambda just delegates to a method.',
        xpReward: 30
    },

    // ========== SECTION 3: MULTITHREADING ==========

    // CONCEPT QUESTION 3
    {
        id: 'java_t3_concept_3',
        tier: 3,
        chapter: 3,
        category: 'java',
        difficulty: 'medium',
        topic: 'Multithreading',
        type: 'multiple-choice',
        question: 'What is a race condition?',
        options: [
            'When multiple threads access shared data concurrently, causing unpredictable results',
            'When one thread runs faster than another',
            'When threads compete for CPU time',
            'When a thread finishes before another starts'
        ],
        correctAnswer: 0,
        explanation: 'Race conditions occur when threads read/write shared data without proper synchronization, leading to bugs.',
        hints: [
            'Think about concurrent access to shared data',
            'Results depend on timing/order'
        ],
        realWorldContext: 'Classic bug: two threads incrementing a counter simultaneously, losing updates.',
        xpReward: 30
    },

    // CODING EXERCISE 5: Creating threads
    {
        id: 'java_t3_code_5',
        tier: 3,
        chapter: 3,
        category: 'java',
        difficulty: 'medium',
        topic: 'Multithreading',
        type: 'build-from-scratch',
        question: 'Create and start a thread using a lambda',
        starterCode: `// Create a thread that prints "Hello from thread!"
Thread thread = new Thread(/* Your lambda here */);

thread.start();`,
        solution: `Thread thread = new Thread(() -> {
    System.out.println("Hello from thread!");
});

thread.start();`,
        testCases: [
            { description: 'Creates and starts a thread', output: ['Hello from thread!'] }
        ],
        hints: [
            'Thread constructor takes a Runnable',
            'Use lambda: () -> { ... }',
            'Print inside the lambda'
        ],
        explanation: 'Threads run code concurrently. Runnable is a functional interface, so we can use lambdas.',
        realWorldContext: 'Background tasks: file uploads, email sending, data processing, etc.',
        xpReward: 35
    },

    // CODING EXERCISE 6: Synchronized method
    {
        id: 'java_t3_code_6',
        tier: 3,
        chapter: 3,
        category: 'java',
        difficulty: 'hard',
        topic: 'Multithreading',
        type: 'code-typing',
        question: 'Make this method thread-safe using synchronized',
        template: `private int counter = 0;

public ___ void increment() {
    counter++;
}`,
        blanks: [
            { position: 0, correctAnswer: 'synchronized', alternatives: [] }
        ],
        explanation: 'synchronized ensures only one thread can execute the method at a time, preventing race conditions.',
        hints: [
            'Use the synchronized keyword',
            'Place it before the return type'
        ],
        realWorldContext: 'Protecting shared resources: counters, caches, connection pools, etc.',
        xpReward: 30
    },

    // ========== SECTION 4: DESIGN PATTERNS ==========

    // CONCEPT QUESTION 4
    {
        id: 'java_t3_concept_4',
        tier: 3,
        chapter: 3,
        category: 'java',
        difficulty: 'medium',
        topic: 'Design Patterns',
        type: 'multiple-choice',
        question: 'What is the Singleton pattern used for?',
        options: [
            'Ensuring a class has only one instance',
            'Creating multiple instances efficiently',
            'Separating interface from implementation',
            'Observing changes in objects'
        ],
        correctAnswer: 0,
        explanation: 'Singleton ensures only one instance exists globally, with a global access point.',
        hints: [
            'Think about "single" instance',
            'One and only one object'
        ],
        realWorldContext: 'Used for: database connections, configuration managers, logging, caches.',
        xpReward: 30
    },

    // CODING EXERCISE 7: Singleton pattern
    {
        id: 'java_t3_code_7',
        tier: 3,
        chapter: 3,
        category: 'java',
        difficulty: 'hard',
        topic: 'Design Patterns',
        type: 'build-from-scratch',
        question: 'Implement a thread-safe Singleton class',
        starterCode: `public class DatabaseConnection {
    private static DatabaseConnection instance;
    
    // Private constructor
    private DatabaseConnection() {}
    
    // Thread-safe getInstance method
    public static synchronized DatabaseConnection getInstance() {
        // Your code here
        
    }
}`,
        solution: `public class DatabaseConnection {
    private static DatabaseConnection instance;
    
    private DatabaseConnection() {}
    
    public static synchronized DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection();
        }
        return instance;
    }
}`,
        testCases: [
            { description: 'Returns same instance on multiple calls' },
            { description: 'Thread-safe with synchronized' }
        ],
        hints: [
            'Check if instance is null',
            'Create new instance if null',
            'Return the instance'
        ],
        explanation: 'Private constructor prevents direct instantiation. synchronized prevents race conditions.',
        realWorldContext: 'Ensures only one database connection, config manager, or logger exists.',
        xpReward: 40
    },

    // CODING EXERCISE 8: Factory pattern
    {
        id: 'java_t3_code_8',
        tier: 3,
        chapter: 3,
        category: 'java',
        difficulty: 'hard',
        topic: 'Design Patterns',
        type: 'code-typing',
        question: 'Complete the Factory pattern to create different shapes',
        template: `public class ShapeFactory {
    public Shape createShape(String type) {
        if (type.equals("circle")) {
            return new ___();
        } else if (type.equals("square")) {
            return new ___();
        }
        return null;
    }
}`,
        blanks: [
            { position: 0, correctAnswer: 'Circle', alternatives: [] },
            { position: 1, correctAnswer: 'Square', alternatives: [] }
        ],
        explanation: 'Factory pattern centralizes object creation, hiding implementation details from clients.',
        hints: [
            'Return new Circle() for "circle"',
            'Return new Square() for "square"'
        ],
        realWorldContext: 'Creating objects based on config: database drivers, UI components, parsers, etc.',
        xpReward: 35
    },

    // ========== SECTION 5: OPTIONAL & ADVANCED STREAMS ==========

    // CONCEPT QUESTION 5
    {
        id: 'java_t3_concept_5',
        tier: 3,
        chapter: 3,
        category: 'java',
        difficulty: 'medium',
        topic: 'Optional',
        type: 'multiple-choice',
        question: 'What is the purpose of Optional in Java?',
        options: [
            'To explicitly represent the absence of a value and avoid NullPointerException',
            'To make values optional in method parameters',
            'To optimize memory usage',
            'To create nullable primitives'
        ],
        correctAnswer: 0,
        explanation: 'Optional is a container that may or may not contain a value, forcing explicit null handling.',
        hints: [
            'Think about null safety',
            'It\'s a wrapper for potentially null values'
        ],
        realWorldContext: 'Prevents NPE: Optional<User> findById(). Forces caller to handle "not found" case.',
        xpReward: 30
    },

    // CODING EXERCISE 9: Optional usage
    {
        id: 'java_t3_code_9',
        tier: 3,
        chapter: 3,
        category: 'java',
        difficulty: 'medium',
        topic: 'Optional',
        type: 'build-from-scratch',
        question: 'Use Optional to safely get a value or return a default',
        starterCode: `Optional<String> optionalName = Optional.empty();

// Get the value or return "Unknown"
String name = optionalName./* Your code here */

System.out.println(name);`,
        solution: `Optional<String> optionalName = Optional.empty();

String name = optionalName.orElse("Unknown");

System.out.println(name);`,
        testCases: [
            { description: 'Returns "Unknown" when empty', output: ['Unknown'] }
        ],
        hints: [
            'Use .orElse() method',
            'Provide default value: "Unknown"'
        ],
        explanation: 'orElse() returns the value if present, otherwise returns the default.',
        realWorldContext: 'Safe defaults: config values, user preferences, search results, etc.',
        xpReward: 30
    },

    // CODING EXERCISE 10: Stream collectors
    {
        id: 'java_t3_code_10',
        tier: 3,
        chapter: 3,
        category: 'java',
        difficulty: 'hard',
        topic: 'Streams API',
        type: 'build-from-scratch',
        question: 'Group a list of strings by their length using Collectors.groupingBy',
        starterCode: `List<String> words = Arrays.asList("a", "bb", "ccc", "dd", "eee");

// Group by length
Map<Integer, List<String>> grouped = words.stream()
    // Your code here
    
System.out.println(grouped);`,
        solution: `List<String> words = Arrays.asList("a", "bb", "ccc", "dd", "eee");

Map<Integer, List<String>> grouped = words.stream()
    .collect(Collectors.groupingBy(String::length));
    
System.out.println(grouped);`,
        testCases: [
            { description: 'Groups: {1=[a], 2=[bb, dd], 3=[ccc, eee]}' }
        ],
        hints: [
            'Use .collect(Collectors.groupingBy(...))',
            'Group by: String::length',
            'Returns Map<Integer, List<String>>'
        ],
        explanation: 'groupingBy() creates a Map where keys are the grouping criteria and values are lists of items.',
        realWorldContext: 'Grouping data: users by country, products by category, orders by status, etc.',
        xpReward: 40
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = javaTier3Intermediate;
}
