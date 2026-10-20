import { Assignment } from '../types';

/**
 * Centralized Academic Assignments Data Store
 * 
 * To add, edit, or customize any assignment:
 * 1. Modify the fields below (title, subject, overview, keyTopics, learningOutcome).
 * 2. New assignments added to this array will automatically update the Overview statistics.
 */
export const initialAssignments: Assignment[] = [
  {
    id: 'assignment-01',
    number: '01',
    title: 'Relational Schema Design & Normalization [Editable Placeholder]',
    subject: 'Database Management Systems',
    overview:
      'This assignment explores the fundamentals of relational schema modeling, functional dependencies, and progressive normal forms (1NF through BCNF). Students design an entity-relationship schema for an institutional system and synthesize decomposition strategies to eliminate redundancy and update anomalies.',
    keyTopics: ['Functional Dependencies', '3NF & BCNF Decomposition', 'Integrity Constraints', 'Relational Algebra'],
    learningOutcome:
      'Demonstrates proficiency in analyzing complex data relationships, applying formal normalization algorithms, and designing robust, lossless relational database schemas.',
    isPlaceholder: true,
  },
  {
    id: 'assignment-02',
    number: '02',
    title: 'CPU Scheduling Algorithms & Concurrency Synchronization [Editable Placeholder]',
    subject: 'Operating Systems',
    overview:
      'This assignment investigates kernel-level process scheduling mechanics and synchronization primitives. It encompasses comparative performance simulation of FCFS, Round Robin, and Multi-Level Feedback Queues alongside deadlock resolution using semaphores and mutex locks.',
    keyTopics: ['Preemptive Scheduling', 'Context Switching', 'Semaphores & Mutexes', 'Banker\'s Algorithm'],
    learningOutcome:
      'Demonstrates the ability to evaluate process throughput and turnaround metrics, implement thread synchronization safeguards, and formulate deadlock avoidance strategies.',
    isPlaceholder: true,
  },
  {
    id: 'assignment-03',
    number: '03',
    title: 'Hierarchical IPv4/IPv6 Subnetting & Socket Transport [Editable Placeholder]',
    subject: 'Computer Networks',
    overview:
      'This assignment focuses on network layer addressing, Classless Inter-Domain Routing (CIDR), and transport protocol dynamics. Students design scalable hierarchical subnet architectures and construct client-server socket communication channels over TCP and UDP protocols.',
    keyTopics: ['VLSM & CIDR Addressing', 'TCP 3-Way Handshake', 'Socket Programming', 'Packet Trace Analysis'],
    learningOutcome:
      'Demonstrates practical competence in calculating subnet allocations, analyzing packet-level protocol headers, and developing networked client-server applications.',
    isPlaceholder: true,
  },
  {
    id: 'assignment-04',
    number: '04',
    title: 'Software Architectural Modeling & UML Specification [Editable Placeholder]',
    subject: 'Software Engineering',
    overview:
      'This assignment addresses structured software lifecycle methodologies, requirement elicitation matrices, and architectural design patterns. Students model system use cases, sequence diagrams, and class hierarchies compliant with standard Unified Modeling Language (UML) specifications.',
    keyTopics: ['Agile Sprint Planning', 'UML Class & Sequence Diagrams', 'Design Patterns (MVC/Observer)', 'Requirement Traceability'],
    learningOutcome:
      'Demonstrates mastery in transforming functional requirements into structured architectural specifications and maintaining design integrity across software development iterations.',
    isPlaceholder: true,
  },
  {
    id: 'assignment-05',
    number: '05',
    title: 'Asymptotic Analysis & Dynamic Programming Optimization [Editable Placeholder]',
    subject: 'Data Structures and Algorithms',
    overview:
      'This assignment covers algorithmic computational complexity, recurrence relations, and dynamic programming paradigms. Exercises include graph traversal strategies (Dijkstra, Bellman-Ford) and memoization techniques applied to multi-stage decision problems.',
    keyTopics: ['Big-O Asymptotic Bounds', 'Shortest Path Graph Algorithms', 'Memoization & Tabulation', 'Optimal Substructure'],
    learningOutcome:
      'Demonstrates rigorous capabilities in proving algorithmic bounds, designing space-time optimal data structures, and solving non-trivial optimization problems.',
    isPlaceholder: true,
  },
  {
    id: 'assignment-06',
    number: '06',
    title: 'Modern Full-Stack RESTful API & Component Architecture [Editable Placeholder]',
    subject: 'Web Development',
    overview:
      'This assignment explores modern client-server web architectures, secure REST API design, and asynchronous state synchronization. Students construct modular frontend component hierarchies and validate endpoints with structured payload validation.',
    keyTopics: ['RESTful Endpoint Design', 'Component Lifecycle', 'JWT Authentication', 'State Hydration'],
    learningOutcome:
      'Demonstrates end-to-end web engineering competencies including declarative UI composition, stateless communication protocols, and client-side data persistence.',
    isPlaceholder: true,
  },
  {
    id: 'assignment-07',
    number: '07',
    title: 'Supervised Feature Engineering & Model Evaluation [Editable Placeholder]',
    subject: 'Machine Learning',
    overview:
      'This assignment investigates supervised learning pipelines, continuous feature normalization, and classification estimators. Students analyze bias-variance tradeoffs and assess model performance through cross-validated ROC-AUC curves and confusion matrices.',
    keyTopics: ['Feature Scaling & Encoding', 'Logistic Regression & Decision Trees', 'K-Fold Cross Validation', 'ROC-AUC & F1-Score'],
    learningOutcome:
      'Demonstrates the ability to construct reproducible data preprocessing workflows, select appropriate learning models, and scientifically interpret evaluation diagnostics.',
    isPlaceholder: true,
  },
  {
    id: 'assignment-08',
    number: '08',
    title: 'Heuristic State-Space Search & Knowledge Representation [Editable Placeholder]',
    subject: 'Artificial Intelligence',
    overview:
      'This assignment explores informed search methodologies and automated inference mechanisms. Key activities encompass implementing A* and Minimax algorithms with alpha-beta pruning alongside propositional logic resolution proofs.',
    keyTopics: ['A* Search & Admissibility', 'Minimax & Alpha-Beta Pruning', 'First-Order Logic Inference', 'Constraint Satisfaction'],
    learningOutcome:
      'Demonstrates foundational understanding of automated problem-solving heuristics, adversarial game tree evaluation, and formal symbolic reasoning.',
    isPlaceholder: true,
  },
  {
    id: 'assignment-09',
    number: '09',
    title: 'Dimensional Modeling & Star Schema Data Warehousing [Editable Placeholder]',
    subject: 'Data Warehousing and Mining',
    overview:
      'This assignment analyzes analytical database architectures for business intelligence. Students engineer fact and dimension tables adhering to Kimball dimensional modeling principles and execute association rule mining (Apriori algorithm) over transaction corpora.',
    keyTopics: ['Star & Snowflake Schemas', 'ETL Pipeline Design', 'Apriori Association Mining', 'OLAP Cubes & Rollup/Drilldown'],
    learningOutcome:
      'Demonstrates proficiency in designing analytical schema structures for multi-dimensional querying and extracting actionable association patterns from large datasets.',
    isPlaceholder: true,
  },
  {
    id: 'assignment-10',
    number: '10',
    title: 'Asymmetric Cryptography & Network Vulnerability Assessment [Editable Placeholder]',
    subject: 'Information & Network Security',
    overview:
      'This assignment investigates public-key cryptographic algorithms, digital signature verification, and system vulnerability surface auditing. Students analyze RSA key generation mathematics and simulate packet interception countermeasures.',
    keyTopics: ['RSA & Diffie-Hellman Key Exchange', 'SHA-256 Hashing', 'TLS/SSL Handshake Protocol', 'OWASP Top 10 Vulnerabilities'],
    learningOutcome:
      'Demonstrates critical understanding of cryptographic security guarantees, secure communication channels, and proactive identification of software vulnerabilities.',
    isPlaceholder: true,
  },
];
