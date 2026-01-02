// Java Tier 2: Fundamentals - OOP & Collections
// 5 Concept Questions + 10 Hands-On Coding Exercises

const javaTier2Fundamentals = [
    // ========== SECTION 1: OOP PRINCIPLES ==========

    // CONCEPT QUESTION 1
    {
        id: 'java_t2_concept_1',
        tier: 2,
        chapter: 2,
        category: 'java',
        difficulty: 'easy',
        topic: 'OOP Principles',
        type: 'multiple-choice',
        question: 'What is inheritance in Java?',
        options: [
            'A class acquiring properties and methods from another class',
            'Creating multiple instances of a class',
            'Hiding implementation details',
            'Grouping related classes together'
        ],
        correctAnswer: 0,
        explanation: 'Inheritance allows a class (child) to inherit fields and methods from another class (parent), promoting code reuse.',
        hints: [
            'Think about parent-child relationships',
            'It\'s about extending existing classes'
        ],
        realWorldContext: 'Example: Animal → Dog → Labrador. Each level inherits from the previous, adding specific features.',
        xpReward: 20
    },

    // CODING EXERCISE 1: Create a class
    {
        id: 'java_t2_code_1',
        tier: 2,
        chapter: 2,
        category: 'java',
        difficulty: 'easy',
        topic: 'OOP Principles',
        type: 'build-from-scratch',
        question: 'Create a class called "Person" with fields name and age, and a constructor',
        starterCode: `public class Person {
    // Add fields here
    
    // Add constructor here
    
}`,
        solution: `public class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}`,
        testCases: [
            { description: 'Has private String name field' },
            { description: 'Has private int age field' },
            { description: 'Has constructor with name and age parameters' }
        ],
        hints: [
            'Use private fields for encapsulation',
            'Constructor has same name as class',
            'Use "this" to refer to instance variables'
        ],
        explanation: 'Classes encapsulate data (fields) and behavior (methods). Constructors initialize objects.',
        realWorldContext: 'This is the foundation of OOP - creating objects to model real-world entities.',
        xpReward: 25
    },

    // CODING EXERCISE 2: Inheritance
    {
        id: 'java_t2_code_2',
        tier: 2,
        chapter: 2,
        category: 'java',
        difficulty: 'medium',
        topic: 'OOP Principles',
        type: 'code-typing',
        question: 'Make the Student class inherit from Person',
        template: `public class Student ___ Person {
    private String studentId;
    
    public Student(String name, int age, String studentId) {
        _____(name, age);
        this.studentId = studentId;
    }
}`,
        blanks: [
            { position: 0, correctAnswer: 'extends', alternatives: [] },
            { position: 1, correctAnswer: 'super', alternatives: [] }
        ],
        explanation: '"extends" creates inheritance. "super()" calls the parent constructor to initialize inherited fields.',
        hints: [
            'Use "extends" keyword for inheritance',
            'Call parent constructor with "super()"'
        ],
        realWorldContext: 'Inheritance reduces code duplication. Student inherits name/age from Person, adds studentId.',
        xpReward: 20
    },

    // ========== SECTION 2: COLLECTIONS FRAMEWORK ==========

    // CONCEPT QUESTION 2
    {
        id: 'java_t2_concept_2',
        tier: 2,
        chapter: 2,
        category: 'java',
        difficulty: 'easy',
        topic: 'Collections Framework',
        type: 'multiple-choice',
        question: 'What is the main difference between ArrayList and LinkedList?',
        options: [
            'ArrayList is faster for random access, LinkedList is faster for insertions/deletions',
            'ArrayList stores primitives, LinkedList stores objects',
            'ArrayList is synchronized, LinkedList is not',
            'There is no difference'
        ],
        correctAnswer: 0,
        explanation: 'ArrayList uses an array internally (fast random access). LinkedList uses nodes (fast insertions/deletions).',
        hints: [
            'Think about how they store data internally',
            'Consider access patterns vs modification patterns'
        ],
        realWorldContext: 'Use ArrayList for reading data frequently. Use LinkedList when inserting/removing items often.',
        xpReward: 20
    },

    // CODING EXERCISE 3: ArrayList operations
    {
        id: 'java_t2_code_3',
        tier: 2,
        chapter: 2,
        category: 'java',
        difficulty: 'easy',
        topic: 'Collections Framework',
        type: 'build-from-scratch',
        question: 'Create an ArrayList of Strings, add 3 names, then print the size',
        starterCode: `// Your code here
`,
        solution: `ArrayList<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.add("Charlie");
System.out.println(names.size());`,
        testCases: [
            { description: 'Creates ArrayList<String>', output: ['3'] },
            { description: 'Adds 3 elements' },
            { description: 'Prints size (3)' }
        ],
        hints: [
            'Import: ArrayList<String> names = new ArrayList<>()',
            'Use .add() to add elements',
            'Use .size() to get count'
        ],
        explanation: 'ArrayList is a resizable array. Generic <String> ensures type safety.',
        realWorldContext: 'ArrayLists are used for dynamic lists: shopping carts, user lists, search results, etc.',
        xpReward: 25
    },

    // CODING EXERCISE 4: HashMap
    {
        id: 'java_t2_code_4',
        tier: 2,
        chapter: 2,
        category: 'java',
        difficulty: 'medium',
        topic: 'Collections Framework',
        type: 'code-completion',
        question: 'Create a HashMap that stores student names (String) and their grades (Integer)',
        template: `HashMap<___, ___> grades = new HashMap<>();
grades.___(\"Alice\", 95);
grades.___(\"Bob\", 87);
System.out.println(grades.get(\"Alice\"));`,
        blanks: [
            { position: 0, correctAnswer: 'String', alternatives: [] },
            { position: 1, correctAnswer: 'Integer', alternatives: ['Int'] },
            { position: 2, correctAnswer: 'put', alternatives: [] },
            { position: 3, correctAnswer: 'put', alternatives: [] }
        ],
        explanation: 'HashMap stores key-value pairs. Use put() to add, get() to retrieve.',
        hints: [
            'HashMap<KeyType, ValueType>',
            'Use put(key, value) to add entries',
            'Keys are String, values are Integer'
        ],
        realWorldContext: 'HashMaps are perfect for lookups: user profiles, product catalogs, caches, etc.',
        xpReward: 20
    },

    // CODING EXERCISE 5: Iterating collections
    {
        id: 'java_t2_code_5',
        tier: 2,
        chapter: 2,
        category: 'java',
        difficulty: 'medium',
        topic: 'Collections Framework',
        type: 'build-from-scratch',
        question: 'Write a for-each loop to print all elements in a list',
        starterCode: `ArrayList<String> fruits = new ArrayList<>();
fruits.add("Apple");
fruits.add("Banana");
fruits.add("Orange");

// Write for-each loop here
`,
        solution: `ArrayList<String> fruits = new ArrayList<>();
fruits.add("Apple");
fruits.add("Banana");
fruits.add("Orange");

for (String fruit : fruits) {
    System.out.println(fruit);
}`,
        testCases: [
            { description: 'Prints Apple, Banana, Orange', output: ['Apple', 'Banana', 'Orange'] }
        ],
        hints: [
            'Syntax: for (Type item : collection)',
            'for (String fruit : fruits)',
            'Print each fruit inside the loop'
        ],
        explanation: 'For-each loops are cleaner for iterating collections when you don\'t need the index.',
        realWorldContext: 'Used everywhere: displaying search results, processing orders, rendering lists in UI.',
        xpReward: 25
    },

    // ========== SECTION 3: STRING MANIPULATION ==========

    // CONCEPT QUESTION 3
    {
        id: 'java_t2_concept_3',
        tier: 2,
        chapter: 2,
        category: 'java',
        difficulty: 'easy',
        topic: 'String Manipulation',
        type: 'multiple-choice',
        question: 'Why should you use StringBuilder instead of String concatenation in loops?',
        options: [
            'StringBuilder is mutable and more efficient for multiple modifications',
            'StringBuilder is thread-safe',
            'StringBuilder can store more characters',
            'There is no difference'
        ],
        correctAnswer: 0,
        explanation: 'Strings are immutable. Each concatenation creates a new String object. StringBuilder modifies in place, saving memory.',
        hints: [
            'Think about object creation',
            'Strings are immutable (can\'t be changed)'
        ],
        realWorldContext: 'In loops with 1000+ iterations, StringBuilder is 10-100x faster than String concatenation.',
        xpReward: 20
    },

    // CODING EXERCISE 6: String methods
    {
        id: 'java_t2_code_6',
        tier: 2,
        chapter: 2,
        category: 'java',
        difficulty: 'easy',
        topic: 'String Manipulation',
        type: 'code-typing',
        question: 'Convert a string to uppercase and check if it contains "JAVA"',
        template: `String text = "I love java programming";
String upper = text.___();
boolean hasJava = upper.___(\"JAVA\");`,
        blanks: [
            { position: 0, correctAnswer: 'toUpperCase', alternatives: [] },
            { position: 1, correctAnswer: 'contains', alternatives: [] }
        ],
        explanation: 'toUpperCase() converts to uppercase. contains() checks if a substring exists.',
        hints: [
            'Method to convert to uppercase?',
            'Method to check if string contains substring?'
        ],
        realWorldContext: 'Used for case-insensitive searches, validation, text processing.',
        xpReward: 20
    },

    // CODING EXERCISE 7: StringBuilder
    {
        id: 'java_t2_code_7',
        tier: 2,
        chapter: 2,
        category: 'java',
        difficulty: 'medium',
        topic: 'String Manipulation',
        type: 'build-from-scratch',
        question: 'Use StringBuilder to build a string "1,2,3,4,5" from numbers 1 to 5',
        starterCode: `StringBuilder sb = new StringBuilder();
// Your code here

System.out.println(sb.toString());`,
        solution: `StringBuilder sb = new StringBuilder();
for (int i = 1; i <= 5; i++) {
    sb.append(i);
    if (i < 5) {
        sb.append(",");
    }
}
System.out.println(sb.toString());`,
        testCases: [
            { description: 'Outputs: 1,2,3,4,5', output: ['1,2,3,4,5'] }
        ],
        hints: [
            'Use a for loop from 1 to 5',
            'Use sb.append() to add numbers',
            'Add comma between numbers (but not after last)'
        ],
        explanation: 'StringBuilder.append() adds to the end. toString() converts to String.',
        realWorldContext: 'Building CSV files, JSON strings, SQL queries, HTML, etc.',
        xpReward: 30
    },

    // ========== SECTION 4: FILE I/O ==========

    // CONCEPT QUESTION 4
    {
        id: 'java_t2_concept_4',
        tier: 2,
        chapter: 2,
        category: 'java',
        difficulty: 'easy',
        topic: 'File I/O',
        type: 'multiple-choice',
        question: 'Which class is commonly used to read text files line by line?',
        options: [
            'FileInputStream',
            'BufferedReader',
            'Scanner',
            'Both B and C'
        ],
        correctAnswer: 3,
        explanation: 'Both BufferedReader and Scanner can read files line by line. BufferedReader is faster, Scanner is more convenient.',
        hints: [
            'Think about reading text efficiently',
            'Two common options for line-by-line reading'
        ],
        realWorldContext: 'Reading config files, logs, CSV data, user uploads, etc.',
        xpReward: 20
    },

    // CODING EXERCISE 8: Reading files
    {
        id: 'java_t2_code_8',
        tier: 2,
        chapter: 2,
        category: 'java',
        difficulty: 'medium',
        topic: 'File I/O',
        type: 'code-typing',
        question: 'Complete the code to read a file using BufferedReader',
        template: `try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
    String line;
    while ((line = br.___()) != null) {
        System.out.println(line);
    }
} catch (___ e) {
    e.printStackTrace();
}`,
        blanks: [
            { position: 0, correctAnswer: 'readLine', alternatives: [] },
            { position: 1, correctAnswer: 'IOException', alternatives: ['Exception'] }
        ],
        explanation: 'readLine() reads one line. Try-with-resources automatically closes the file. IOException handles file errors.',
        hints: [
            'Method to read one line?',
            'What exception type for file operations?'
        ],
        realWorldContext: 'Reading configuration files, processing logs, importing data.',
        xpReward: 25
    },

    // ========== SECTION 5: GENERICS ==========

    // CONCEPT QUESTION 5
    {
        id: 'java_t2_concept_5',
        tier: 2,
        chapter: 2,
        category: 'java',
        difficulty: 'easy',
        topic: 'Generics',
        type: 'multiple-choice',
        question: 'What is the benefit of using generics in Java?',
        options: [
            'Type safety at compile time',
            'Faster execution',
            'Less memory usage',
            'Easier syntax'
        ],
        correctAnswer: 0,
        explanation: 'Generics provide compile-time type checking, preventing ClassCastException at runtime.',
        hints: [
            'Think about catching errors early',
            'It\'s about type safety'
        ],
        realWorldContext: 'ArrayList<String> ensures you can\'t accidentally add an Integer, catching bugs at compile time.',
        xpReward: 20
    },

    // CODING EXERCISE 9: Generic method
    {
        id: 'java_t2_code_9',
        tier: 2,
        chapter: 2,
        category: 'java',
        difficulty: 'medium',
        topic: 'Generics',
        type: 'build-from-scratch',
        question: 'Write a generic method that prints any type of array',
        starterCode: `public static <___> void printArray(___ array) {
    // Your code here
    
}`,
        solution: `public static <T> void printArray(T[] array) {
    for (T element : array) {
        System.out.println(element);
    }
}`,
        testCases: [
            { description: 'Works with Integer[]' },
            { description: 'Works with String[]' },
            { description: 'Prints all elements' }
        ],
        hints: [
            'Use <T> for generic type parameter',
            'Parameter type is T[]',
            'Use for-each loop to print'
        ],
        explanation: '<T> declares a type parameter. The method works with any object type.',
        realWorldContext: 'Generic methods work with any type: sorting, searching, filtering, etc.',
        xpReward: 30
    },

    // CODING EXERCISE 10: Generic class
    {
        id: 'java_t2_code_10',
        tier: 2,
        chapter: 2,
        category: 'java',
        difficulty: 'medium',
        topic: 'Generics',
        type: 'code-typing',
        question: 'Complete this generic Box class that can hold any type',
        template: `public class Box<___> {
    private ___ item;
    
    public void set(___ item) {
        this.item = item;
    }
    
    public ___ get() {
        return item;
    }
}`,
        blanks: [
            { position: 0, correctAnswer: 'T', alternatives: [] },
            { position: 1, correctAnswer: 'T', alternatives: [] },
            { position: 2, correctAnswer: 'T', alternatives: [] },
            { position: 3, correctAnswer: 'T', alternatives: [] }
        ],
        explanation: 'Generic classes use type parameters (T) that are specified when creating instances: Box<String>, Box<Integer>.',
        hints: [
            'Use T as the type parameter',
            'Replace all specific types with T'
        ],
        realWorldContext: 'Generic classes are everywhere: Optional<T>, List<T>, Map<K,V>, etc.',
        xpReward: 25
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = javaTier2Fundamentals;
}
