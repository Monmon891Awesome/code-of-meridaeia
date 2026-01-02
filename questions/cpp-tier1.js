// C++ Tier 1: Foundations - Interactive Learning
// 15 Questions - Pointers, Arrays, Basic Memory

const cppTier1Foundations = [
    // ========== SECTION 1: POINTERS BASICS ==========
    {
        id: 'cpp_t1_1',
        tier: 1,
        chapter: 1,
        category: 'cpp',
        difficulty: 'easy',
        topic: 'Pointers',
        type: 'multiple-choice',
        question: 'What does a pointer store in C++?',
        options: [
            'The actual value of a variable',
            'The memory address of a variable',
            'The size of a variable',
            'The name of a variable'
        ],
        correctAnswer: 1,
        explanation: 'A pointer is a variable that stores the memory address of another variable. It "points to" where the data lives in memory.',
        hints: ['Think about what the * operator does', 'Pointers reference locations in memory'],
        realWorldContext: 'Pointers enable dynamic memory, linked lists, and direct hardware access.',
        xpReward: 10
    },
    {
        id: 'cpp_t1_2',
        tier: 1,
        chapter: 1,
        category: 'cpp',
        difficulty: 'easy',
        topic: 'Pointers',
        type: 'code-typing',
        question: 'Declare a pointer to an integer named "ptr"',
        template: '___ *ptr;',
        blanks: [
            { position: 0, correctAnswer: 'int', alternatives: [] }
        ],
        explanation: 'To declare a pointer, use the type followed by an asterisk (*) and the variable name.',
        hints: ['The type before * matches what it points to', 'int* and int * are equivalent'],
        realWorldContext: 'Pointer declarations are fundamental for dynamic memory allocation.',
        xpReward: 15
    },
    {
        id: 'cpp_t1_3',
        tier: 1,
        chapter: 1,
        category: 'cpp',
        difficulty: 'easy',
        topic: 'Pointers',
        type: 'multiple-choice',
        question: 'What does the & operator do when placed before a variable?',
        code: 'int x = 10;\nint* ptr = &x;',
        options: [
            'Multiplies x by a pointer',
            'Returns the memory address of x',
            'Returns the value at address x',
            'Creates a copy of x'
        ],
        correctAnswer: 1,
        explanation: 'The address-of operator (&) returns the memory address of a variable. Here, &x gives the address where 10 is stored.',
        hints: ['& is called the address-of operator', 'It gives you where the variable lives in memory'],
        xpReward: 10
    },
    {
        id: 'cpp_t1_4',
        tier: 1,
        chapter: 1,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Pointers',
        type: 'output',
        question: 'What is the output of this code?',
        code: `int x = 5;
int* ptr = &x;
*ptr = 10;
cout << x;`,
        options: ['5', '10', '0', 'Error'],
        correctAnswer: 1,
        explanation: 'ptr points to x. *ptr dereferences it, allowing us to modify x through the pointer. Setting *ptr = 10 changes x to 10.',
        hints: ['*ptr accesses the value ptr points to', 'Changing *ptr changes the original variable'],
        xpReward: 15
    },
    {
        id: 'cpp_t1_5',
        tier: 1,
        chapter: 1,
        category: 'cpp',
        difficulty: 'easy',
        topic: 'Pointers',
        type: 'code-typing',
        question: 'Dereference pointer ptr to get its value',
        template: 'int value = __ptr;',
        blanks: [
            { position: 0, correctAnswer: '*', alternatives: [] }
        ],
        explanation: 'The dereference operator (*) accesses the value at the address stored in the pointer.',
        hints: ['The * operator accesses what the pointer points to'],
        xpReward: 15
    },

    // ========== SECTION 2: ARRAYS ==========
    {
        id: 'cpp_t1_6',
        tier: 1,
        chapter: 1,
        category: 'cpp',
        difficulty: 'easy',
        topic: 'Arrays',
        type: 'multiple-choice',
        question: 'What is the index of the first element in a C++ array?',
        options: ['1', '0', '-1', 'It depends on the array'],
        correctAnswer: 1,
        explanation: 'C++ arrays are zero-indexed. The first element is at index 0, second at index 1, etc.',
        hints: ['Arrays start counting from zero'],
        xpReward: 10
    },
    {
        id: 'cpp_t1_7',
        tier: 1,
        chapter: 1,
        category: 'cpp',
        difficulty: 'easy',
        topic: 'Arrays',
        type: 'code-typing',
        question: 'Declare an integer array named "scores" with 5 elements',
        template: 'int scores[__];',
        blanks: [
            { position: 0, correctAnswer: '5', alternatives: [] }
        ],
        explanation: 'Array declaration: type name[size]. The size goes in square brackets.',
        hints: ['The number in brackets is the size', 'Arrays hold multiple values of the same type'],
        xpReward: 15
    },
    {
        id: 'cpp_t1_8',
        tier: 1,
        chapter: 1,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Arrays',
        type: 'output',
        question: 'What is the output?',
        code: `int arr[] = {10, 20, 30, 40};
cout << arr[2];`,
        options: ['10', '20', '30', '40'],
        correctAnswer: 2,
        explanation: 'arr[2] accesses the third element (index 2). The array is: arr[0]=10, arr[1]=20, arr[2]=30, arr[3]=40.',
        hints: ['Remember: arrays are zero-indexed', 'Count from 0: 0, 1, 2...'],
        xpReward: 15
    },
    {
        id: 'cpp_t1_9',
        tier: 1,
        chapter: 1,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Arrays & Pointers',
        type: 'multiple-choice',
        question: 'In C++, what is the relationship between arrays and pointers?',
        code: 'int arr[5];\n// arr is equivalent to...',
        options: [
            'Arrays and pointers are completely unrelated',
            'An array name decays to a pointer to its first element',
            'Pointers are just arrays with different syntax',
            'Arrays cannot be used with pointers'
        ],
        correctAnswer: 1,
        explanation: 'An array name, when used in most expressions, "decays" to a pointer to its first element. arr is equivalent to &arr[0].',
        hints: ['Array names can be used like pointers', 'arr and &arr[0] refer to the same address'],
        xpReward: 20
    },
    {
        id: 'cpp_t1_10',
        tier: 1,
        chapter: 1,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Arrays & Pointers',
        type: 'output',
        question: 'What is the output?',
        code: `int arr[] = {1, 2, 3, 4, 5};
int* ptr = arr;
cout << *(ptr + 2);`,
        options: ['1', '2', '3', '4'],
        correctAnswer: 2,
        explanation: 'ptr points to arr[0]. ptr + 2 points to arr[2]. Dereferencing gives 3. Pointer arithmetic moves by sizeof(int).',
        hints: ['ptr + 2 moves 2 elements forward', '*(ptr + 2) is equivalent to ptr[2]'],
        xpReward: 20
    },

    // ========== SECTION 3: REFERENCES ==========
    {
        id: 'cpp_t1_11',
        tier: 1,
        chapter: 1,
        category: 'cpp',
        difficulty: 'easy',
        topic: 'References',
        type: 'multiple-choice',
        question: 'What is a reference in C++?',
        options: [
            'A copy of a variable',
            'An alias (another name) for an existing variable',
            'A pointer that cannot be null',
            'A constant value'
        ],
        correctAnswer: 1,
        explanation: 'A reference is an alias for another variable. Once initialized, it always refers to the same variable.',
        hints: ['References use the & symbol in declarations', 'Unlike pointers, references cannot be reassigned'],
        xpReward: 10
    },
    {
        id: 'cpp_t1_12',
        tier: 1,
        chapter: 1,
        category: 'cpp',
        difficulty: 'easy',
        topic: 'References',
        type: 'code-typing',
        question: 'Create a reference named "ref" to integer variable x',
        template: 'int x = 5;\nint__ ref = x;',
        blanks: [
            { position: 0, correctAnswer: '&', alternatives: [] }
        ],
        explanation: 'References are declared with & after the type: int& ref = x; makes ref an alias for x.',
        hints: ['Use & after the type to declare a reference'],
        xpReward: 15
    },
    {
        id: 'cpp_t1_13',
        tier: 1,
        chapter: 1,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'References',
        type: 'output',
        question: 'What is the output?',
        code: `int a = 10;
int& ref = a;
ref = 20;
cout << a;`,
        options: ['10', '20', 'Error', 'Undefined'],
        correctAnswer: 1,
        explanation: 'ref is an alias for a. Modifying ref modifies a directly. Setting ref = 20 changes a to 20.',
        hints: ['References share the same memory as the original', 'Changing a reference changes the original'],
        xpReward: 15
    },

    // ========== SECTION 4: BASIC MEMORY ==========
    {
        id: 'cpp_t1_14',
        tier: 1,
        chapter: 1,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Dynamic Memory',
        type: 'multiple-choice',
        question: 'What does "new" do in C++?',
        code: 'int* ptr = new int(5);',
        options: [
            'Creates a new variable on the stack',
            'Allocates memory on the heap and returns a pointer',
            'Copies an existing variable',
            'Resets a pointer to null'
        ],
        correctAnswer: 1,
        explanation: '"new" allocates memory on the heap (dynamic memory) and returns a pointer to it. This memory persists until explicitly deleted.',
        hints: ['new allocates heap memory', 'Heap memory must be manually freed'],
        xpReward: 15
    },
    {
        id: 'cpp_t1_15',
        tier: 1,
        chapter: 1,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Dynamic Memory',
        type: 'fix-bug',
        question: 'Fix the memory leak in this code',
        brokenCode: `int* ptr = new int(10);
cout << *ptr;
// Memory leak here!`,
        errorLine: 3,
        errorMessage: 'Memory allocated with new is never freed',
        correctCode: `int* ptr = new int(10);
cout << *ptr;
delete ptr;`,
        explanation: 'Memory allocated with "new" must be freed with "delete" to prevent memory leaks.',
        hints: ['What keyword matches "new"?', 'Heap memory must be manually freed'],
        xpReward: 25
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cppTier1Foundations;
}
