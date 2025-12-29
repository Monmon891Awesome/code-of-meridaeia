// Marakathalessa Boss Fight Questions
// Code-typing challenges - type the answer instead of multiple choice
const bossQuestions = [
    {
        id: 'boss_1',
        difficulty: 'hard',
        question: 'What Java keyword prevents a class from being extended?',
        code: null,
        correctAnswer: 'final',
        acceptedAnswers: ['final'],
        hints: [
            'It\'s a single word modifier',
            'Think about preventing inheritance',
            'It rhymes with "vinyl"'
        ],
        explanation: 'The "final" keyword prevents class extension and method overriding.'
    },
    {
        id: 'boss_2',
        difficulty: 'hard',
        question: 'In C++, what operator is used to access a member through a pointer?',
        code: null,
        correctAnswer: '->',
        acceptedAnswers: ['->', '-> '],
        hints: [
            'It combines two characters',
            'Think dash and greater-than',
            'It looks like an arrow'
        ],
        explanation: 'The arrow operator (->) accesses members through a pointer.'
    },
    {
        id: 'boss_3',
        difficulty: 'hard',
        question: 'What is the output?',
        code: `int x = 5;
System.out.println(x++);`,
        correctAnswer: '5',
        acceptedAnswers: ['5'],
        hints: [
            'Post-increment returns THEN increments',
            'The ++ comes AFTER the variable',
            'It prints the original value'
        ],
        explanation: 'Post-increment (x++) returns the value before incrementing.'
    },
    {
        id: 'boss_4',
        difficulty: 'hard',
        question: 'What keyword creates a constant variable in JavaScript?',
        code: null,
        correctAnswer: 'const',
        acceptedAnswers: ['const'],
        hints: [
            'It\'s shorter than "constant"',
            'Five letters',
            'C-O-N-S-T'
        ],
        explanation: 'The "const" keyword declares a constant variable in JavaScript.'
    },
    {
        id: 'boss_5',
        difficulty: 'hard',
        question: 'What is the default port for HTTP?',
        code: null,
        correctAnswer: '80',
        acceptedAnswers: ['80', 'port 80'],
        hints: [
            'It\'s a two-digit number',
            'Less than 100',
            'Eight-zero'
        ],
        explanation: 'HTTP uses port 80 by default.'
    },
    {
        id: 'boss_6',
        difficulty: 'hard',
        question: 'What SQL keyword removes duplicate rows from results?',
        code: null,
        correctAnswer: 'DISTINCT',
        acceptedAnswers: ['distinct', 'DISTINCT'],
        hints: [
            'It means "unique"',
            'Opposite of repeated',
            'D-I-S-T-I-N-C-T'
        ],
        explanation: 'DISTINCT removes duplicate rows from query results.'
    },
    {
        id: 'boss_7',
        difficulty: 'hard',
        question: 'What is the output?',
        code: `printf("%d", sizeof(char));`,
        correctAnswer: '1',
        acceptedAnswers: ['1'],
        hints: [
            'char is the smallest integer type',
            'It\'s always this size by definition',
            'One byte'
        ],
        explanation: 'sizeof(char) is always 1 byte by C standard definition.'
    },
    {
        id: 'boss_8',
        difficulty: 'hard',
        question: 'What exception is thrown when dividing by zero in Java (integers)?',
        code: null,
        correctAnswer: 'ArithmeticException',
        acceptedAnswers: ['ArithmeticException', 'arithmetic exception', 'arithmeticexception'],
        hints: [
            'It\'s related to math operations',
            'Arithmetic + Exception',
            'First word: Arithmetic'
        ],
        explanation: 'Integer division by zero throws ArithmeticException in Java.'
    },
    {
        id: 'boss_9',
        difficulty: 'hard',
        question: 'What Linux command shows current working directory?',
        code: null,
        correctAnswer: 'pwd',
        acceptedAnswers: ['pwd'],
        hints: [
            'Three letters',
            'Print Working Directory',
            'P-W-D'
        ],
        explanation: 'pwd (Print Working Directory) shows the current directory path.'
    },
    {
        id: 'boss_10',
        difficulty: 'hard',
        question: 'What is the time complexity of binary search?',
        code: null,
        correctAnswer: 'O(log n)',
        acceptedAnswers: ['O(log n)', 'o(log n)', 'O(logn)', 'o(logn)', 'log n', 'logn'],
        hints: [
            'It halves the search space each time',
            'Logarithmic time',
            'Big O of log n'
        ],
        explanation: 'Binary search has O(log n) time complexity.'
    }
];
