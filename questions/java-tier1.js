// Java Tier 1: Foundations - Interactive Learning (Revised)
// 5 Concept Questions + 10 Hands-On Coding Exercises

const javaTier1Interactive = [
    // ========== SECTION 1: VARIABLES & DATA TYPES ==========

    // CONCEPT QUESTION 1
    {
        id: 'java_t1_concept_1',
        tier: 1,
        chapter: 1,
        category: 'java',
        difficulty: 'easy',
        topic: 'Variables & Data Types',
        type: 'multiple-choice',
        question: 'What is a variable in Java?',
        options: [
            'A container that stores data values',
            'A type of loop',
            'A method that returns values',
            'A class definition'
        ],
        correctAnswer: 0,
        explanation: 'A variable is like a labeled box that holds data. You can store numbers, text, or other values in it and use them throughout your program.',
        hints: [
            'Think of it as a storage container',
            'It holds values that can change'
        ],
        realWorldContext: 'Variables are everywhere in programming: storing user names, shopping cart totals, game scores, etc.',
        xpReward: 10
    },

    // CODING EXERCISE 1: Type it
    {
        id: 'java_t1_code_1',
        tier: 1,
        chapter: 1,
        category: 'java',
        difficulty: 'easy',
        topic: 'Variables & Data Types',
        type: 'code-typing',
        question: 'Declare an integer variable named "score" with the value 100',
        template: '___ score = ___;',
        blanks: [
            { position: 0, correctAnswer: 'int', alternatives: [] },
            { position: 1, correctAnswer: '100', alternatives: [] }
        ],
        explanation: 'In Java, we use "int" to declare integer variables. The syntax is: int variableName = value;',
        hints: [
            'Use the "int" keyword for integers',
            'Don\'t forget the semicolon at the end'
        ],
        realWorldContext: 'You\'ll use int variables to store game scores, user ages, item quantities, etc.',
        xpReward: 15
    },

    // CODING EXERCISE 2: Type it
    {
        id: 'java_t1_code_2',
        tier: 1,
        chapter: 1,
        category: 'java',
        difficulty: 'easy',
        topic: 'Variables & Data Types',
        type: 'code-typing',
        question: 'Declare a String variable named "name" with the value "Alice"',
        template: '___ name = "__";',
        blanks: [
            { position: 0, correctAnswer: 'String', alternatives: [] },
            { position: 1, correctAnswer: 'Alice', alternatives: [] }
        ],
        explanation: 'String is used for text. Note the capital S! String values must be in double quotes.',
        hints: [
            'String starts with a capital S',
            'Text values go in double quotes'
        ],
        realWorldContext: 'Strings store usernames, email addresses, product names, messages, etc.',
        xpReward: 15
    },

    // CODING EXERCISE 3: Fix the bug
    {
        id: 'java_t1_code_3',
        tier: 1,
        chapter: 1,
        category: 'java',
        difficulty: 'easy',
        topic: 'Variables & Data Types',
        type: 'fix-bug',
        question: 'Fix the syntax error in this code',
        brokenCode: `int age = 25
System.out.println(age);`,
        errorLine: 1,
        errorMessage: 'Missing semicolon',
        correctCode: `int age = 25;
System.out.println(age);`,
        explanation: 'Every statement in Java must end with a semicolon (;). This is one of the most common beginner mistakes!',
        hints: [
            'Look at the end of line 1',
            'Every Java statement needs a semicolon'
        ],
        realWorldContext: 'Forgetting semicolons is the #1 syntax error. Your IDE will help catch these!',
        xpReward: 20
    },

    // ========== SECTION 2: CONTROL FLOW ==========

    // CONCEPT QUESTION 2
    {
        id: 'java_t1_concept_2',
        tier: 1,
        chapter: 1,
        category: 'java',
        difficulty: 'easy',
        topic: 'Control Flow',
        type: 'multiple-choice',
        question: 'What does an if-else statement do?',
        options: [
            'Makes decisions based on conditions',
            'Repeats code multiple times',
            'Declares variables',
            'Defines methods'
        ],
        correctAnswer: 0,
        explanation: 'If-else statements let your program make decisions. If a condition is true, do one thing; otherwise, do something else.',
        hints: [
            'Think about making choices',
            'It checks if something is true or false'
        ],
        realWorldContext: 'Used for: checking if user is logged in, validating passwords, granting permissions, etc.',
        xpReward: 10
    },

    // CODING EXERCISE 4: Complete the code
    {
        id: 'java_t1_code_4',
        tier: 1,
        chapter: 1,
        category: 'java',
        difficulty: 'easy',
        topic: 'Control Flow',
        type: 'code-completion',
        question: 'Complete this if-else statement to check if a number is positive',
        template: `int number = 10;
if (number __ 0) {
    System.out.println("Positive");
} else {
    System.out.println("Not positive");
}`,
        blanks: [
            { position: 0, correctAnswer: '>', alternatives: ['>='] }
        ],
        explanation: 'The > operator checks if the left side is greater than the right side. number > 0 means "is number greater than zero?"',
        hints: [
            'Use the greater than operator',
            'Think: is number bigger than 0?'
        ],
        realWorldContext: 'Comparison operators are used in validation, filtering data, sorting, etc.',
        xpReward: 15
    },

    // CODING EXERCISE 5: Build from scratch
    {
        id: 'java_t1_code_5',
        tier: 1,
        chapter: 1,
        category: 'java',
        difficulty: 'easy',
        topic: 'Control Flow',
        type: 'build-from-scratch',
        question: 'Write a for loop that prints numbers from 1 to 5',
        starterCode: `// Write your for loop here
`,
        solution: `for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}`,
        testCases: [
            { description: 'Prints 1, 2, 3, 4, 5', output: ['1', '2', '3', '4', '5'] }
        ],
        hints: [
            'Start with: for (int i = 1; ...',
            'Loop while i <= 5',
            'Use System.out.println(i) to print'
        ],
        explanation: 'For loops have 3 parts: initialization (int i = 1), condition (i <= 5), and increment (i++)',
        realWorldContext: 'For loops process arrays, repeat operations, generate sequences, etc.',
        xpReward: 25
    },

    // ========== SECTION 3: METHODS ==========

    // CONCEPT QUESTION 3
    {
        id: 'java_t1_concept_3',
        tier: 1,
        chapter: 1,
        category: 'java',
        difficulty: 'easy',
        topic: 'Methods',
        type: 'multiple-choice',
        question: 'What is the purpose of a method in Java?',
        options: [
            'To organize reusable blocks of code',
            'To store data',
            'To create loops',
            'To declare variables'
        ],
        correctAnswer: 0,
        explanation: 'Methods are reusable blocks of code that perform specific tasks. Instead of writing the same code multiple times, you write it once in a method and call it whenever needed.',
        hints: [
            'Think about code reusability',
            'It\'s like a recipe you can use multiple times'
        ],
        realWorldContext: 'Methods are everywhere: calculateTotal(), sendEmail(), validatePassword(), etc.',
        xpReward: 10
    },

    // CODING EXERCISE 6: Type method signature
    {
        id: 'java_t1_code_6',
        tier: 1,
        chapter: 1,
        category: 'java',
        difficulty: 'easy',
        topic: 'Methods',
        type: 'code-typing',
        question: 'Complete the method signature for a method named "greet" that returns nothing and takes no parameters',
        template: 'public ___ void greet() {',
        blanks: [
            { position: 0, correctAnswer: 'static', alternatives: [] }
        ],
        explanation: 'The "static" keyword means the method belongs to the class itself, not to instances. "void" means it doesn\'t return anything.',
        hints: [
            'We need the "static" keyword',
            'Static methods can be called without creating objects'
        ],
        realWorldContext: 'The main method is static, and many utility methods are too.',
        xpReward: 15
    },

    // CODING EXERCISE 7: Build a method
    {
        id: 'java_t1_code_7',
        tier: 1,
        chapter: 1,
        category: 'java',
        difficulty: 'easy',
        topic: 'Methods',
        type: 'build-from-scratch',
        question: 'Write a method that takes two integers and returns their sum',
        starterCode: `public static int add(int a, int b) {
    // Your code here
    
}`,
        solution: `public static int add(int a, int b) {
    return a + b;
}`,
        testCases: [
            { input: [3, 5], expected: 8, description: 'add(3, 5) should return 8' },
            { input: [10, 20], expected: 30, description: 'add(10, 20) should return 30' },
            { input: [-5, 5], expected: 0, description: 'add(-5, 5) should return 0' }
        ],
        hints: [
            'Use the return keyword',
            'Add the two parameters: a + b',
            'return a + b;'
        ],
        explanation: 'Methods that return values use the "return" keyword followed by the value to return.',
        realWorldContext: 'Return values let methods give results back: calculatePrice(), getUserAge(), isValid(), etc.',
        xpReward: 25
    },

    // ========== SECTION 4: ARRAYS ==========

    // CONCEPT QUESTION 4
    {
        id: 'java_t1_concept_4',
        tier: 1,
        chapter: 1,
        category: 'java',
        difficulty: 'easy',
        topic: 'Arrays',
        type: 'multiple-choice',
        question: 'What is an array in Java?',
        options: [
            'A collection of elements of the same type',
            'A single variable',
            'A type of loop',
            'A method'
        ],
        correctAnswer: 0,
        explanation: 'An array is like a row of boxes, each holding a value of the same type. Arrays let you store multiple values in one variable.',
        hints: [
            'Think of a list of items',
            'All items must be the same type'
        ],
        realWorldContext: 'Arrays store: list of scores, user IDs, product prices, sensor readings, etc.',
        xpReward: 10
    },

    // CODING EXERCISE 8: Array declaration
    {
        id: 'java_t1_code_8',
        tier: 1,
        chapter: 1,
        category: 'java',
        difficulty: 'easy',
        topic: 'Arrays',
        type: 'code-typing',
        question: 'Declare an array of integers named "scores" with values 85, 90, 78',
        template: 'int[] scores = {__, __, __};',
        blanks: [
            { position: 0, correctAnswer: '85', alternatives: [] },
            { position: 1, correctAnswer: '90', alternatives: [] },
            { position: 2, correctAnswer: '78', alternatives: [] }
        ],
        explanation: 'Arrays are declared with type[], and values are listed in curly braces separated by commas.',
        hints: [
            'List the numbers separated by commas',
            'The syntax is: {85, 90, 78}'
        ],
        realWorldContext: 'This is how you initialize arrays with known values at creation time.',
        xpReward: 15
    },

    // CODING EXERCISE 9: Array access
    {
        id: 'java_t1_code_9',
        tier: 1,
        chapter: 1,
        category: 'java',
        difficulty: 'easy',
        topic: 'Arrays',
        type: 'code-completion',
        question: 'Access the third element of the array (value 30)',
        template: `int[] numbers = {10, 20, 30, 40};
int third = numbers[__];`,
        blanks: [
            { position: 0, correctAnswer: '2', alternatives: [] }
        ],
        explanation: 'Arrays are zero-indexed: first element is [0], second is [1], third is [2], etc.',
        hints: [
            'Arrays start counting from 0',
            'The third element is at index 2'
        ],
        realWorldContext: 'Understanding zero-indexing is crucial for avoiding ArrayIndexOutOfBoundsException.',
        xpReward: 15
    },

    // ========== SECTION 5: EXCEPTIONS ==========

    // CONCEPT QUESTION 5
    {
        id: 'java_t1_concept_5',
        tier: 1,
        chapter: 1,
        category: 'java',
        difficulty: 'easy',
        topic: 'Exceptions',
        type: 'multiple-choice',
        question: 'What is the purpose of try-catch blocks?',
        options: [
            'To handle errors without crashing the program',
            'To create loops',
            'To declare variables',
            'To define methods'
        ],
        correctAnswer: 0,
        explanation: 'Try-catch blocks let you handle errors gracefully. Code in "try" runs normally, but if an error occurs, "catch" handles it instead of crashing.',
        hints: [
            'Think about error handling',
            'It prevents crashes'
        ],
        realWorldContext: 'Essential for: handling network failures, file not found, invalid user input, database errors, etc.',
        xpReward: 10
    },

    // CODING EXERCISE 10: Write try-catch
    {
        id: 'java_t1_code_10',
        tier: 1,
        chapter: 1,
        category: 'java',
        difficulty: 'easy',
        topic: 'Exceptions',
        type: 'build-from-scratch',
        question: 'Wrap this code in a try-catch block to handle ArithmeticException',
        starterCode: `// Add try-catch around this code:
int result = 10 / 0;
System.out.println(result);`,
        solution: `try {
    int result = 10 / 0;
    System.out.println(result);
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
}`,
        testCases: [
            { description: 'Catches division by zero', expectsException: false }
        ],
        hints: [
            'Start with: try {',
            'Catch ArithmeticException',
            'Print an error message in catch block'
        ],
        explanation: 'Try-catch prevents crashes. The catch block runs when an exception occurs in the try block.',
        realWorldContext: 'Production code should always handle potential errors: network timeouts, file operations, parsing user input, etc.',
        xpReward: 25
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = javaTier1Interactive;
}
