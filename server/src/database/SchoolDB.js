const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');
const os = require('os');

class SchoolDB {
  constructor() {
    // Chemin vers la base de données dans le dossier utilisateur
    const userDataPath = path.join(os.homedir(), '.gestion-scolarite');
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }
    
    this.dbPath = path.join(userDataPath, 'school.db');
  }

  init() {
    return new Promise((resolve, reject) => {
      try {
        this.db = new sqlite3.Database(this.dbPath, (err) => {
          if (err) {
            console.error('Erreur connexion DB:', err);
            reject(err);
            return;
          }
          
          console.log('Base de données initialisée:', this.dbPath);
          this.createTables()
            .then(() => this.seedData())
            .then(() => resolve())
            .catch(reject);
        });
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        reject(error);
      }
    });
  }

  createTables() {
    return new Promise((resolve, reject) => {
      const queries = [
        // Table des opérateurs
        `CREATE TABLE IF NOT EXISTS operators (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        
        // Table des élèves
        `CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          class TEXT NOT NULL,
          section TEXT NOT NULL,
          school_year TEXT NOT NULL,
          matricule TEXT UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        
        // Table des paiements
        `CREATE TABLE IF NOT EXISTS payments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER NOT NULL,
          student_name TEXT NOT NULL,
          class_name TEXT NOT NULL,
          section TEXT NOT NULL,
          school_year TEXT NOT NULL,
          paid_amounts TEXT NOT NULL,
          total_paid INTEGER NOT NULL,
          receipt_number TEXT UNIQUE NOT NULL,
          operator TEXT NOT NULL,
          date DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
        )`,
        
        // Table des reçus
        `CREATE TABLE IF NOT EXISTS receipts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          payment_id INTEGER NOT NULL,
          student_id INTEGER NOT NULL,
          receipt_data TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (payment_id) REFERENCES payments (id) ON DELETE CASCADE,
          FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
        )`,
        
        // Index
        'CREATE INDEX IF NOT EXISTS idx_students_name ON students(name)',
        'CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id)',
        'CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(date)'
      ];

      let completed = 0;
      queries.forEach(query => {
        this.db.run(query, (err) => {
          if (err) {
            console.error('Erreur création table:', err);
            reject(err);
            return;
          }
          completed++;
          if (completed === queries.length) {
            console.log('Toutes les tables créées');
            resolve();
          }
        });
      });
    });
  }

  seedData() {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT COUNT(*) as count FROM operators WHERE email = ?', ['admin@ecole.com'], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (row.count === 0) {
          this.db.run(
            'INSERT INTO operators (name, email, password) VALUES (?, ?, ?)',
            ['Administrateur', 'admin@ecole.com', 'admin123'],
            function(err) {
              if (err) {
                reject(err);
                return;
              }
              console.log('Opérateur admin créé');
              resolve();
            }
          );
        } else {
          resolve();
        }
      });
    });
  }

  // ===== MÉTHODES POUR LES OPÉRATEURS =====
  createOperator(name, email, password) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO operators (name, email, password) VALUES (?, ?, ?)',
        [name, email, password],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ id: this.lastID, name, email });
        }
      );
    });
  }

  getOperatorByEmail(email) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM operators WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // ===== MÉTHODES POUR LES ÉLÈVES =====
  createStudent(name, class_, section, schoolYear, matricule) {
    return new Promise((resolve, reject) => {
      const currentYear = new Date().getFullYear();
      const year = schoolYear || `${currentYear}-${currentYear + 1}`;

      this.db.run(
        'INSERT INTO students (name, class, section, school_year, matricule) VALUES (?, ?, ?, ?, ?)',
        [name, class_, section, year, matricule],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ 
            id: this.lastID, 
            name, 
            class: class_, 
            section, 
            schoolYear: year, 
            matricule,
            createdAt: new Date().toISOString()
          });
        }
      );
    });
  }

  getStudents() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM students ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  getStudent(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  updateStudent(id, name, class_, section, schoolYear) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE students SET name = ?, class = ?, section = ?, school_year = ? WHERE id = ?',
        [name, class_, section, schoolYear, id],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.changes > 0 ? { id, name, class: class_, section, schoolYear } : null);
        }
      );
    });
  }

  deleteStudent(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM students WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes > 0);
      });
    });
  }

  searchStudents(query) {
    return new Promise((resolve, reject) => {
      const searchTerm = `%${query}%`;
      this.db.all(
        'SELECT * FROM students WHERE name LIKE ? OR matricule LIKE ? OR class LIKE ? ORDER BY name',
        [searchTerm, searchTerm, searchTerm],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  // ===== MÉTHODES POUR LES PAIEMENTS =====
  createPayment(studentId, studentName, className, section, schoolYear, paidAmounts, totalPaid, receiptNumber, operator) {
    return new Promise((resolve, reject) => {
      const currentYear = new Date().getFullYear();
      const year = schoolYear || `${currentYear}-${currentYear + 1}`;
      const paidAmountsStr = JSON.stringify(paidAmounts);

      this.db.run(
        'INSERT INTO payments (student_id, student_name, class_name, section, school_year, paid_amounts, total_paid, receipt_number, operator) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [studentId, studentName, className, section, year, paidAmountsStr, totalPaid, receiptNumber, operator],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ 
            id: this.lastID,
            studentId,
            studentName,
            className,
            section,
            schoolYear: year,
            paidAmounts,
            totalPaid,
            receiptNumber,
            operator,
            date: new Date().toISOString(),
            createdAt: new Date().toISOString()
          });
        }
      );
    });
  }

  getStudentPayments(studentId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM payments WHERE student_id = ? ORDER BY date DESC',
        [studentId],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          const payments = rows.map(payment => ({
            ...payment,
            paidAmounts: JSON.parse(payment.paid_amounts)
          }));
          resolve(payments);
        }
      );
    });
  }

  getAllPayments() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT p.*, s.matricule 
         FROM payments p 
         LEFT JOIN students s ON p.student_id = s.id 
         ORDER BY p.date DESC`,
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          const payments = rows.map(payment => ({
            ...payment,
            paidAmounts: JSON.parse(payment.paid_amounts)
          }));
          resolve(payments);
        }
      );
    });
  }

  deletePayment(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM payments WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes > 0);
      });
    });
  }

  // ===== MÉTHODES POUR LES REÇUS =====
  generateReceipt(paymentId, studentId, receiptData) {
    return new Promise((resolve, reject) => {
      const receiptDataStr = JSON.stringify(receiptData);
      this.db.run(
        'INSERT INTO receipts (payment_id, student_id, receipt_data) VALUES (?, ?, ?)',
        [paymentId, studentId, receiptDataStr],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ 
            id: this.lastID, 
            paymentId, 
            studentId, 
            receiptData 
          });
        }
      );
    });
  }

  getReceiptsByStudent(studentId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT r.*, p.receipt_number, p.date 
         FROM receipts r 
         JOIN payments p ON r.payment_id = p.id 
         WHERE r.student_id = ? 
         ORDER BY p.date DESC`,
        [studentId],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          const receipts = rows.map(receipt => ({
            ...receipt,
            receiptData: JSON.parse(receipt.receipt_data)
          }));
          resolve(receipts);
        }
      );
    });
  }

  // ===== STATISTIQUES =====
  getStatistics() {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.query('SELECT COUNT(*) as count FROM students'),
        this.query('SELECT COUNT(*) as count FROM payments'),
        this.query('SELECT SUM(total_paid) as total FROM payments'),
        this.query(`
          SELECT 
            strftime('%Y-%m', date) as month,
            COUNT(*) as payment_count,
            SUM(total_paid) as total_amount
          FROM payments 
          GROUP BY strftime('%Y-%m', date)
          ORDER BY month DESC
          LIMIT 12
        `)
      ]).then(([students, payments, amount, paymentsByMonth]) => {
        resolve({
          totalStudents: students[0].count,
          totalPayments: payments[0].count,
          totalAmount: amount[0].total || 0,
          paymentsByMonth
        });
      }).catch(reject);
    });
  }

  // Méthode utilitaire pour les requêtes
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = SchoolDB;