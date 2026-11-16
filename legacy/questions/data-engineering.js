// Data Engineering Questions - Learn data pipelines and processing
const dataEngineeringQuestions = [
    {
        id: 'de_1',
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'easy',
        type: 'concept',
        question: 'What does ETL stand for in data engineering?',
        code: null,
        options: [
            'Encrypted Transfer Layer',
            'Extract, Transform, Load',
            'Efficient Table Lookup',
            'Extended Transaction Log'
        ],
        correctAnswer: 1,
        explanation: 'ETL = Extract (get data from sources), Transform (clean, validate, restructure), Load (store in destination). It\'s the backbone of data pipelines.'
    },
    {
        id: 'de_2',
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is the main difference between batch processing and stream processing?',
        code: null,
        options: [
            'Batch is faster than stream processing',
            'Batch processes data in chunks at intervals; stream processes data in real-time as it arrives',
            'Stream processing requires more storage',
            'Batch processing only works with databases'
        ],
        correctAnswer: 1,
        explanation: 'Batch processing handles large volumes of data at scheduled intervals (hourly, daily). Stream processing handles data continuously as it arrives - used for real-time analytics, alerts, and monitoring.'
    },
    {
        id: 'de_3',
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'medium',
        type: 'output',
        question: 'What does this SQL query return?',
        code: `SELECT department, COUNT(*) as emp_count, AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY avg_salary DESC;`,
        options: [
            'All departments with their employee counts',
            'Departments with more than 5 employees, sorted by average salary descending',
            'The top 5 highest-paid departments',
            'Error - HAVING requires WHERE'
        ],
        correctAnswer: 1,
        explanation: 'GROUP BY aggregates by department, HAVING filters groups (not rows) to those with >5 employees, ORDER BY sorts the result by average salary in descending order.'
    },
    {
        id: 'de_4',
        chapter: 1,
        category: 'dataEngineering',
        difficulty: 'hard',
        type: 'concept',
        question: 'What is a Data Lake vs a Data Warehouse?',
        code: null,
        options: [
            'They are the same thing',
            'Data Lake stores raw, unstructured data; Data Warehouse stores structured, processed data',
            'Data Lake is for real-time, Data Warehouse is for batch',
            'Data Lake is cheaper but less reliable'
        ],
        correctAnswer: 1,
        explanation: 'Data Lake: stores raw data in native format (schema-on-read), flexible but can become a "data swamp". Data Warehouse: stores cleaned, transformed data in structured schemas (schema-on-write), optimized for analytics.'
    },
    {
        id: 'de_5',
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is data normalization in database design?',
        code: null,
        options: [
            'Converting all data to the same format',
            'Organizing data to reduce redundancy and improve integrity',
            'Scaling data values between 0 and 1',
            'Encrypting sensitive data'
        ],
        correctAnswer: 1,
        explanation: 'Database normalization organizes tables to minimize redundancy (repeated data) and dependency. Forms (1NF, 2NF, 3NF) define rules for reducing data anomalies.'
    },
    {
        id: 'de_6',
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'hard',
        type: 'output',
        question: 'What type of JOIN is this SQL performing?',
        code: `SELECT a.name, b.order_id
FROM customers a
LEFT JOIN orders b ON a.id = b.customer_id;`,
        options: [
            'Returns only matching records from both tables',
            'Returns all customers and their orders, including customers with no orders (NULL)',
            'Returns only customers who have orders',
            'Returns only orders without customers'
        ],
        correctAnswer: 1,
        explanation: 'LEFT JOIN returns all rows from the left table (customers) and matching rows from the right (orders). Customers without orders will have NULL for order columns.'
    },
    {
        id: 'de_7',
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is the purpose of data partitioning?',
        code: null,
        options: [
            'Encrypting data for security',
            'Dividing data into smaller, manageable chunks for performance and scalability',
            'Creating backup copies of data',
            'Converting data formats'
        ],
        correctAnswer: 1,
        explanation: 'Partitioning splits large datasets by key (date, region, etc.) for faster queries (only scan relevant partitions), parallel processing, and easier management of large-scale data.'
    },
    {
        id: 'de_8',
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'hard',
        type: 'concept',
        question: 'What is Apache Kafka primarily used for?',
        code: null,
        options: [
            'Storing files in the cloud',
            'Distributed streaming platform for building real-time data pipelines',
            'Running SQL queries on big data',
            'Managing container deployments'
        ],
        correctAnswer: 1,
        explanation: 'Kafka is a distributed event streaming platform. It handles high-throughput, real-time data feeds with pub-sub messaging, used for logs, metrics, event-driven architectures, and real-time analytics.'
    },
    {
        id: 'de_9',
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is a surrogate key in database design?',
        code: null,
        options: [
            'A primary key from another table',
            'An artificial key (like auto-increment ID) with no business meaning',
            'A temporary key used during data migration',
            'An encrypted version of the primary key'
        ],
        correctAnswer: 1,
        explanation: 'A surrogate key is system-generated (auto-increment, UUID) with no business meaning, vs natural keys (email, SSN) that have real-world significance. Surrogate keys are stable and don\'t change with business rules.'
    },
    {
        id: 'de_10',
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'hard',
        type: 'concept',
        question: 'What is the CAP theorem?',
        code: null,
        options: [
            'A theorem about data compression efficiency',
            'States that distributed systems can only guarantee 2 of 3: Consistency, Availability, Partition tolerance',
            'A method for calculating database capacity',
            'A security framework for APIs'
        ],
        correctAnswer: 1,
        explanation: 'CAP theorem: in a distributed system, you can only guarantee two of: Consistency (all nodes see same data), Availability (every request gets a response), Partition Tolerance (system works despite network failures).'
    },
    {
        id: 'de_11',
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'medium',
        type: 'output',
        question: 'What does this SQL window function do?',
        code: `SELECT name, salary,
       RANK() OVER (ORDER BY salary DESC) as salary_rank
FROM employees;`,
        options: [
            'Sorts employees by salary',
            'Adds a ranking column based on salary without grouping rows',
            'Filters to top-ranked employees only',
            'Calculates average salary'
        ],
        correctAnswer: 1,
        explanation: 'RANK() is a window function that assigns ranks based on ORDER BY. Unlike GROUP BY, it keeps all rows and adds calculated columns. Equal salaries get same rank, next rank is skipped.'
    },
    {
        id: 'de_12',
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'hard',
        type: 'concept',
        question: 'What is the difference between OLTP and OLAP systems?',
        code: null,
        options: [
            'OLTP is online, OLAP is offline',
            'OLTP handles transactional operations; OLAP handles analytical queries on historical data',
            'OLTP is faster than OLAP',
            'OLTP uses SQL, OLAP uses NoSQL'
        ],
        correctAnswer: 1,
        explanation: 'OLTP (Online Transaction Processing): optimized for CRUD operations, normalized data, current data. OLAP (Online Analytical Processing): optimized for complex queries, denormalized, historical data, used in data warehouses.'
    }
];
