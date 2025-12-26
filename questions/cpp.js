// C++ Questions - Intermediate Level
const cppQuestions = [
    {
        id: 'cpp_1',
        category: 'cpp',
        difficulty: 'medium',
        type: 'output',
        question: 'What is the output of this C++ code?',
        code: `#include <iostream>
using namespace std;

int main() {
    int arr[] = {10, 20, 30};
    int* ptr = arr;
    cout << *ptr << " ";
    ptr++;
    cout << *ptr << " ";
    cout << *(ptr + 1);
    return 0;
}`,
        options: [
            '10 20 30',
            '10 11 12',
            '10 20 21',
            'Undefined behavior'
        ],
        correctAnswer: 0,
        explanation: 'ptr starts at arr[0]=10. After ptr++, it points to arr[1]=20. ptr+1 then points to arr[2]=30. Pointer arithmetic moves by sizeof(int).'
    },
    {
        id: 'cpp_2',
        category: 'cpp',
        difficulty: 'hard',
        type: 'concept',
        question: 'What is the Rule of Three in C++?',
        code: null,
        options: [
            'A class should have at most 3 methods',
            'If you define destructor, copy constructor, or copy assignment, define all three',
            'Objects should only be copied 3 times maximum',
            'A base class should have at most 3 derived classes'
        ],
        correctAnswer: 1,
        explanation: 'If a class manages resources (like dynamic memory), defining one of destructor, copy constructor, or copy assignment usually means you need all three to properly manage the resource.'
    },
    {
        id: 'cpp_3',
        category: 'cpp',
        difficulty: 'medium',
        type: 'output',
        question: 'What is the output?',
        code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3, 4, 5};
    v.erase(v.begin() + 2);
    v.push_back(6);
    cout << v.size() << " " << v[2];
    return 0;
}`,
        options: [
            '5 3',
            '5 4',
            '6 4',
            '6 6'
        ],
        correctAnswer: 1,
        explanation: 'After erasing element at index 2 (value 3), vector is {1,2,4,5}. After push_back(6), it\'s {1,2,4,5,6}. Size is 5, v[2] is 4.'
    },
    {
        id: 'cpp_4',
        category: 'cpp',
        difficulty: 'hard',
        type: 'bugfix',
        question: 'What is the memory issue in this code?',
        code: `class MyClass {
    int* data;
public:
    MyClass(int size) {
        data = new int[size];
    }
    ~MyClass() {
        delete data;  // Line A
    }
};`,
        options: [
            'No issue, code is correct',
            'Should use delete[] instead of delete',
            'data should be initialized to nullptr',
            'Missing copy constructor'
        ],
        correctAnswer: 1,
        explanation: 'When memory is allocated with new[], it must be freed with delete[] (not delete). Using delete on array memory causes undefined behavior.'
    },
    {
        id: 'cpp_5',
        category: 'cpp',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is the difference between unique_ptr and shared_ptr?',
        code: null,
        options: [
            'unique_ptr is faster, shared_ptr is slower',
            'unique_ptr allows exclusive ownership, shared_ptr allows multiple owners with reference counting',
            'unique_ptr works with arrays, shared_ptr does not',
            'There is no practical difference'
        ],
        correctAnswer: 1,
        explanation: 'unique_ptr enforces single ownership - cannot be copied, only moved. shared_ptr uses reference counting to allow multiple pointers to the same resource, deleting when count reaches zero.'
    },
    {
        id: 'cpp_6',
        category: 'cpp',
        difficulty: 'medium',
        type: 'output',
        question: 'What is the output?',
        code: `#include <iostream>
using namespace std;

class Base {
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
    return 0;
}`,
        options: [
            'Derived Derived',
            'Derived Base',
            'Base Derived',
            'Base Base'
        ],
        correctAnswer: 1,
        explanation: 'First call uses virtual dispatch (Derived). Second call involves object slicing - copying Derived to Base loses the derived part, so Base::show() is called.'
    },
    {
        id: 'cpp_7',
        category: 'cpp',
        difficulty: 'easy',
        type: 'concept',
        question: 'What does the const keyword do when placed after a method declaration?',
        code: `void getValue() const;`,
        options: [
            'Makes the return value constant',
            'Promises the method won\'t modify the object\'s state',
            'Makes the method faster',
            'Prevents the method from being overridden'
        ],
        correctAnswer: 1,
        explanation: 'const after method declaration makes it a const member function, promising not to modify any member variables (except those marked mutable).'
    },
    {
        id: 'cpp_8',
        category: 'cpp',
        difficulty: 'hard',
        type: 'output',
        question: 'What is the output?',
        code: `#include <iostream>
using namespace std;

template<typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    cout << max(3, 7) << " ";
    cout << max(3.14, 2.72) << " ";
    cout << max<int>(3.9, 2.1);
    return 0;
}`,
        options: [
            '7 3.14 3.9',
            '7 3.14 3',
            '7 3.14 4',
            'Compilation error'
        ],
        correctAnswer: 1,
        explanation: 'First two use template type deduction. Third explicitly uses int, so 3.9 and 2.1 are truncated to 3 and 2, max returns 3.'
    },
    {
        id: 'cpp_9',
        category: 'cpp',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is RAII in C++?',
        code: null,
        options: [
            'Random Access Iterator Interface',
            'Resource Acquisition Is Initialization - tying resource lifetime to object lifetime',
            'Runtime Allocated Integer Array',
            'Read After Initialize Instance'
        ],
        correctAnswer: 1,
        explanation: 'RAII binds resource management to object lifetime. Resources are acquired in constructor and released in destructor, ensuring cleanup even with exceptions.'
    },
    {
        id: 'cpp_10',
        category: 'cpp',
        difficulty: 'medium',
        type: 'output',
        question: 'What happens with this code?',
        code: `#include <iostream>
#include <map>
using namespace std;

int main() {
    map<string, int> m;
    m["apple"] = 5;
    m["banana"] = 3;
    cout << m["cherry"] << " ";
    cout << m.size();
    return 0;
}`,
        options: [
            'Throws exception',
            '0 2',
            '0 3',
            'Undefined behavior'
        ],
        correctAnswer: 2,
        explanation: 'Accessing m["cherry"] with operator[] creates the key with default value (0 for int). So it prints 0 and size becomes 3.'
    },
    {
        id: 'cpp_11',
        category: 'cpp',
        difficulty: 'hard',
        type: 'concept',
        question: 'What is the difference between virtual and pure virtual functions?',
        code: null,
        options: [
            'Pure virtual functions are faster',
            'Virtual functions have a default implementation, pure virtual functions (= 0) must be overridden',
            'Pure virtual functions cannot be inherited',
            'Virtual functions cannot be overridden'
        ],
        correctAnswer: 1,
        explanation: 'Virtual functions can have an implementation in the base class. Pure virtual functions (= 0) have no implementation and make the class abstract - derived classes must override them.'
    },
    {
        id: 'cpp_12',
        category: 'cpp',
        difficulty: 'medium',
        type: 'output',
        question: 'What is the output?',
        code: `#include <iostream>
using namespace std;

int main() {
    int a = 5, b = 10;
    int& ref = a;
    ref = b;
    b = 20;
    cout << a << " " << b << " " << ref;
    return 0;
}`,
        options: [
            '5 20 10',
            '10 20 10',
            '10 20 20',
            '5 20 20'
        ],
        correctAnswer: 1,
        explanation: 'ref is a reference to a. ref = b copies b\'s value (10) into a. Changing b to 20 doesn\'t affect a or ref. Final: a=10, b=20, ref=10.'
    }
];
