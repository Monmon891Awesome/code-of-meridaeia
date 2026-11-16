// Marakathalessa Playable Character Questions
// Her corruption story - 12 questions (4 per chapter)

const marakathalessaQuestions = [
    // ============ CHAPTER 1: Before the Fall ============
    {
        id: 'mara_1',
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        type: 'story',
        question: 'In Java, what keyword is used to inherit from a parent class?',
        code: `// Marakathalessa was once a brilliant mage
// who studied under the Arcane Academy...
class Apprentice ??? MasterMage {
    // ...
}`,
        options: ['inherits', 'extends', 'implements', 'uses'],
        correctAnswer: 1,
        explanation: 'The "extends" keyword is used for class inheritance in Java. Young Marakathalessa extended her master\'s teachings...'
    },
    {
        id: 'mara_2',
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        type: 'story',
        question: 'What access modifier makes a method visible to all classes?',
        code: `// Her magical research was open to all
??? void shareKnowledge() {
    System.out.println("The light guides us.");
}`,
        options: ['private', 'protected', 'public', 'default'],
        correctAnswer: 2,
        explanation: 'The "public" modifier makes methods accessible from anywhere. Marakathalessa believed in open knowledge sharing.'
    },
    {
        id: 'mara_3',
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        type: 'story',
        question: 'In C++, what is the output?',
        code: `// Her hope was measureless
int hope = 100;
std::cout << "Hope level: " << hope << std::endl;`,
        options: ['Hope level: 100', '100', 'hope', 'Compilation error'],
        correctAnswer: 0,
        explanation: 'The stream operator << concatenates the strings and values. Her hope was 100% in those days.'
    },
    {
        id: 'mara_4',
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        type: 'story',
        question: 'What data structure uses FIFO (First In, First Out)?',
        code: `// The Academy processed students fairly
// The first to arrive would be the first to learn`,
        options: ['Stack', 'Queue', 'Tree', 'Graph'],
        correctAnswer: 1,
        explanation: 'A Queue uses FIFO ordering. The Academy\'s fair system would soon be corrupted...'
    },

    // ============ CHAPTER 2: The Corruption ============
    {
        id: 'mara_5',
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        type: 'story',
        question: 'What exception occurs when accessing a null object in Java?',
        code: `// The void whispered to her...
MasterMage teacher = null;
teacher.castSpell(); // ???`,
        options: ['ArrayIndexOutOfBoundsException', 'NullPointerException', 'ClassCastException', 'IOException'],
        correctAnswer: 1,
        explanation: 'NullPointerException occurs when calling methods on null. Her mentor had vanished into the void...'
    },
    {
        id: 'mara_6',
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        type: 'story',
        question: 'What is the result of this bitwise operation?',
        code: `// The corruption spread bit by bit
int light = 0b1111;  // 15
int darkness = 0b0101; // 5
int result = light ^ darkness; // XOR`,
        options: ['10', '5', '15', '20'],
        correctAnswer: 0,
        explanation: 'XOR returns 1 where bits differ (1111 ^ 0101 = 1010 = 10). Light and darkness merged into something new.'
    },
    {
        id: 'mara_7',
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        type: 'story',
        question: 'What happens to an infinite loop without break?',
        code: `// She was trapped in endless darkness
while(true) {
    despair++;
    // No break...
}`,
        options: ['Compiles but crashes', 'Runs forever until stopped', 'Compilation error', 'Returns 0'],
        correctAnswer: 1,
        explanation: 'An infinite loop runs forever. She was trapped in an endless cycle of despair...'
    },
    {
        id: 'mara_8',
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        type: 'story',
        question: 'What does a memory leak cause?',
        code: `// The darkness consumed more and more...
while(corruption) {
    void* memory = malloc(1024);
    // Never freed...
}`,
        options: ['Faster execution', 'Memory exhaustion', 'Better performance', 'Automatic cleanup'],
        correctAnswer: 1,
        explanation: 'Memory leaks cause memory exhaustion over time. The corruption consumed all of her light.'
    },

    // ============ CHAPTER 3: Legion\'s Pawn ============
    {
        id: 'mara_9',
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'hard',
        type: 'story',
        question: 'What HTTP status code means "Not Found"?',
        code: `// The Legion of 404 found her
// Their code was their name
// Status: ???`,
        options: ['200', '403', '404', '500'],
        correctAnswer: 2,
        explanation: '404 is "Not Found". The Legion of 404 corrupts and erases - making things "not found".'
    },
    {
        id: 'mara_10',
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'hard',
        type: 'story',
        question: 'What design pattern allows only one instance of a class?',
        code: `// The Legion Master - there can be only one
class LegionMaster {
    private static LegionMaster instance;
    private LegionMaster() {}
    // ???
}`,
        options: ['Factory', 'Singleton', 'Observer', 'Decorator'],
        correctAnswer: 1,
        explanation: 'The Singleton pattern ensures one instance. The Legion has but one true master...'
    },
    {
        id: 'mara_11',
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'hard',
        type: 'story',
        question: 'In cryptography, what attack tries all possible keys?',
        code: `// The Legion breaks all defenses
for(key = 0; key < MAX_KEY; key++) {
    if(decrypt(ciphertext, key)) break;
}`,
        options: ['SQL Injection', 'Brute Force', 'Man-in-the-Middle', 'Phishing'],
        correctAnswer: 1,
        explanation: 'Brute force tries all possible combinations. The Legion breaks through all barriers.'
    },
    {
        id: 'mara_12',
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'hard',
        type: 'story',
        question: 'What is the final output?',
        code: `// Her last words before full corruption...
String message = "I was once good";
message = message.replace("good", "404");
System.out.println(message);`,
        options: ['"I was once good"', '"I was once 404"', 'null', 'Error'],
        correctAnswer: 1,
        explanation: 'String.replace() substitutes text. "I was once 404" - the last trace of her humanity.'
    }
];
