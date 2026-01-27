

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