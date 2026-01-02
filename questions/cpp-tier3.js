// C++ Tier 3: Modern C++ & STL
// 15 Questions - Smart Pointers, Containers, Templates

const cppTier3Modern = [
    // ========== SECTION 1: SMART POINTERS ==========
    {
        id: 'cpp_t3_1',
        tier: 3,
        chapter: 3,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Smart Pointers',
        type: 'multiple-choice',
        question: 'What is the main advantage of unique_ptr over raw pointers?',
        options: [
            'unique_ptr is faster',
            'unique_ptr automatically deletes memory when it goes out of scope',
            'unique_ptr can point to multiple objects',
            'unique_ptr uses less memory'
        ],
        correctAnswer: 1,
        explanation: 'unique_ptr implements RAII - it automatically calls delete when the pointer goes out of scope, preventing memory leaks.',
        hints: ['RAII = Resource Acquisition Is Initialization', 'Automatic cleanup on scope exit'],
        xpReward: 15
    },
    {
        id: 'cpp_t3_2',
        tier: 3,
        chapter: 3,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Smart Pointers',
        type: 'code-typing',
        question: 'Create a unique_ptr to a new integer with value 42',
        template: `auto ptr = std::make_____<int>(42);`,
        blanks: [
            { position: 0, correctAnswer: 'unique', alternatives: [] }
        ],
        explanation: 'std::make_unique<T>(args) creates a unique_ptr safely and efficiently.',
        hints: ['make_unique is the preferred way to create unique_ptr', 'Added in C++14'],
        xpReward: 20
    },
    {
        id: 'cpp_t3_3',
        tier: 3,
        chapter: 3,
        category: 'cpp',
        difficulty: 'hard',
        topic: 'Smart Pointers',
        type: 'output',
        question: 'What is the output?',
        code: `auto p1 = std::make_unique<int>(10);
auto p2 = std::move(p1);
if (p1) cout << "p1 valid ";
if (p2) cout << "p2 valid";`,
        options: ['p1 valid p2 valid', 'p1 valid', 'p2 valid', 'Neither'],
        correctAnswer: 2,
        explanation: 'std::move transfers ownership from p1 to p2. After move, p1 is nullptr (invalid), p2 owns the memory.',
        hints: ['unique_ptr cannot be copied, only moved', 'After move, source becomes null'],
        xpReward: 25
    },
    {
        id: 'cpp_t3_4',
        tier: 3,
        chapter: 3,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Smart Pointers',
        type: 'multiple-choice',
        question: 'When should you use shared_ptr instead of unique_ptr?',
        options: [
            'When you need faster performance',
            'When multiple owners need to share ownership of the same resource',
            'When you don\'t care about memory management',
            'shared_ptr should always be used'
        ],
        correctAnswer: 1,
        explanation: 'shared_ptr uses reference counting to allow multiple owners. The resource is deleted when the last owner releases it.',
        hints: ['shared = multiple owners', 'unique = single owner'],
        xpReward: 15
    },
    {
        id: 'cpp_t3_5',
        tier: 3,
        chapter: 3,
        category: 'cpp',
        difficulty: 'hard',
        topic: 'Smart Pointers',
        type: 'multiple-choice',
        question: 'What problem does weak_ptr solve?',
        code: `class A { shared_ptr<B> b; };
class B { shared_ptr<A> a; };`,
        options: [
            'Memory fragmentation',
            'Circular references causing memory leaks',
            'Thread safety issues',
            'Slow allocation'
        ],
        correctAnswer: 1,
        explanation: 'Circular references with shared_ptr create a reference count that never reaches zero. weak_ptr breaks the cycle by not contributing to the reference count.',
        hints: ['A→B→A creates a cycle', 'weak_ptr observes without owning'],
        xpReward: 25
    },

    // ========== SECTION 2: STL CONTAINERS ==========
    {
        id: 'cpp_t3_6',
        tier: 3,
        chapter: 3,
        category: 'cpp',
        difficulty: 'easy',
        topic: 'STL Containers',
        type: 'multiple-choice',
        question: 'Which STL container provides O(1) random access?',
        options: ['list', 'set', 'vector', 'map'],
        correctAnswer: 2,
        explanation: 'vector stores elements contiguously in memory, enabling O(1) random access by index. list is O(n), set/map are O(log n).',
        hints: ['Random access means arr[i]', 'Contiguous memory = fast indexing'],
        xpReward: 10
    },
    {
        id: 'cpp_t3_7',
        tier: 3,
        chapter: 3,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'STL Containers',
        type: 'output',
        question: 'What is the output?',
        code: `vector<int> v = {1, 2, 3, 4, 5};
v.erase(v.begin() + 2);
v.push_back(6);
cout << v.size() << " " << v[2];`,
        options: ['5 3', '5 4', '6 4', '6 6'],
        correctAnswer: 1,
        explanation: 'erase removes element at index 2 (value 3). Vector becomes {1,2,4,5}. push_back adds 6: {1,2,4,5,6}. Size=5, v[2]=4.',
        hints: ['erase removes one element', 'Elements shift left after erase'],
        xpReward: 20
    },
    {
        id: 'cpp_t3_8',
        tier: 3,
        chapter: 3,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'STL Containers',
        type: 'multiple-choice',
        question: 'What happens when you access a non-existent key in std::map with operator[]?',
        code: `map<string, int> m;
cout << m["missing"];`,
        options: [
            'Exception is thrown',
            'Returns undefined value',
            'Inserts the key with default value (0 for int)',
            'Returns -1'
        ],
        correctAnswer: 2,
        explanation: 'operator[] on map inserts a default-constructed value if the key doesn\'t exist. Use .at() to throw an exception instead.',
        hints: ['map[] has insert behavior', 'This is a common gotcha!'],
        xpReward: 20
    },
    {
        id: 'cpp_t3_9',
        tier: 3,
        chapter: 3,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'STL Containers',
        type: 'code-typing',
        question: 'Complete the range-based for loop',
        template: `vector<int> nums = {1, 2, 3};
___ (auto& n : nums) {
    n *= 2;
}`,
        blanks: [
            { position: 0, correctAnswer: 'for', alternatives: [] }
        ],
        explanation: 'Range-based for loops use the syntax: for (auto& elem : container). The & allows modification.',
        hints: ['Modern C++ loop syntax', 'Use & to modify elements'],
        xpReward: 15
    },
    {
        id: 'cpp_t3_10',
        tier: 3,
        chapter: 3,
        category: 'cpp',
        difficulty: 'hard',
        topic: 'STL Containers',
        type: 'multiple-choice',
        question: 'What is the time complexity of inserting at the beginning of std::vector vs std::list?',
        options: [
            'Both O(1)',
            'vector O(1), list O(n)',
            'vector O(n), list O(1)',
            'Both O(n)'
        ],
        correctAnswer: 2,
        explanation: 'vector must shift all elements right, making it O(n). list just updates pointers, O(1). But vector is often faster due to cache locality.',
        hints: ['vector is contiguous, list is linked', 'Shifting elements is expensive'],
        xpReward: 20
    },

    // ========== SECTION 3: TEMPLATES ==========
    {
        id: 'cpp_t3_11',
        tier: 3,
        chapter: 3,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Templates',
        type: 'multiple-choice',
        question: 'What is a function template?',
        code: `template<typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}`,
        options: [
            'A function that only works with templates',
            'A blueprint that generates type-specific functions at compile time',
            'A runtime-generated function',
            'A function pointer'
        ],
        correctAnswer: 1,
        explanation: 'Templates are compile-time blueprints. The compiler generates specific versions (instantiations) for each type used.',
        hints: ['Template = generic programming', 'Instantiated at compile time'],
        xpReward: 15
    },
    {
        id: 'cpp_t3_12',
        tier: 3,
        chapter: 3,
        category: 'cpp',
        difficulty: 'hard',
        topic: 'Templates',
        type: 'output',
        question: 'What is the output?',
        code: `template<typename T>
T add(T a, T b) { return a + b; }

int main() {
    cout << add(3, 4) << " ";
    cout << add(3.5, 2.5) << " ";
    cout << add<int>(3.9, 2.1);
}`,
        options: ['7 6 6', '7 6.0 5', '7 6 5', '7 6.0 6'],
        correctAnswer: 2,
        explanation: 'First: int + int = 7. Second: double + double = 6. Third: explicitly int, so 3.9→3 and 2.1→2, result = 5.',
        hints: ['Type deduction happens automatically', 'Explicit type overrides deduction'],
        xpReward: 25
    },
    {
        id: 'cpp_t3_13',
        tier: 3,
        chapter: 3,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Templates',
        type: 'code-typing',
        question: 'Complete the template declaration',
        template: `_____<typename T>
class Stack {
    T* data;
};`,
        blanks: [
            { position: 0, correctAnswer: 'template', alternatives: [] }
        ],
        explanation: 'Class templates start with template<typename T> (or template<class T>).',
        hints: ['template keyword begins template definitions'],
        xpReward: 15
    },

    // ========== SECTION 4: LAMBDA & AUTO ==========
    {
        id: 'cpp_t3_14',
        tier: 3,
        chapter: 3,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Lambdas',
        type: 'multiple-choice',
        question: 'What does [&] mean in a lambda capture?',
        code: `int x = 5;
auto f = [&]() { return x * 2; };`,
        options: [
            'Capture nothing',
            'Capture all variables by value',
            'Capture all variables by reference',
            'Return a reference'
        ],
        correctAnswer: 2,
        explanation: '[&] captures all used variables by reference. [=] captures by value. [x] captures only x. [] captures nothing.',
        hints: ['& means reference in most C++ contexts', 'Capture clause is in square brackets'],
        xpReward: 20
    },
    {
        id: 'cpp_t3_15',
        tier: 3,
        chapter: 3,
        category: 'cpp',
        difficulty: 'hard',
        topic: 'Lambdas',
        type: 'output',
        question: 'What is the output?',
        code: `vector<int> v = {3, 1, 4, 1, 5};
sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;
});
cout << v[0] << " " << v[4];`,
        options: ['1 5', '5 1', '1 1', '5 5'],
        correctAnswer: 1,
        explanation: 'The lambda returns a > b, which sorts in descending order. After sort: {5,4,3,1,1}. v[0]=5, v[4]=1.',
        hints: ['Custom comparator defines sort order', 'a > b means descending'],
        xpReward: 25
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cppTier3Modern;
}
