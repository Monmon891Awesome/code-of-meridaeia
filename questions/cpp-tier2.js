// C++ Tier 2: Object-Oriented Programming
// 15 Questions - Classes, Inheritance, Polymorphism

const cppTier2OOP = [
    // ========== SECTION 1: CLASSES ==========
    {
        id: 'cpp_t2_1',
        tier: 2,
        chapter: 2,
        category: 'cpp',
        difficulty: 'easy',
        topic: 'Classes',
        type: 'multiple-choice',
        question: 'What is the default access specifier for class members in C++?',
        options: ['public', 'private', 'protected', 'friend'],
        correctAnswer: 1,
        explanation: 'In C++, class members are private by default. In struct, they are public by default.',
        hints: ['Classes default to hiding their internals', 'struct vs class differs in default access'],
        xpReward: 10
    },
    {
        id: 'cpp_t2_2',
        tier: 2,
        chapter: 2,
        category: 'cpp',
        difficulty: 'easy',
        topic: 'Classes',
        type: 'code-typing',
        question: 'Complete the constructor definition for class Player',
        template: `class Player {
    int health;
public:
    Player(int h) : ___(h) {}
};`,
        blanks: [
            { position: 0, correctAnswer: 'health', alternatives: [] }
        ],
        explanation: 'The member initializer list uses : member(value) syntax to initialize class members.',
        hints: ['Initialize the member variable', 'Use the initializer list syntax'],
        xpReward: 15
    },
    {
        id: 'cpp_t2_3',
        tier: 2,
        chapter: 2,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Classes',
        type: 'output',
        question: 'What is the output?',
        code: `class Counter {
    static int count;
public:
    Counter() { count++; }
    static int getCount() { return count; }
};
int Counter::count = 0;

int main() {
    Counter a, b, c;
    cout << Counter::getCount();
}`,
        options: ['0', '1', '3', 'Error'],
        correctAnswer: 2,
        explanation: 'Static member count is shared by all instances. Each constructor increments it. After 3 objects, count = 3.',
        hints: ['Static members are shared across all instances', 'Each object construction calls the constructor'],
        xpReward: 20
    },
    {
        id: 'cpp_t2_4',
        tier: 2,
        chapter: 2,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Classes',
        type: 'multiple-choice',
        question: 'What is the purpose of a destructor?',
        options: [
            'To create a copy of an object',
            'To initialize object members',
            'To clean up resources when an object is destroyed',
            'To prevent object creation'
        ],
        correctAnswer: 2,
        explanation: 'A destructor (~ClassName) is called when an object goes out of scope or is deleted. It releases resources like dynamic memory.',
        hints: ['Destructors are the opposite of constructors', 'They clean up what constructors set up'],
        xpReward: 15
    },
    {
        id: 'cpp_t2_5',
        tier: 2,
        chapter: 2,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Classes',
        type: 'fix-bug',
        question: 'Fix the memory leak in this class',
        brokenCode: `class Buffer {
    int* data;
public:
    Buffer(int size) {
        data = new int[size];
    }
    // Missing something important!
};`,
        errorLine: 7,
        errorMessage: 'Class allocates memory but never frees it',
        correctCode: `class Buffer {
    int* data;
public:
    Buffer(int size) {
        data = new int[size];
    }
    ~Buffer() {
        delete[] data;
    }
};`,
        explanation: 'When a class allocates memory with new[], it needs a destructor with delete[] to prevent leaks.',
        hints: ['What cleans up when an object is destroyed?', 'Match new[] with delete[]'],
        xpReward: 25
    },

    // ========== SECTION 2: INHERITANCE ==========
    {
        id: 'cpp_t2_6',
        tier: 2,
        chapter: 2,
        category: 'cpp',
        difficulty: 'easy',
        topic: 'Inheritance',
        type: 'multiple-choice',
        question: 'What keyword is used for inheritance in C++?',
        options: ['extends', 'inherits', ': (colon)', 'implements'],
        correctAnswer: 2,
        explanation: 'C++ uses the colon : for inheritance: class Derived : public Base {}',
        hints: ['Different from Java/C#', 'It uses punctuation, not a keyword'],
        xpReward: 10
    },
    {
        id: 'cpp_t2_7',
        tier: 2,
        chapter: 2,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Inheritance',
        type: 'output',
        question: 'What is the output?',
        code: `class Animal {
public:
    Animal() { cout << "A"; }
};
class Dog : public Animal {
public:
    Dog() { cout << "D"; }
};

int main() {
    Dog d;
}`,
        options: ['D', 'A', 'AD', 'DA'],
        correctAnswer: 2,
        explanation: 'Base class constructor runs before derived class constructor. Animal() prints A, then Dog() prints D.',
        hints: ['Parent constructors run first', 'Follow the inheritance chain upward'],
        xpReward: 20
    },
    {
        id: 'cpp_t2_8',
        tier: 2,
        chapter: 2,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Inheritance',
        type: 'multiple-choice',
        question: 'What is the difference between public, protected, and private inheritance?',
        options: [
            'They are all the same',
            'They control how base class members are accessible in the derived class',
            'They determine the order of constructor calls',
            'They only affect static members'
        ],
        correctAnswer: 1,
        explanation: 'Public inheritance: base public→derived public, protected→protected. Protected: both become protected. Private: both become private.',
        hints: ['Inheritance mode affects member visibility', 'Public inheritance is most common (is-a relationship)'],
        xpReward: 15
    },
    {
        id: 'cpp_t2_9',
        tier: 2,
        chapter: 2,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Inheritance',
        type: 'code-typing',
        question: 'Complete the public inheritance',
        template: `class Enemy __ public Character {
    // Enemy inherits from Character
};`,
        blanks: [
            { position: 0, correctAnswer: ':', alternatives: [] }
        ],
        explanation: 'Use colon followed by access specifier and base class name for inheritance.',
        hints: ['What syntax does C++ use for inheritance?'],
        xpReward: 15
    },

    // ========== SECTION 3: POLYMORPHISM ==========
    {
        id: 'cpp_t2_10',
        tier: 2,
        chapter: 2,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Polymorphism',
        type: 'multiple-choice',
        question: 'What does the "virtual" keyword enable?',
        options: [
            'Static method calls',
            'Runtime polymorphism - derived class methods called via base pointer',
            'Compile-time optimization',
            'Multiple return values'
        ],
        correctAnswer: 1,
        explanation: 'Virtual functions enable dynamic dispatch - the actual method called is determined at runtime based on the object type, not the pointer type.',
        hints: ['virtual enables late binding', 'It allows method overriding to work through base pointers'],
        xpReward: 15
    },
    {
        id: 'cpp_t2_11',
        tier: 2,
        chapter: 2,
        category: 'cpp',
        difficulty: 'hard',
        topic: 'Polymorphism',
        type: 'output',
        question: 'What is the output?',
        code: `class Base {
public:
    virtual void show() { cout << "Base "; }
};
class Derived : public Base {
public:
    void show() override { cout << "Derived "; }
};

int main() {
    Base* ptr = new Derived();
    ptr->show();
    Base obj = *ptr;
    obj.show();
}`,
        options: ['Base Base', 'Derived Derived', 'Derived Base', 'Base Derived'],
        correctAnswer: 2,
        explanation: 'First call: virtual dispatch uses Derived::show(). Second call: object slicing - copying to Base loses derived part, calls Base::show().',
        hints: ['virtual works through pointers/references', 'Object slicing occurs when copying to base type'],
        xpReward: 25
    },
    {
        id: 'cpp_t2_12',
        tier: 2,
        chapter: 2,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Polymorphism',
        type: 'multiple-choice',
        question: 'What is a pure virtual function?',
        code: 'virtual void draw() = 0;',
        options: [
            'A function that returns void',
            'A virtual function with no implementation that must be overridden',
            'A function that cannot be called',
            'A static function'
        ],
        correctAnswer: 1,
        explanation: 'A pure virtual function (= 0) has no implementation in the base class and makes the class abstract. Derived classes must override it.',
        hints: ['= 0 makes it "pure"', 'Creates an abstract class'],
        xpReward: 15
    },
    {
        id: 'cpp_t2_13',
        tier: 2,
        chapter: 2,
        category: 'cpp',
        difficulty: 'hard',
        topic: 'Polymorphism',
        type: 'fix-bug',
        question: 'Fix the undefined behavior in this code',
        brokenCode: `class Base {
public:
    ~Base() { cout << "Base destroyed"; }
};
class Derived : public Base {
    int* data;
public:
    Derived() { data = new int[100]; }
    ~Derived() { delete[] data; }
};

Base* ptr = new Derived();
delete ptr;  // Bug here!`,
        errorLine: 12,
        errorMessage: 'Derived destructor is not called',
        correctCode: `class Base {
public:
    virtual ~Base() { cout << "Base destroyed"; }
};
class Derived : public Base {
    int* data;
public:
    Derived() { data = new int[100]; }
    ~Derived() { delete[] data; }
};

Base* ptr = new Derived();
delete ptr;  // Now calls Derived destructor first`,
        explanation: 'When deleting through a base pointer, the destructor must be virtual to call the derived destructor. Otherwise, only Base destructor runs → memory leak.',
        hints: ['Destructors can be virtual too', 'Rule: if you have virtual functions, have virtual destructor'],
        xpReward: 30
    },

    // ========== SECTION 4: CONST & THIS ==========
    {
        id: 'cpp_t2_14',
        tier: 2,
        chapter: 2,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'Const Methods',
        type: 'multiple-choice',
        question: 'What does "const" after a method declaration mean?',
        code: 'int getValue() const;',
        options: [
            'The return value cannot be changed',
            'The method promises not to modify the object',
            'The method can only be called once',
            'The method runs faster'
        ],
        correctAnswer: 1,
        explanation: 'A const member function promises not to modify any member variables (except mutable ones). It can be called on const objects.',
        hints: ['const methods can be called on const objects', 'They cannot modify member variables'],
        xpReward: 15
    },
    {
        id: 'cpp_t2_15',
        tier: 2,
        chapter: 2,
        category: 'cpp',
        difficulty: 'medium',
        topic: 'This Pointer',
        type: 'multiple-choice',
        question: 'What is "this" in C++?',
        code: `class Player {
    int health;
public:
    void setHealth(int health) {
        this->health = health;
    }
};`,
        options: [
            'A keyword to create a new object',
            'A pointer to the current object',
            'A reference to the base class',
            'A static variable'
        ],
        correctAnswer: 1,
        explanation: '"this" is an implicit pointer to the current object. Used to distinguish member variables from parameters with the same name.',
        hints: ['this points to the object the method is called on', 'Useful when parameter names match member names'],
        xpReward: 15
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cppTier2OOP;
}
