// Data Engineering Tier 1: SQL & Databases
// 15 Questions - SQL fundamentals, joins, aggregations

const dataEngineeringTier1SQL = [
    // ========== SECTION 1: SQL BASICS ==========
    {
        id: 'de_t1_1',
        tier: 1,
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'easy',
        topic: 'SQL Basics',
        type: 'multiple-choice',
        question: 'Which SQL clause is used to filter rows?',
        options: ['SELECT', 'FROM', 'WHERE', 'ORDER BY'],
        correctAnswer: 2,
        explanation: 'WHERE filters rows based on conditions. SELECT chooses columns, FROM specifies tables, ORDER BY sorts results.',
        hints: ['Used with conditions like = or >', 'Filters before grouping'],
        xpReward: 10
    },
    {
        id: 'de_t1_2',
        tier: 1,
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'easy',
        topic: 'SQL Basics',
        type: 'code-typing',
        question: 'Complete the query to select all columns from users table',
        template: 'SELECT ___ FROM users;',
        blanks: [
            { position: 0, correctAnswer: '*', alternatives: [] }
        ],
        explanation: '* is the wildcard that selects all columns from a table.',
        hints: ['Wildcard character', 'Means "everything"'],
        xpReward: 10
    },
    {
        id: 'de_t1_3',
        tier: 1,
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'easy',
        topic: 'SQL Basics',
        type: 'multiple-choice',
        question: 'What does ORDER BY do?',
        options: [
            'Filters rows',
            'Groups rows',
            'Sorts the result set',
            'Limits the number of rows'
        ],
        correctAnswer: 2,
        explanation: 'ORDER BY sorts results. Use ASC for ascending (default) or DESC for descending.',
        hints: ['Think: putting things in order', 'Can be ASC or DESC'],
        xpReward: 10
    },
    {
        id: 'de_t1_4',
        tier: 1,
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'SQL Basics',
        type: 'code-typing',
        question: 'Complete the query to get unique cities',
        template: 'SELECT ________ city FROM customers;',
        blanks: [
            { position: 0, correctAnswer: 'DISTINCT', alternatives: [] }
        ],
        explanation: 'DISTINCT removes duplicate values from results.',
        hints: ['Removes duplicates', 'Opposite of having repeats'],
        xpReward: 15
    },
    {
        id: 'de_t1_5',
        tier: 1,
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'SQL Basics',
        type: 'output',
        question: 'What does this query return?',
        code: `SELECT name, salary
FROM employees
WHERE salary > 50000
ORDER BY salary DESC
LIMIT 3;`,
        options: [
            'All employees earning over 50000',
            'Top 3 highest paid employees earning over 50000',
            'The 3rd highest paid employee',
            'Employees ranked 1-3 by name'
        ],
        correctAnswer: 1,
        explanation: 'WHERE filters to salary > 50000, ORDER BY DESC sorts highest first, LIMIT 3 returns only top 3.',
        hints: ['Read clauses in order', 'DESC means descending (highest first)'],
        xpReward: 20
    },

    // ========== SECTION 2: AGGREGATIONS ==========
    {
        id: 'de_t1_6',
        tier: 1,
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'easy',
        topic: 'Aggregations',
        type: 'multiple-choice',
        question: 'Which function counts the number of rows?',
        options: ['SUM()', 'COUNT()', 'AVG()', 'MAX()'],
        correctAnswer: 1,
        explanation: 'COUNT() counts rows. SUM() adds values, AVG() calculates average, MAX() finds maximum.',
        hints: ['Think: counting items', 'Most commonly used with *'],
        xpReward: 10
    },
    {
        id: 'de_t1_7',
        tier: 1,
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Aggregations',
        type: 'multiple-choice',
        question: 'What is the difference between WHERE and HAVING?',
        options: [
            'No difference',
            'WHERE filters rows before grouping; HAVING filters after grouping',
            'HAVING is faster than WHERE',
            'WHERE works with numbers; HAVING works with text'
        ],
        correctAnswer: 1,
        explanation: 'WHERE filters individual rows. HAVING filters groups created by GROUP BY. HAVING can use aggregate functions.',
        hints: ['Think: before vs after GROUP BY', 'HAVING works on aggregated data'],
        xpReward: 20
    },
    {
        id: 'de_t1_8',
        tier: 1,
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Aggregations',
        type: 'output',
        question: 'What does this query return?',
        code: `SELECT department, COUNT(*) as emp_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;`,
        options: [
            'All departments',
            'Departments with more than 5 employees',
            'The first 5 departments',
            'Employees in 5 departments'
        ],
        correctAnswer: 1,
        explanation: 'GROUP BY creates one row per department with count. HAVING filters to only groups with count > 5.',
        hints: ['HAVING filters groups', 'COUNT(*) > 5 means more than 5'],
        xpReward: 20
    },
    {
        id: 'de_t1_9',
        tier: 1,
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Aggregations',
        type: 'code-typing',
        question: 'Complete the query to get average salary',
        template: 'SELECT ___(salary) FROM employees;',
        blanks: [
            { position: 0, correctAnswer: 'AVG', alternatives: [] }
        ],
        explanation: 'AVG() calculates the arithmetic mean of a column.',
        hints: ['Average function', 'Returns the mean value'],
        xpReward: 15
    },

    // ========== SECTION 3: JOINS ==========
    {
        id: 'de_t1_10',
        tier: 1,
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Joins',
        type: 'multiple-choice',
        question: 'What does an INNER JOIN return?',
        options: [
            'All rows from both tables',
            'Only rows that have matching values in both tables',
            'All rows from the left table',
            'All rows from the right table'
        ],
        correctAnswer: 1,
        explanation: 'INNER JOIN returns only rows where the join condition matches in both tables. Non-matching rows are excluded.',
        hints: ['The intersection of both tables', 'Must match on both sides'],
        xpReward: 15
    },
    {
        id: 'de_t1_11',
        tier: 1,
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Joins',
        type: 'output',
        question: 'What does this LEFT JOIN return?',
        code: `SELECT c.name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;`,
        options: [
            'Only customers with orders',
            'All customers, with NULL for those without orders',
            'Only orders with customers',
            'Only matching records'
        ],
        correctAnswer: 1,
        explanation: 'LEFT JOIN returns all rows from the left table (customers). If no match in orders, order columns are NULL.',
        hints: ['LEFT = all from left table', 'Right side can be NULL'],
        xpReward: 20
    },
    {
        id: 'de_t1_12',
        tier: 1,
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'hard',
        topic: 'Joins',
        type: 'multiple-choice',
        question: 'What is a CROSS JOIN?',
        options: [
            'Join with no matching condition - returns cartesian product',
            'Join that crosses out duplicates',
            'Join between more than 2 tables',
            'Same as INNER JOIN'
        ],
        correctAnswer: 0,
        explanation: 'CROSS JOIN returns every combination of rows from both tables (cartesian product). Rarely used but important to understand.',
        hints: ['Every row paired with every other row', 'Can produce huge result sets'],
        xpReward: 25
    },

    // ========== SECTION 4: DATA TYPES & NULL ==========
    {
        id: 'de_t1_13',
        tier: 1,
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'NULL Handling',
        type: 'multiple-choice',
        question: 'How do you check if a value is NULL in SQL?',
        options: [
            'WHERE column = NULL',
            'WHERE column IS NULL',
            'WHERE column == NULL',
            'WHERE NULL(column)'
        ],
        correctAnswer: 1,
        explanation: 'NULL is not equal to anything, including itself. Use IS NULL or IS NOT NULL to check.',
        hints: ['= doesn\'t work with NULL', 'Special syntax required'],
        xpReward: 15
    },
    {
        id: 'de_t1_14',
        tier: 1,
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'NULL Handling',
        type: 'code-typing',
        question: 'Complete the query to replace NULL with "Unknown"',
        template: 'SELECT ________(name, \'Unknown\') FROM users;',
        blanks: [
            { position: 0, correctAnswer: 'COALESCE', alternatives: ['IFNULL', 'NVL'] }
        ],
        explanation: 'COALESCE returns the first non-NULL value. IFNULL (MySQL) and NVL (Oracle) are alternatives.',
        hints: ['Replace NULL with default', 'Standard SQL function'],
        xpReward: 20
    },
    {
        id: 'de_t1_15',
        tier: 1,
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Subqueries',
        type: 'output',
        question: 'What does this subquery do?',
        code: `SELECT name
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);`,
        options: [
            'Returns all employees',
            'Returns employees earning above average',
            'Returns the average salary',
            'Returns the highest paid employee'
        ],
        correctAnswer: 1,
        explanation: 'The subquery calculates average salary. Outer query returns employees whose salary exceeds that average.',
        hints: ['Subquery runs first', 'Compares each salary to the average'],
        xpReward: 20
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = dataEngineeringTier1SQL;
}
