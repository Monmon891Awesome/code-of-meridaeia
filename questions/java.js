// Java Questions - Intermediate Level
const javaQuestions = [
    {
        id: 'java_1',
        category: 'java',
        difficulty: 'medium',
        type: 'output',
        question: 'What is the output of the following Java code?',
        code: `public class Test {
    public static void main(String[] args) {
        String s1 = "Hello";
        String s2 = new String("Hello");
        System.out.println(s1 == s2);
        System.out.println(s1.equals(s2));
    }
}`,
        options: [
            'true, true',
            'false, true',
            'true, false',
            'false, false'
        ],
        correctAnswer: 1,
        explanation: '== compares references (memory addresses), while .equals() compares content. s1 points to the String pool, s2 creates a new object on the heap.'
    },
    {
        id: 'java_2',
        category: 'java',
        difficulty: 'medium',
        type: 'concept',
        question: 'Which collection should you use when you need fast lookups by key and maintain insertion order?',
        code: null,
        options: [
            'HashMap',
            'TreeMap',
            'LinkedHashMap',
            'Hashtable'
        ],
        correctAnswer: 2,
        explanation: 'LinkedHashMap maintains insertion order while providing O(1) lookups. HashMap doesn\'t maintain order, TreeMap sorts by key, Hashtable is synchronized but unordered.'
    },
    {
        id: 'java_3',
        category: 'java',
        difficulty: 'hard',
        type: 'output',
        question: 'What happens when this code runs?',
        code: `public class ThreadTest {
    private static int count = 0;
    
    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> {
            for(int i = 0; i < 1000; i++) count++;
        });
        Thread t2 = new Thread(() -> {
            for(int i = 0; i < 1000; i++) count++;
        });
        t1.start(); t2.start();
        t1.join(); t2.join();
        System.out.println(count);
    }
}`,
        options: [
            'Always prints 2000',
            'May print a value less than 2000 due to race condition',
            'Compilation error',
            'Throws ConcurrentModificationException'
        ],
        correctAnswer: 1,
        explanation: 'Without synchronization, count++ is not atomic. Multiple threads can read the same value before incrementing, causing lost updates (race condition).'
    },
    {
        id: 'java_4',
        category: 'java',
        difficulty: 'medium',
        type: 'output',
        question: 'What does this stream operation return?',
        code: `List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5);
int result = nums.stream()
    .filter(n -> n % 2 == 0)
    .mapToInt(n -> n * 2)
    .sum();
System.out.println(result);`,
        options: [
            '6',
            '12',
            '15',
            '30'
        ],
        correctAnswer: 1,
        explanation: 'Filter keeps even numbers [2, 4], mapToInt doubles them [4, 8], sum() adds them: 4 + 8 = 12.'
    },
    {
        id: 'java_5',
        category: 'java',
        difficulty: 'hard',
        type: 'bugfix',
        question: 'What is wrong with this singleton implementation?',
        code: `public class Singleton {
    private static Singleton instance;
    
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}`,
        options: [
            'Missing private constructor',
            'Not thread-safe - multiple instances possible',
            'Both A and B are correct',
            'The code is perfectly fine'
        ],
        correctAnswer: 2,
        explanation: 'Two issues: 1) No private constructor allows external instantiation. 2) Without synchronization, two threads could both see instance as null and create separate instances.'
    },
    {
        id: 'java_6',
        category: 'java',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is the purpose of the volatile keyword in Java?',
        code: null,
        options: [
            'Makes a variable constant',
            'Ensures visibility of changes across threads',
            'Prevents garbage collection',
            'Increases variable access speed'
        ],
        correctAnswer: 1,
        explanation: 'volatile ensures that reads and writes to a variable are visible to all threads. It prevents thread-local caching of the variable.'
    },
    {
        id: 'java_7',
        category: 'java',
        difficulty: 'easy',
        type: 'output',
        question: 'What is the output?',
        code: `ArrayList<Integer> list = new ArrayList<>();
list.add(1);
list.add(2);
list.add(3);
list.remove(1);
System.out.println(list);`,
        options: [
            '[2, 3]',
            '[1, 3]',
            '[1, 2]',
            'IndexOutOfBoundsException'
        ],
        correctAnswer: 1,
        explanation: 'remove(1) removes the element at index 1 (which is 2), not the element with value 1. Use remove(Integer.valueOf(1)) to remove by value.'
    },
    {
        id: 'java_8',
        category: 'java',
        difficulty: 'hard',
        type: 'concept',
        question: 'Which statement about Java Generics is FALSE?',
        code: null,
        options: [
            'Generic type information is erased at runtime',
            'You cannot create arrays of parameterized types',
            'Generics support primitive types directly',
            'Wildcards allow flexible type parameters'
        ],
        correctAnswer: 2,
        explanation: 'Java Generics do NOT support primitive types (int, double, etc.) directly. You must use wrapper classes (Integer, Double). This is due to type erasure.'
    },
    {
        id: 'java_9',
        category: 'java',
        difficulty: 'medium',
        type: 'output',
        question: 'What exception is thrown?',
        code: `public class Test {
    public static void main(String[] args) {
        try {
            throw new RuntimeException("Error 1");
        } finally {
            throw new RuntimeException("Error 2");
        }
    }
}`,
        options: [
            'RuntimeException: Error 1',
            'RuntimeException: Error 2',
            'Both exceptions are thrown',
            'No exception is thrown'
        ],
        correctAnswer: 1,
        explanation: 'The finally block\'s exception "Error 2" suppresses the try block\'s exception "Error 1". Only "Error 2" propagates.'
    },
    {
        id: 'java_10',
        category: 'java',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is the difference between Comparable and Comparator interfaces?',
        code: null,
        options: [
            'Comparable is in java.util, Comparator is in java.lang',
            'Comparable defines natural ordering within the class, Comparator defines external custom ordering',
            'Comparable can sort multiple fields, Comparator cannot',
            'There is no difference, they are interchangeable'
        ],
        correctAnswer: 1,
        explanation: 'Comparable is implemented by the class itself for natural ordering (compareTo). Comparator is a separate class for custom ordering (compare), allowing multiple sort strategies.'
    },
    {
        id: 'java_11',
        category: 'java',
        difficulty: 'hard',
        type: 'output',
        question: 'What is the output of this code?',
        code: `class Parent {
    Parent() { System.out.print("P "); }
}
class Child extends Parent {
    Child() { System.out.print("C "); }
}
class GrandChild extends Child {
    GrandChild() { System.out.print("G "); }
}
public class Main {
    public static void main(String[] args) {
        new GrandChild();
    }
}`,
        options: [
            'G C P',
            'P C G',
            'G',
            'Compilation error'
        ],
        correctAnswer: 1,
        explanation: 'Constructors are called from the top of the hierarchy down. Parent constructor runs first, then Child, then GrandChild.'
    },
    {
        id: 'java_12',
        category: 'java',
        difficulty: 'medium',
        type: 'concept',
        question: 'What does the transient keyword do?',
        code: null,
        options: [
            'Makes a field constant',
            'Excludes a field from serialization',
            'Makes a field thread-safe',
            'Allows field to be null'
        ],
        correctAnswer: 1,
        explanation: 'transient marks a field to be skipped during serialization. This is useful for sensitive data (passwords) or derived/computed fields.'
    }
];
