// const sqlite3 = require('sqlite3');
// const path = require('path');
// const fs = require('fs');
// const os = require('os');

// class SchoolDB {
//   constructor() {
//     // Chemin vers la base de données dans le dossier utilisateur
//     const userDataPath = path.join(os.homedir(), '.gestion-scolarite');
    
//     // Créer le dossier s'il n'existe pas
//     if (!fs.existsSync(userDataPath)) {
//       fs.mkdirSync(userDataPath, { recursive: true });
//     }
    
//     this.dbPath = path.join(userDataPath, 'school.db');
//   }

//   init() {
//     return new Promise((resolve, reject) => {
//       try {
//         this.db = new sqlite3.Database(this.dbPath, (err) => {
//           if (err) {
//             console.error('Erreur connexion DB:', err);
//             reject(err);
//             return;
//           }
          
//           console.log('Base de données initialisée:', this.dbPath);
//           this.createTables()
//             .then(() => this.seedData())
//             .then(() => resolve())
//             .catch(reject);
//         });
//       } catch (error) {
//         console.error('Erreur lors de l\'initialisation de la base de données:', error);
//         reject(error);
//       }
//     });
//   }

//   createTables() {
//     return new Promise((resolve, reject) => {
//       const queries = [
//         // Table des opérateurs
//         `CREATE TABLE IF NOT EXISTS operators (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           name TEXT NOT NULL,
//           email TEXT UNIQUE NOT NULL,
//           password TEXT NOT NULL,
//           created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//         )`,
        
//         // Table des élèves
//         `CREATE TABLE IF NOT EXISTS students (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           name TEXT NOT NULL,
//           class TEXT NOT NULL,
//           section TEXT NOT NULL,
//           school_year TEXT NOT NULL,
//           matricule TEXT UNIQUE,
//           created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//         )`,
        
//         // Table des paiements
//         `CREATE TABLE IF NOT EXISTS payments (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           student_id INTEGER NOT NULL,
//           student_name TEXT NOT NULL,
//           class_name TEXT NOT NULL,
//           section TEXT NOT NULL,
//           school_year TEXT NOT NULL,
//           paid_amounts TEXT NOT NULL,
//           total_paid INTEGER NOT NULL,
//           receipt_number TEXT UNIQUE NOT NULL,
//           operator TEXT NOT NULL,
//           date DATETIME DEFAULT CURRENT_TIMESTAMP,
//           created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//           FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
//         )`,
        
//         // Table des reçus
//         `CREATE TABLE IF NOT EXISTS receipts (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           payment_id INTEGER NOT NULL,
//           student_id INTEGER NOT NULL,
//           receipt_data TEXT NOT NULL,
//           created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//           FOREIGN KEY (payment_id) REFERENCES payments (id) ON DELETE CASCADE,
//           FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
//         )`,
        
//         // Index
//         'CREATE INDEX IF NOT EXISTS idx_students_name ON students(name)',
//         'CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id)',
//         'CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(date)'
//       ];

//       let completed = 0;
//       queries.forEach(query => {
//         this.db.run(query, (err) => {
//           if (err) {
//             console.error('Erreur création table:', err);
//             reject(err);
//             return;
//           }
//           completed++;
//           if (completed === queries.length) {
//             console.log('Toutes les tables créées');
//             resolve();
//           }
//         });
//       });
//     });
//   }

//   seedData() {
//     return new Promise((resolve, reject) => {
//       this.db.get('SELECT COUNT(*) as count FROM operators WHERE email = ?', ['admin@ecole.com'], (err, row) => {
//         if (err) {
//           reject(err);
//           return;
//         }
        
//         if (row.count === 0) {
//           this.db.run(
//             'INSERT INTO operators (name, email, password) VALUES (?, ?, ?)',
//             ['Administrateur', 'admin@ecole.com', 'admin123'],
//             function(err) {
//               if (err) {
//                 reject(err);
//                 return;
//               }
//               console.log('Opérateur admin créé');
//               resolve();
//             }
//           );
//         } else {
//           resolve();
//         }
//       });
//     });
//   }

//   // ===== MÉTHODES POUR LES OPÉRATEURS =====
//   createOperator(name, email, password) {
//     return new Promise((resolve, reject) => {
//       this.db.run(
//         'INSERT INTO operators (name, email, password) VALUES (?, ?, ?)',
//         [name, email, password],
//         function(err) {
//           if (err) {
//             reject(err);
//             return;
//           }
//           resolve({ id: this.lastID, name, email });
//         }
//       );
//     });
//   }

//   getOperatorByEmail(email) {
//     return new Promise((resolve, reject) => {
//       this.db.get('SELECT * FROM operators WHERE email = ?', [email], (err, row) => {
//         if (err) reject(err);
//         else resolve(row);
//       });
//     });
//   }

//   // ===== MÉTHODES POUR LES ÉLÈVES =====
//   createStudent(name, class_, section, schoolYear, matricule) {
//     return new Promise((resolve, reject) => {
//       const currentYear = new Date().getFullYear();
//       const year = schoolYear || `${currentYear}-${currentYear + 1}`;

//       this.db.run(
//         'INSERT INTO students (name, class, section, school_year, matricule) VALUES (?, ?, ?, ?, ?)',
//         [name, class_, section, year, matricule],
//         function(err) {
//           if (err) {
//             reject(err);
//             return;
//           }
//           resolve({ 
//             id: this.lastID, 
//             name, 
//             class: class_, 
//             section, 
//             schoolYear: year, 
//             matricule,
//             createdAt: new Date().toISOString()
//           });
//         }
//       );
//     });
//   }

//   getStudents() {
//     return new Promise((resolve, reject) => {
//       this.db.all('SELECT * FROM students ORDER BY created_at DESC', (err, rows) => {
//         if (err) reject(err);
//         else resolve(rows);
//       });
//     });
//   }

//   getStudent(id) {
//     return new Promise((resolve, reject) => {
//       this.db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
//         if (err) reject(err);
//         else resolve(row);
//       });
//     });
//   }

//   updateStudent(id, name, class_, section, schoolYear) {
//     return new Promise((resolve, reject) => {
//       this.db.run(
//         'UPDATE students SET name = ?, class = ?, section = ?, school_year = ? WHERE id = ?',
//         [name, class_, section, schoolYear, id],
//         function(err) {
//           if (err) {
//             reject(err);
//             return;
//           }
//           resolve(this.changes > 0 ? { id, name, class: class_, section, schoolYear } : null);
//         }
//       );
//     });
//   }

//   deleteStudent(id) {
//     return new Promise((resolve, reject) => {
//       this.db.run('DELETE FROM students WHERE id = ?', [id], function(err) {
//         if (err) {
//           reject(err);
//           return;
//         }
//         resolve(this.changes > 0);
//       });
//     });
//   }

//   searchStudents(query) {
//     return new Promise((resolve, reject) => {
//       const searchTerm = `%${query}%`;
//       this.db.all(
//         'SELECT * FROM students WHERE name LIKE ? OR matricule LIKE ? OR class LIKE ? ORDER BY name',
//         [searchTerm, searchTerm, searchTerm],
//         (err, rows) => {
//           if (err) reject(err);
//           else resolve(rows);
//         }
//       );
//     });
//   }

//   // ===== MÉTHODES POUR LES PAIEMENTS =====
//   createPayment(studentId, studentName, className, section, schoolYear, paidAmounts, totalPaid, receiptNumber, operator) {
//     return new Promise((resolve, reject) => {
//       const currentYear = new Date().getFullYear();
//       const year = schoolYear || `${currentYear}-${currentYear + 1}`;
//       const paidAmountsStr = JSON.stringify(paidAmounts);

//       this.db.run(
//         'INSERT INTO payments (student_id, student_name, class_name, section, school_year, paid_amounts, total_paid, receipt_number, operator) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
//         [studentId, studentName, className, section, year, paidAmountsStr, totalPaid, receiptNumber, operator],
//         function(err) {
//           if (err) {
//             reject(err);
//             return;
//           }
//           resolve({ 
//             id: this.lastID,
//             studentId,
//             studentName,
//             className,
//             section,
//             schoolYear: year,
//             paidAmounts,
//             totalPaid,
//             receiptNumber,
//             operator,
//             date: new Date().toISOString(),
//             createdAt: new Date().toISOString()
//           });
//         }
//       );
//     });
//   }

//   getStudentPayments(studentId) {
//     return new Promise((resolve, reject) => {
//       this.db.all(
//         'SELECT * FROM payments WHERE student_id = ? ORDER BY date DESC',
//         [studentId],
//         (err, rows) => {
//           if (err) {
//             reject(err);
//             return;
//           }
//           const payments = rows.map(payment => ({
//             ...payment,
//             paidAmounts: JSON.parse(payment.paid_amounts)
//           }));
//           resolve(payments);
//         }
//       );
//     });
//   }

//   getAllPayments() {
//     return new Promise((resolve, reject) => {
//       this.db.all(
//         `SELECT p.*, s.matricule 
//          FROM payments p 
//          LEFT JOIN students s ON p.student_id = s.id 
//          ORDER BY p.date DESC`,
//         (err, rows) => {
//           if (err) {
//             reject(err);
//             return;
//           }
//           const payments = rows.map(payment => ({
//             ...payment,
//             paidAmounts: JSON.parse(payment.paid_amounts)
//           }));
//           resolve(payments);
//         }
//       );
//     });
//   }

//   deletePayment(id) {
//     return new Promise((resolve, reject) => {
//       this.db.run('DELETE FROM payments WHERE id = ?', [id], function(err) {
//         if (err) {
//           reject(err);
//           return;
//         }
//         resolve(this.changes > 0);
//       });
//     });
//   }

//   // ===== MÉTHODES POUR LES REÇUS =====
//   generateReceipt(paymentId, studentId, receiptData) {
//     return new Promise((resolve, reject) => {
//       const receiptDataStr = JSON.stringify(receiptData);
//       this.db.run(
//         'INSERT INTO receipts (payment_id, student_id, receipt_data) VALUES (?, ?, ?)',
//         [paymentId, studentId, receiptDataStr],
//         function(err) {
//           if (err) {
//             reject(err);
//             return;
//           }
//           resolve({ 
//             id: this.lastID, 
//             paymentId, 
//             studentId, 
//             receiptData 
//           });
//         }
//       );
//     });
//   }

//   getReceiptsByStudent(studentId) {
//     return new Promise((resolve, reject) => {
//       this.db.all(
//         `SELECT r.*, p.receipt_number, p.date 
//          FROM receipts r 
//          JOIN payments p ON r.payment_id = p.id 
//          WHERE r.student_id = ? 
//          ORDER BY p.date DESC`,
//         [studentId],
//         (err, rows) => {
//           if (err) {
//             reject(err);
//             return;
//           }
//           const receipts = rows.map(receipt => ({
//             ...receipt,
//             receiptData: JSON.parse(receipt.receipt_data)
//           }));
//           resolve(receipts);
//         }
//       );
//     });
//   }

//   // ===== STATISTIQUES =====
//   getStatistics() {
//     return new Promise((resolve, reject) => {
//       Promise.all([
//         this.query('SELECT COUNT(*) as count FROM students'),
//         this.query('SELECT COUNT(*) as count FROM payments'),
//         this.query('SELECT SUM(total_paid) as total FROM payments'),
//         this.query(`
//           SELECT 
//             strftime('%Y-%m', date) as month,
//             COUNT(*) as payment_count,
//             SUM(total_paid) as total_amount
//           FROM payments 
//           GROUP BY strftime('%Y-%m', date)
//           ORDER BY month DESC
//           LIMIT 12
//         `)
//       ]).then(([students, payments, amount, paymentsByMonth]) => {
//         resolve({
//           totalStudents: students[0].count,
//           totalPayments: payments[0].count,
//           totalAmount: amount[0].total || 0,
//           paymentsByMonth
//         });
//       }).catch(reject);
//     });
//   }

//   // Méthode utilitaire pour les requêtes
//   query(sql, params = []) {
//     return new Promise((resolve, reject) => {
//       this.db.all(sql, params, (err, rows) => {
//         if (err) reject(err);
//         else resolve(rows);
//       });
//     });
//   }

//   run(sql, params = []) {
//     return new Promise((resolve, reject) => {
//       this.db.run(sql, params, function(err) {
//         if (err) reject(err);
//         else resolve({ lastID: this.lastID, changes: this.changes });
//       });
//     });
//   }

//   close() {
//     if (this.db) {
//       this.db.close();
//     }
//   }
// }

// module.exports = SchoolDB;








































































// const Database = require('better-sqlite3');
// const path = require('path');
// const fs = require('fs');

// class SchoolDB {
//   constructor() {
//     const userDataPath = path.join(require('os').homedir(), '.gestion-scolarite');
    
//     if (!fs.existsSync(userDataPath)) {
//       fs.mkdirSync(userDataPath, { recursive: true });
//     }
    
//     this.dbPath = path.join(userDataPath, 'school.db');
//     this.init();
//   }

//   init() {
//     try {
//       this.db = new Database(this.dbPath);
//       this.db.pragma('journal_mode = WAL');
//       this.createTables();
//       this.seedData();
//       console.log('✅ Base de données initialisée:', this.dbPath);
//     } catch (error) {
//       console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
//       throw error;
//     }
//   }

//   createTables() {
//     // Table des opérateurs
//     this.db.prepare(`
//       CREATE TABLE IF NOT EXISTS operators (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         email TEXT UNIQUE NOT NULL,
//         password TEXT NOT NULL,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//       )
//     `).run();

//     // Table des élèves
//     this.db.prepare(`
//       CREATE TABLE IF NOT EXISTS students (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         class TEXT NOT NULL,
//         section TEXT NOT NULL,
//         school_year TEXT NOT NULL,
//         matricule TEXT UNIQUE,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//       )
//     `).run();

//     // Table des paiements
//     this.db.prepare(`
//       CREATE TABLE IF NOT EXISTS payments (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         student_id INTEGER NOT NULL,
//         student_name TEXT NOT NULL,
//         class_name TEXT NOT NULL,
//         section TEXT NOT NULL,
//         school_year TEXT NOT NULL,
//         paid_amounts TEXT NOT NULL,
//         total_paid INTEGER NOT NULL,
//         receipt_number TEXT UNIQUE NOT NULL,
//         operator TEXT NOT NULL,
//         date DATETIME DEFAULT CURRENT_TIMESTAMP,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (student_id) REFERENCES students (id)
//       )
//     `).run();

//     // Index pour les performances
//     this.db.prepare('CREATE INDEX IF NOT EXISTS idx_students_name ON students(name)').run();
//     this.db.prepare('CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id)').run();
//   }

//   seedData() {
//     // Vérifier si un admin existe
//     const adminExists = this.db.prepare('SELECT COUNT(*) as count FROM operators WHERE email = ?')
//       .get('admin@ecole.com');
    
//     if (adminExists.count === 0) {
//       this.db.prepare(`
//         INSERT INTO operators (name, email, password) 
//         VALUES (?, ?, ?)
//       `).run('Administrateur', 'admin@ecole.com', 'admin123');
//       console.log('👤 Opérateur admin créé');
//     }
//   }

//   /**
//    * Ferme proprement la connexion à la base de données
//    */
//   close() {
//     try {
//       if (this.db && typeof this.db.close === 'function') {
//         this.db.close();
//         console.log('✅ Connexion SQLite fermée proprement');
//         this.db = null;
//       }
//     } catch (error) {
//       console.error('❌ Erreur lors de la fermeture SQLite:', error);
//     }
//   }

//   /**
//    * Vérifie si la base de données est ouverte
//    */
//   isOpen() {
//     return this.db !== null && this.db !== undefined;
//   }

//   /**
//    * Reconnecte la base de données si nécessaire
//    */
//   reconnect() {
//     try {
//       if (!this.isOpen()) {
//         console.log('🔄 Reconnexion à la base de données...');
//         this.db = new Database(this.dbPath);
//         this.db.pragma('journal_mode = WAL');
//         console.log('✅ Base de données reconnectée');
//       }
//     } catch (error) {
//       console.error('❌ Erreur reconnexion DB:', error);
//       throw error;
//     }
//   }

//   // ===== OPÉRATEURS =====
//   getOperatorByEmail(email) {
//     this.reconnect();
//     return this.db.prepare('SELECT * FROM operators WHERE email = ?').get(email);
//   }

//   createOperator(name, email, password) {
//     this.reconnect();
//     const stmt = this.db.prepare('INSERT INTO operators (name, email, password) VALUES (?, ?, ?)');
//     const result = stmt.run(name, email, password);
//     return { id: result.lastInsertRowid, name, email };
//   }

//   // ===== ÉLÈVES =====
//   createStudent(name, class_, section, schoolYear, matricule) {
//     this.reconnect();
//     const stmt = this.db.prepare(`
//       INSERT INTO students (name, class, section, school_year, matricule)
//       VALUES (?, ?, ?, ?, ?)
//     `);
//     const result = stmt.run(name, class_, section, schoolYear, matricule);
//     return { 
//       id: result.lastInsertRowid, 
//       name, 
//       class: class_, 
//       section, 
//       schoolYear, 
//       matricule,
//       createdAt: new Date().toISOString()
//     };
//   }

//   getStudents() {
//     this.reconnect();
//     return this.db.prepare('SELECT * FROM students ORDER BY created_at DESC').all();
//   }

//   getStudent(id) {
//     this.reconnect();
//     return this.db.prepare('SELECT * FROM students WHERE id = ?').get(id);
//   }

//   updateStudent(id, name, class_, section, schoolYear) {
//     this.reconnect();
//     const stmt = this.db.prepare(`
//       UPDATE students 
//       SET name = ?, class = ?, section = ?, school_year = ?
//       WHERE id = ?
//     `);
//     const result = stmt.run(name, class_, section, schoolYear, id);
//     return result.changes > 0 ? { id, name, class: class_, section, schoolYear } : null;
//   }

//   deleteStudent(id) {
//     this.reconnect();
//     // Supprimer d'abord les paiements
//     this.db.prepare('DELETE FROM payments WHERE student_id = ?').run(id);
    
//     // Puis l'élève
//     const stmt = this.db.prepare('DELETE FROM students WHERE id = ?');
//     const result = stmt.run(id);
//     return result.changes > 0;
//   }

//   searchStudents(query) {
//     this.reconnect();
//     return this.db.prepare(`
//       SELECT * FROM students 
//       WHERE name LIKE ? OR matricule LIKE ? OR class LIKE ?
//       ORDER BY name
//     `).all(`%${query}%`, `%${query}%`, `%${query}%`);
//   }

//   // ===== PAIEMENTS =====
//   createPayment(studentId, studentName, className, section, schoolYear, paidAmounts, totalPaid, receiptNumber, operator) {
//     this.reconnect();
//     const stmt = this.db.prepare(`
//       INSERT INTO payments (student_id, student_name, class_name, section, school_year, paid_amounts, total_paid, receipt_number, operator)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `);
//     const paidAmountsStr = JSON.stringify(paidAmounts);
//     const result = stmt.run(studentId, studentName, className, section, schoolYear, paidAmountsStr, totalPaid, receiptNumber, operator);
    
//     return { 
//       id: result.lastInsertRowid,
//       studentId,
//       studentName,
//       className,
//       section,
//       schoolYear,
//       paidAmounts,
//       totalPaid,
//       receiptNumber,
//       operator,
//       date: new Date().toISOString()
//     };
//   }

//   getStudentPayments(studentId) {
//     this.reconnect();
//     const payments = this.db.prepare('SELECT * FROM payments WHERE student_id = ? ORDER BY date DESC').all(studentId);
//     return payments.map(payment => ({
//       ...payment,
//       paidAmounts: JSON.parse(payment.paid_amounts)
//     }));
//   }

//   getAllPayments() {
//     this.reconnect();
//     const payments = this.db.prepare(`
//       SELECT p.*, s.matricule 
//       FROM payments p 
//       LEFT JOIN students s ON p.student_id = s.id 
//       ORDER BY p.date DESC
//     `).all();
    
//     return payments.map(payment => ({
//       ...payment,
//       paidAmounts: JSON.parse(payment.paid_amounts)
//     }));
//   }

//   deletePayment(id) {
//     this.reconnect();
//     const stmt = this.db.prepare('DELETE FROM payments WHERE id = ?');
//     const result = stmt.run(id);
//     return result.changes > 0;
//   }
// }

// module.exports = SchoolDB;

















































































// const sqlite3 = require('sqlite3').verbose();
// const path = require('path');
// const fs = require('fs');

// class SchoolDB {
//   constructor() {
//     const userDataPath = path.join(require('os').homedir(), '.gestion-scolarite');
    
//     if (!fs.existsSync(userDataPath)) {
//       fs.mkdirSync(userDataPath, { recursive: true });
//     }
    
//     this.dbPath = path.join(userDataPath, 'school.db');
//     this.init();
//   }

//   init() {
//     try {
//       this.db = new sqlite3.Database(this.dbPath, (err) => {
//         if (err) {
//           console.error('❌ Erreur connexion SQLite:', err);
//           throw err;
//         }
//         console.log('✅ Base de données initialisée:', this.dbPath);
//         this.createTables();
//         this.seedData();
//       });
//     } catch (error) {
//       console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
//       throw error;
//     }
//   }

//   createTables() {
//     // Créer les tables d'abord
//     const tables = [
//       // Table des opérateurs
//       `CREATE TABLE IF NOT EXISTS operators (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         email TEXT UNIQUE NOT NULL,
//         password TEXT NOT NULL,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//       )`,
      
//       // Table des élèves
//       `CREATE TABLE IF NOT EXISTS students (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         class TEXT NOT NULL,
//         section TEXT NOT NULL,
//         school_year TEXT NOT NULL,
//         matricule TEXT UNIQUE,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//       )`,
      
//       // Table des paiements
//       `CREATE TABLE IF NOT EXISTS payments (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         student_id INTEGER NOT NULL,
//         student_name TEXT NOT NULL,
//         class_name TEXT NOT NULL,
//         section TEXT NOT NULL,
//         school_year TEXT NOT NULL,
//         paid_amounts TEXT NOT NULL,
//         total_paid INTEGER NOT NULL,
//         receipt_number TEXT UNIQUE NOT NULL,
//         operator TEXT NOT NULL,
//         date DATETIME DEFAULT CURRENT_TIMESTAMP,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (student_id) REFERENCES students (id)
//       )`
//     ];

//     // Créer les tables
//     tables.forEach(sql => {
//       this.db.run(sql, (err) => {
//         if (err) console.error('❌ Erreur création table:', err);
//       });
//     });

//     // Créer les index APRÈS les tables (avec un délai)
//     setTimeout(() => {
//       const indexes = [
//         'CREATE INDEX IF NOT EXISTS idx_students_name ON students(name)',
//         'CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id)'
//       ];

//       indexes.forEach(sql => {
//         this.db.run(sql, (err) => {
//           if (err) console.error('❌ Erreur création index:', err);
//         });
//       });
//     }, 200);
//   }

//   seedData() {
//     // Attendre que les tables soient créées
//     setTimeout(() => {
//       // Vérifier si un admin existe
//       this.db.get('SELECT COUNT(*) as count FROM operators WHERE email = ?', ['admin@ecole.com'], (err, row) => {
//         if (err) {
//           console.error('❌ Erreur vérification admin:', err);
//           return;
//         }
        
//         if (!row || row.count === 0) {
//           this.db.run(
//             'INSERT INTO operators (name, email, password) VALUES (?, ?, ?)',
//             ['Administrateur', 'admin@ecole.com', 'admin123'],
//             function(err) {
//               if (err) {
//                 // Ignorer l'erreur si l'admin existe déjà
//                 if (err.code === 'SQLITE_CONSTRAINT') {
//                   console.log('👤 Opérateur admin existe déjà');
//                 } else {
//                   console.error('❌ Erreur création admin:', err);
//                 }
//               } else {
//                 console.log('👤 Opérateur admin créé');
//               }
//             }
//           );
//         } else {
//           console.log('👤 Opérateur admin existe déjà');
//         }
//       });
//     }, 500);
//   }

//   /**
//    * Ferme proprement la connexion à la base de données
//    */
//   close() {
//     try {
//       if (this.db) {
//         this.db.close((err) => {
//           if (err) {
//             console.error('❌ Erreur fermeture SQLite:', err);
//           } else {
//             console.log('✅ Connexion SQLite fermée proprement');
//           }
//         });
//         this.db = null;
//       }
//     } catch (error) {
//       console.error('❌ Erreur lors de la fermeture SQLite:', error);
//     }
//   }

//   /**
//    * Vérifie si la base de données est ouverte
//    */
//   isOpen() {
//     return this.db !== null;
//   }

//   /**
//    * Exécute une requête avec promesse
//    */
//   runAsync(sql, params = []) {
//     return new Promise((resolve, reject) => {
//       this.db.run(sql, params, function(err) {
//         if (err) reject(err);
//         else resolve(this);
//       });
//     });
//   }

//   /**
//    * Récupère une ligne avec promesse
//    */
//   getAsync(sql, params = []) {
//     return new Promise((resolve, reject) => {
//       this.db.get(sql, params, (err, row) => {
//         if (err) reject(err);
//         else resolve(row);
//       });
//     });
//   }

//   /**
//    * Récupère plusieurs lignes avec promesse
//    */
//   allAsync(sql, params = []) {
//     return new Promise((resolve, reject) => {
//       this.db.all(sql, params, (err, rows) => {
//         if (err) reject(err);
//         else resolve(rows);
//       });
//     });
//   }

//   // ===== OPÉRATEURS =====
//   async getOperatorByEmail(email) {
//     try {
//       const operator = await this.getAsync('SELECT * FROM operators WHERE email = ?', [email]);
//       return JSON.parse(JSON.stringify(operator));
//     } catch (error) {
//       console.error('❌ Erreur getOperatorByEmail:', error);
//       throw error;
//     }
//   }

//   async createOperator(name, email, password) {
//     try {
//       const result = await this.runAsync(
//         'INSERT INTO operators (name, email, password) VALUES (?, ?, ?)',
//         [name, email, password]
//       );
//       return { id: result.lastID, name, email };
//     } catch (error) {
//       console.error('❌ Erreur createOperator:', error);
//       throw error;
//     }
//   }

//   // ===== ÉLÈVES =====
//   async createStudent(name, class_, section, schoolYear, matricule) {
//     try {
//       const result = await this.runAsync(
//         'INSERT INTO students (name, class, section, school_year, matricule) VALUES (?, ?, ?, ?, ?)',
//         [name, class_, section, schoolYear, matricule]
//       );
//       return { 
//         id: result.lastID, 
//         name, 
//         class: class_, 
//         section, 
//         schoolYear, 
//         matricule,
//         createdAt: new Date().toISOString()
//       };
//     } catch (error) {
//       console.error('❌ Erreur createStudent:', error);
//       throw error;
//     }
//   }

//   async getStudents() {
//     try {
//       const students = await this.allAsync('SELECT * FROM students ORDER BY created_at DESC');
//       return JSON.parse(JSON.stringify(students));
//     } catch (error) {
//       console.error('❌ Erreur getStudents:', error);
//       throw error;
//     }
//   }

//   async getStudent(id) {
//     try {
//       const student = await this.getAsync('SELECT * FROM students WHERE id = ?', [id]);
//       return JSON.parse(JSON.stringify(student));
//     } catch (error) {
//       console.error('❌ Erreur getStudent:', error);
//       throw error;
//     }
//   }

//   async updateStudent(id, name, class_, section, schoolYear) {
//     try {
//       const result = await this.runAsync(
//         'UPDATE students SET name = ?, class = ?, section = ?, school_year = ? WHERE id = ?',
//         [name, class_, section, schoolYear, id]
//       );
//       return result.changes > 0 ? { id, name, class: class_, section, schoolYear } : null;
//     } catch (error) {
//       console.error('❌ Erreur updateStudent:', error);
//       throw error;
//     }
//   }

//   async deleteStudent(id) {
//     try {
//       // Supprimer d'abord les paiements
//       await this.runAsync('DELETE FROM payments WHERE student_id = ?', [id]);
      
//       // Puis l'élève
//       const result = await this.runAsync('DELETE FROM students WHERE id = ?', [id]);
//       return result.changes > 0;
//     } catch (error) {
//       console.error('❌ Erreur deleteStudent:', error);
//       throw error;
//     }
//   }

//   async searchStudents(query) {
//     try {
//       const students = await this.allAsync(
//         'SELECT * FROM students WHERE name LIKE ? OR matricule LIKE ? OR class LIKE ? ORDER BY name',
//         [`%${query}%`, `%${query}%`, `%${query}%`]
//       );
//       return JSON.parse(JSON.stringify(students));
//     } catch (error) {
//       console.error('❌ Erreur searchStudents:', error);
//       throw error;
//     }
//   }

//   // ===== PAIEMENTS =====
//   async createPayment(studentId, studentName, className, section, schoolYear, paidAmounts, totalPaid, receiptNumber, operator) {
//     try {
//       const paidAmountsStr = JSON.stringify(paidAmounts);
//       const result = await this.runAsync(
//         `INSERT INTO payments (student_id, student_name, class_name, section, school_year, paid_amounts, total_paid, receipt_number, operator)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [studentId, studentName, className, section, schoolYear, paidAmountsStr, totalPaid, receiptNumber, operator]
//       );
      
//       return { 
//         id: result.lastID,
//         studentId,
//         studentName,
//         className,
//         section,
//         schoolYear,
//         paidAmounts,
//         totalPaid,
//         receiptNumber,
//         operator,
//         date: new Date().toISOString()
//       };
//     } catch (error) {
//       console.error('❌ Erreur createPayment:', error);
//       throw error;
//     }
//   }

//   async getStudentPayments(studentId) {
//     try {
//       const payments = await this.allAsync(
//         'SELECT * FROM payments WHERE student_id = ? ORDER BY date DESC',
//         [studentId]
//       );
//       const cleanedPayments = payments.map(payment => ({
//         ...JSON.parse(JSON.stringify(payment)),
//         paidAmounts: JSON.parse(payment.paid_amounts)
//       }));
//       return cleanedPayments;
//     } catch (error) {
//       console.error('❌ Erreur getStudentPayments:', error);
//       throw error;
//     }
//   }

//   async getAllPayments() {
//     try {
//       const payments = await this.allAsync(`
//         SELECT p.*, s.matricule 
//         FROM payments p 
//         LEFT JOIN students s ON p.student_id = s.id 
//         ORDER BY p.date DESC
//       `);
      
//       const cleanedPayments = payments.map(payment => ({
//         ...JSON.parse(JSON.stringify(payment)),
//         paidAmounts: JSON.parse(payment.paid_amounts)
//       }));
//       return cleanedPayments;
//     } catch (error) {
//       console.error('❌ Erreur getAllPayments:', error);
//       throw error;
//     }
//   }

//   async deletePayment(id) {
//     try {
//       const result = await this.runAsync('DELETE FROM payments WHERE id = ?', [id]);
//       return result.changes > 0;
//     } catch (error) {
//       console.error('❌ Erreur deletePayment:', error);
//       throw error;
//     }
//   }
// }

// module.exports = SchoolDB;




































































const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class SchoolDB {
  constructor() {
    const userDataPath = path.join(require('os').homedir(), '.gestion-scolarite');
    if (!fs.existsSync(userDataPath)) fs.mkdirSync(userDataPath, { recursive: true });
    
    this.dbPath = path.join(userDataPath, 'school.db');
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) throw err;
      console.log('✅ Base de données:', this.dbPath);
      this.createTables();
      this.seedData();
    });
  }

  createTables() {
    const tables = [
      `CREATE TABLE IF NOT EXISTS operators (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
      `CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY, name TEXT NOT NULL, class TEXT NOT NULL, section TEXT NOT NULL, school_year TEXT NOT NULL, matricule TEXT UNIQUE, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
      `CREATE TABLE IF NOT EXISTS payments (id INTEGER PRIMARY KEY, student_id INTEGER NOT NULL, student_name TEXT NOT NULL, class_name TEXT NOT NULL, section TEXT NOT NULL, school_year TEXT NOT NULL, paid_amounts TEXT NOT NULL, total_paid INTEGER NOT NULL, receipt_number TEXT UNIQUE NOT NULL, operator TEXT NOT NULL, date DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (student_id) REFERENCES students (id))`
    ];
    tables.forEach(sql => this.db.run(sql));
  }

  seedData() {
    this.db.get('SELECT COUNT(*) as count FROM operators WHERE email = ?', ['admin'], (err, row) => {
      if (!err && (!row || row.count === 0)) {
        this.db.run('INSERT INTO operators (name, email, password) VALUES (?, ?, ?)', 
          ['Administrateur', 'admin', 'admin123']);
      }
    });
  }

  // PROMESSES
  runAsync(sql, params = []) { return new Promise((r, j) => this.db.run(sql, params, function(e) { e ? j(e) : r(this); })); }
  getAsync(sql, params = []) { return new Promise((r, j) => this.db.get(sql, params, (e, row) => { e ? j(e) : r(row); })); }
  allAsync(sql, params = []) { return new Promise((r, j) => this.db.all(sql, params, (e, rows) => { e ? j(e) : r(rows); })); }

  // OPÉRATEURS
  async getOperatorByEmail(email) {
    try { return await this.getAsync('SELECT * FROM operators WHERE email = ?', [email]); } 
    catch (error) { console.error('❌ getOperatorByEmail:', error); throw error; }
  }

  async createOperator(name, email, password) {
    try {
      const result = await this.runAsync('INSERT INTO operators (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
      return { id: result.lastID, name, email };
    } catch (error) { console.error('❌ createOperator:', error); throw error; }
  }

  // ÉLÈVES
  async createStudent(name, class_, section, schoolYear, matricule) {
    try {
      const result = await this.runAsync('INSERT INTO students (name, class, section, school_year, matricule) VALUES (?, ?, ?, ?, ?)', 
        [name, class_, section, schoolYear, matricule]);
      return { id: result.lastID, name, class: class_, section, schoolYear, matricule };
    } catch (error) { console.error('❌ createStudent:', error); throw error; }
  }

  async getStudents() {
    try { return await this.allAsync('SELECT * FROM students ORDER BY created_at DESC'); } 
    catch (error) { console.error('❌ getStudents:', error); throw error; }
  }

  async getStudent(id) {
    try { return await this.getAsync('SELECT * FROM students WHERE id = ?', [id]); } 
    catch (error) { console.error('❌ getStudent:', error); throw error; }
  }

  async updateStudent(id, name, class_, section, schoolYear) {
    try {
      const result = await this.runAsync('UPDATE students SET name = ?, class = ?, section = ?, school_year = ? WHERE id = ?', 
        [name, class_, section, schoolYear, id]);
      return result.changes > 0 ? { id, name, class: class_, section, schoolYear } : null;
    } catch (error) { console.error('❌ updateStudent:', error); throw error; }
  }

  async deleteStudent(id) {
    try {
      await this.runAsync('DELETE FROM payments WHERE student_id = ?', [id]);
      const result = await this.runAsync('DELETE FROM students WHERE id = ?', [id]);
      return result.changes > 0;
    } catch (error) { console.error('❌ deleteStudent:', error); throw error; }
  }

  // PAIEMENTS
  async createPayment(studentId, studentName, className, section, schoolYear, paidAmounts, totalPaid, receiptNumber, operator) {
    try {
      const result = await this.runAsync(
        `INSERT INTO payments (student_id, student_name, class_name, section, school_year, paid_amounts, total_paid, receipt_number, operator) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [studentId, studentName, className, section, schoolYear, JSON.stringify(paidAmounts), totalPaid, receiptNumber, operator]
      );
      return { id: result.lastID, studentId, studentName, className, section, schoolYear, paidAmounts, totalPaid, receiptNumber, operator };
    } catch (error) { console.error('❌ createPayment:', error); throw error; }
  }

  async getStudentPayments(studentId) {
    try {
      const payments = await this.allAsync('SELECT * FROM payments WHERE student_id = ? ORDER BY date DESC', [studentId]);
      return payments.map(p => ({ ...p, paidAmounts: JSON.parse(p.paid_amounts) }));
    } catch (error) { console.error('❌ getStudentPayments:', error); throw error; }
  }

  async getAllPayments() {
    try {
      const payments = await this.allAsync('SELECT p.*, s.matricule FROM payments p LEFT JOIN students s ON p.student_id = s.id ORDER BY p.date DESC');
      return payments.map(p => ({ ...p, paidAmounts: JSON.parse(p.paid_amounts) }));
    } catch (error) { console.error('❌ getAllPayments:', error); throw error; }
  }

  async deletePayment(id) {
    try {
      const result = await this.runAsync('DELETE FROM payments WHERE id = ?', [id]);
      return result.changes > 0;
    } catch (error) { console.error('❌ deletePayment:', error); throw error; }
  }

  close() {
    if (this.db) this.db.close();
  }
}

module.exports = SchoolDB;