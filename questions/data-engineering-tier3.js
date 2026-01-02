// Data Engineering Tier 3: Advanced Analytics
// 15 Questions - Window Functions, CAP Theorem, Distributed Systems

const dataEngineeringTier3Advanced = [
    // ========== SECTION 1: WINDOW FUNCTIONS ==========
    {
        id: 'de_t3_1',
        tier: 3,
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Window Functions',
        type: 'multiple-choice',
        question: 'What is a window function in SQL?',
        options: [
            'A function for creating pop-up windows',
            'A function that performs calculations across a set of rows related to the current row',
            'A function for windowed time ranges',
            'A function that only works with dates'
        ],
        correctAnswer: 1,
        explanation: 'Window functions calculate values across a "window" of rows without collapsing them into one (unlike GROUP BY).',
        hints: ['OVER() clause is key', 'Keeps all rows unlike aggregation'],
        xpReward: 20
    },
    {
        id: 'de_t3_2',
        tier: 3,
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'hard',
        topic: 'Window Functions',
        type: 'output',
        question: 'What does this query do?',
        code: `SELECT name, salary,
       RANK() OVER (ORDER BY salary DESC) as rank
FROM employees;`,
        options: [
            'Groups employees by rank',
            'Adds a ranking column without grouping rows',
            'Filters employees by rank',
            'Calculates average rank'
        ],
        correctAnswer: 1,
        explanation: 'RANK() assigns ranks based on ORDER BY. Unlike GROUP BY, all rows are preserved with their calculated rank.',
        hints: ['Window function preserves rows', 'RANK() assigns position'],
        xpReward: 25
    },
    {
        id: 'de_t3_3',
        tier: 3,
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'hard',
        topic: 'Window Functions',
        type: 'multiple-choice',
        question: 'What is the difference between RANK() and ROW_NUMBER()?',
        options: [
            'No difference',
            'RANK() can have ties (same rank); ROW_NUMBER() is always unique',
            'ROW_NUMBER() is slower',
            'RANK() only works with numbers'
        ],
        correctAnswer: 1,
        explanation: 'RANK(): ties get same rank, next rank skipped. ROW_NUMBER(): always 1,2,3... even for ties. DENSE_RANK() doesn\'t skip.',
        hints: ['Ties are handled differently', 'ROW_NUMBER is always unique'],
        xpReward: 25
    },
    {
        id: 'de_t3_4',
        tier: 3,
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'hard',
        topic: 'Window Functions',
        type: 'multiple-choice',
        question: 'What does LAG() do in SQL?',
        options: [
            'Delays query execution',
            'Accesses data from a previous row in the result set',
            'Measures query performance',
            'Creates a time delay'
        ],
        correctAnswer: 1,
        explanation: 'LAG() accesses the previous row\'s value (useful for comparing current vs previous). LEAD() accesses the next row.',
        hints: ['Looks backward', 'Useful for change detection'],
        xpReward: 25
    },

    // ========== SECTION 2: DISTRIBUTED SYSTEMS ==========
    {
        id: 'de_t3_5',
        tier: 3,
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'hard',
        topic: 'CAP Theorem',
        type: 'multiple-choice',
        question: 'What is the CAP theorem?',
        options: [
            'A data compression algorithm',
            'States distributed systems can only guarantee 2 of 3: Consistency, Availability, Partition tolerance',
            'A method for calculating capacity',
            'A security framework'
        ],
        correctAnswer: 1,
        explanation: 'CAP: you can\'t have all three. CP systems sacrifice availability, AP systems sacrifice consistency during partitions.',
        hints: ['Trade-offs in distributed systems', 'Pick 2 of 3'],
        xpReward: 30
    },
    {
        id: 'de_t3_6',
        tier: 3,
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'hard',
        topic: 'Distributed Systems',
        type: 'multiple-choice',
        question: 'What is eventual consistency?',
        options: [
            'Guaranteed immediate consistency',
            'Data will become consistent across all nodes, but not immediately',
            'Data is never consistent',
            'Consistency depends on user settings'
        ],
        correctAnswer: 1,
        explanation: 'Eventual consistency: after some time with no updates, all reads will return the same value. Used in AP systems for availability.',
        hints: ['Not immediate, but "eventual"', 'Trade-off for availability'],
        xpReward: 25
    },
    {
        id: 'de_t3_7',
        tier: 3,
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'hard',
        topic: 'Distributed Systems',
        type: 'multiple-choice',
        question: 'What is sharding?',
        options: [
            'Breaking glass',
            'Horizontal partitioning of data across multiple database instances',
            'Vertical scaling',
            'Data encryption'
        ],
        correctAnswer: 1,
        explanation: 'Sharding distributes data across multiple databases (shards) by key. Enables horizontal scaling but adds complexity.',
        hints: ['Splitting data across servers', 'Horizontal partitioning'],
        xpReward: 25
    },
    {
        id: 'de_t3_8',
        tier: 3,
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Distributed Systems',
        type: 'multiple-choice',
        question: 'What is replication in databases?',
        options: [
            'Deleting duplicate data',
            'Copying data to multiple nodes for redundancy and availability',
            'Compressing data',
            'Encrypting data'
        ],
        correctAnswer: 1,
        explanation: 'Replication maintains copies across nodes for fault tolerance and read scaling. Types: leader-follower, multi-leader, leaderless.',
        hints: ['Multiple copies', 'Fault tolerance'],
        xpReward: 20
    },

    // ========== SECTION 3: BIG DATA ==========
    {
        id: 'de_t3_9',
        tier: 3,
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Big Data',
        type: 'multiple-choice',
        question: 'What is Apache Spark?',
        options: [
            'A database',
            'A distributed data processing engine for large-scale data analytics',
            'A message queue',
            'A visualization tool'
        ],
        correctAnswer: 1,
        explanation: 'Spark is a fast, distributed processing engine supporting batch and streaming. Uses in-memory computing for speed.',
        hints: ['Distributed processing', 'Faster than MapReduce'],
        xpReward: 20
    },
    {
        id: 'de_t3_10',
        tier: 3,
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'hard',
        topic: 'Big Data',
        type: 'multiple-choice',
        question: 'What is a DataFrame in Spark?',
        options: [
            'A picture frame',
            'A distributed collection of data organized into named columns',
            'A database table',
            'A file format'
        ],
        correctAnswer: 1,
        explanation: 'DataFrame is a distributed dataset with named columns, like a table. Enables optimized query execution through Catalyst optimizer.',
        hints: ['Like a table but distributed', 'Core Spark abstraction'],
        xpReward: 25
    },
    {
        id: 'de_t3_11',
        tier: 3,
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'File Formats',
        type: 'multiple-choice',
        question: 'Why is Parquet preferred over CSV for analytics?',
        options: [
            'Parquet is smaller in file size only',
            'Parquet is columnar, enabling faster queries on specific columns',
            'Parquet is easier to read',
            'CSV is not supported'
        ],
        correctAnswer: 1,
        explanation: 'Parquet is columnar (read only needed columns), compressed, and schema-aware. Much faster for analytics than row-based CSV.',
        hints: ['Columnar vs row format', 'Read only what you need'],
        xpReward: 20
    },

    // ========== SECTION 4: DATA MODELING ==========
    {
        id: 'de_t3_12',
        tier: 3,
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Data Modeling',
        type: 'multiple-choice',
        question: 'What is a star schema?',
        options: [
            'A shape of data center',
            'A dimensional model with fact table in center surrounded by dimension tables',
            'A graph database structure',
            'A security model'
        ],
        correctAnswer: 1,
        explanation: 'Star schema: central fact table (measures/events) linked to dimension tables (descriptive attributes). Common in data warehouses.',
        hints: ['Fact table in the center', 'Dimensions around it like star points'],
        xpReward: 20
    },
    {
        id: 'de_t3_13',
        tier: 3,
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'hard',
        topic: 'Data Modeling',
        type: 'multiple-choice',
        question: 'What is a slowly changing dimension (SCD)?',
        options: [
            'A dimension that rarely updates',
            'A technique for tracking changes to dimension data over time',
            'A slow loading dimension table',
            'A static dimension'
        ],
        correctAnswer: 1,
        explanation: 'SCD tracks how dimension data changes. Type 1: overwrite. Type 2: add new row with history. Type 3: add new column.',
        hints: ['Handling historical changes', 'Multiple types exist'],
        xpReward: 25
    },
    {
        id: 'de_t3_14',
        tier: 3,
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'hard',
        topic: 'Data Modeling',
        type: 'multiple-choice',
        question: 'What is a fact table?',
        options: [
            'A table of true statements',
            'A table containing numeric measures and foreign keys to dimensions',
            'A dimension with facts',
            'A lookup table'
        ],
        correctAnswer: 1,
        explanation: 'Fact tables contain measurable events (sales amount, quantity) and foreign keys to related dimensions (date, product, customer).',
        hints: ['Measures and metrics', 'Center of star schema'],
        xpReward: 20
    },
    {
        id: 'de_t3_15',
        tier: 3,
        chapter: 3,
        category: 'dataEngineering',
        difficulty: 'hard',
        topic: 'ACID',
        type: 'multiple-choice',
        question: 'What does ACID stand for in databases?',
        options: [
            'Automated, Controlled, Integrated, Distributed',
            'Atomicity, Consistency, Isolation, Durability',
            'Active, Consistent, Immediate, Direct',
            'Allocated, Cached, Indexed, Deleted'
        ],
        correctAnswer: 1,
        explanation: 'ACID: Atomicity (all or nothing), Consistency (valid states), Isolation (concurrent transactions isolated), Durability (committed = permanent).',
        hints: ['Transaction guarantees', 'Fundamental to relational DBs'],
        xpReward: 25
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = dataEngineeringTier3Advanced;
}
