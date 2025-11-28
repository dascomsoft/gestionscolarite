// API pour communiquer avec Electron ou utiliser localStorage en fallback
const isElectron = window.electronAPI ? true : false;

// Fonction helper pour appeler l'API de la base de données via Electron
const dbInvoke = async (method, ...params) => {
  if (isElectron) {
    const result = await window.electronAPI.database.invoke(method, ...params);
    if (result.success) {
      return result.result;
    } else {
      throw new Error(result.error);
    }
  } else {
    // Fallback vers localStorage pour le développement dans le navigateur
    return await mockDB[method](...params);
  }
};

// Mock des fonctions pour le développement dans le navigateur
const mockDB = {
  // Opérateurs
  createOperator: async (name, email, password) => {
    const operators = JSON.parse(localStorage.getItem('operators') || '[]');
    const newOperator = { id: Date.now(), name, email, password };
    operators.push(newOperator);
    localStorage.setItem('operators', JSON.stringify(operators));
    return newOperator;
  },

  getOperatorByEmail: async (email) => {
    const operators = JSON.parse(localStorage.getItem('operators') || '[]');
    return operators.find(op => op.email === email);
  },

  // Élèves - CODE CORRIGÉ ICI
  // createStudent: async (name, class_, section, schoolYear, matricule) => {
  //   const students = JSON.parse(localStorage.getItem('students') || '[]');
  //   const newStudent = {
  //     id: Date.now(),
  //     name,
  //     class: class_,
  //     section,
  //     schoolYear: schoolYear, // CORRECTION : bien assigner schoolYear
  //     matricule,
  //     createdAt: new Date().toISOString()
  //   };
  //   students.push(newStudent);
  //   localStorage.setItem('students', JSON.stringify(students));
  //   return newStudent;
  // },




// Élèves
createStudent: async (name, class_, section, schoolYear, matricule) => {
  const students = JSON.parse(localStorage.getItem('students') || '[]');

  // 🔧 Générer automatiquement l'année scolaire si absente
  const currentYear = new Date().getFullYear();
  const year = schoolYear || `${currentYear}-${currentYear + 1}`;

  const newStudent = {
    id: Date.now(),
    name,
    class: class_,
    section,
    schoolYear: year,
    matricule,
    createdAt: new Date().toISOString()
  };

  students.push(newStudent);
  localStorage.setItem('students', JSON.stringify(students));
  return newStudent;
},

  getStudents: async () => {
    return JSON.parse(localStorage.getItem('students') || '[]');
  },

  getStudent: async (id) => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    return students.find(student => student.id === id);
  },

  updateStudent: async (id, name, class_, section, schoolYear) => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const index = students.findIndex(student => student.id === id);
    if (index !== -1) {
      students[index] = {
        ...students[index],
        name,
        class: class_,
        section,
        schoolYear: schoolYear // CORRECTION ici aussi
      };
      localStorage.setItem('students', JSON.stringify(students));
      return students[index];
    }
    throw new Error('Élève non trouvé');
  },

  deleteStudent: async (id) => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const filtered = students.filter(student => student.id !== id);
    localStorage.setItem('students', JSON.stringify(filtered));

    // Supprimer aussi les paiements associés
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const filteredPayments = payments.filter(payment => payment.studentId !== id);
    localStorage.setItem('payments', JSON.stringify(filteredPayments));

    return true;
  },

  searchStudents: async (query) => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    return students.filter(student =>
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.matricule?.toLowerCase().includes(query.toLowerCase()) ||
      student.class.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Paiements
  // createPayment: async (studentId, studentName, className, section, schoolYear, paidAmounts, totalPaid, receiptNumber, operator) => {
  //   const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  //   const newPayment = {
  //     id: Date.now(),
  //     studentId,
  //     studentName,
  //     className,
  //     section,
  //     schoolYear, // CORRECTION : bien assigner schoolYear
  //     paidAmounts,
  //     totalPaid,
  //     receiptNumber,
  //     operator,
  //     date: new Date().toISOString(),
  //     createdAt: new Date().toISOString()
  //   };
  //   payments.push(newPayment);
  //   localStorage.setItem('payments', JSON.stringify(payments));
  //   return newPayment;
  // },











createPayment: async (studentId, studentName, className, section, schoolYear, paidAmounts, totalPaid, receiptNumber, operator) => {
  const payments = JSON.parse(localStorage.getItem('payments') || '[]');

  // 🔧 Générer automatiquement l'année scolaire si absente
  const currentYear = new Date().getFullYear();
  const year = schoolYear || `${currentYear}-${currentYear + 1}`;

  const newPayment = {
    id: Date.now(),
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
  };

  payments.push(newPayment);
  localStorage.setItem('payments', JSON.stringify(payments));
  return newPayment;
},



















  getStudentPayments: async (studentId) => {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    return payments.filter(payment => payment.studentId === studentId);
  },

  deletePayment: async (id) => {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const filtered = payments.filter(payment => payment.id !== id);
    localStorage.setItem('payments', JSON.stringify(filtered));
    return true;
  },

  getAllPayments: async () => {
    return JSON.parse(localStorage.getItem('payments') || '[]');
  },

  // Reçus
  generateReceipt: async (paymentId, studentId, receiptData) => {
    const receipts = JSON.parse(localStorage.getItem('receipts') || '[]');
    const newReceipt = {
      id: Date.now(),
      paymentId,
      studentId,
      receiptData,
      createdAt: new Date().toISOString()
    };
    receipts.push(newReceipt);
    localStorage.setItem('receipts', JSON.stringify(receipts));
    return newReceipt;
  },

  getReceiptsByStudent: async (studentId) => {
    const receipts = JSON.parse(localStorage.getItem('receipts') || '[]');
    return receipts.filter(receipt => receipt.studentId === studentId);
  },

  // Statistiques
  getStatistics: async () => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');

    const totalAmount = payments.reduce((sum, payment) => sum + (payment.totalPaid || 0), 0);

    return {
      totalStudents: students.length,
      totalPayments: payments.length,
      totalAmount,
      paymentsByMonth: []
    };
  }
};

// API unifiée
export const api = {
  // Opérateurs
  login: async (email, password) => {
    if (isElectron) {
      const operator = await dbInvoke('getOperatorByEmail', email);
      if (operator && operator.password === password) {
        const { password, ...user } = operator;
        return user;
      }
      throw new Error('Email ou mot de passe incorrect');
    } else {
      // Mock pour le développement
      const operators = JSON.parse(localStorage.getItem('operators') || '[]');
      let operator = operators.find(op => op.email === email);

      if (!operator) {
        // Créer un opérateur par défaut si aucun n'existe
        operator = { id: 1, name: 'Administrateur', email, password: 'admin' };
        operators.push(operator);
        localStorage.setItem('operators', JSON.stringify(operators));
      }

      if (operator.password === password) {
        const { password, ...user } = operator;
        return user;
      }
      throw new Error('Email ou mot de passe incorrect');
    }
  },

  createOperator: async (operatorData) => {
    return await dbInvoke('createOperator', operatorData.name, operatorData.email, operatorData.password);
  },

  // Élèves
  createStudent: async (studentData) => {
    return await dbInvoke('createStudent',
      studentData.name,
      studentData.class,
      studentData.section,
      studentData.schoolYear,
      studentData.matricule
    );
  },

  getStudents: async () => {
    return await dbInvoke('getStudents');
  },

  getStudent: async (id) => {
    return await dbInvoke('getStudent', id);
  },

  updateStudent: async (id, studentData) => {
    return await dbInvoke('updateStudent',
      id,
      studentData.name,
      studentData.class,
      studentData.section,
      studentData.schoolYear
    );
  },

  deleteStudent: async (id) => {
    return await dbInvoke('deleteStudent', id);
  },

  searchStudents: async (query) => {
    return await dbInvoke('searchStudents', query);
  },

  // Paiements
  createPayment: async (paymentData) => {
    return await dbInvoke('createPayment',
      paymentData.studentId,
      paymentData.studentName,
      paymentData.className,
      paymentData.section,
      paymentData.schoolYear,
      paymentData.paidAmounts,
      paymentData.totalPaid,
      paymentData.receiptNumber,
      paymentData.operator
    );
  },

  getStudentPayments: async (studentId) => {
    return await dbInvoke('getStudentPayments', studentId);
  },

  deletePayment: async (id) => {
    return await dbInvoke('deletePayment', id);
  },

  getAllPayments: async () => {
    return await dbInvoke('getAllPayments');
  },

  // Reçus
  generateReceipt: async (receiptData) => {
    return await dbInvoke('generateReceipt',
      receiptData.paymentId,
      receiptData.studentId,
      receiptData
    );
  },

  getReceiptsByStudent: async (studentId) => {
    return await dbInvoke('getReceiptsByStudent', studentId);
  },

  // Statistiques
  getStatistics: async () => {
    return await dbInvoke('getStatistics');
  },

  // Application
  getAppVersion: async () => {
    if (isElectron) {
      return await window.electronAPI.app.getVersion();
    }
    return '1.0.0-dev';
  }
};