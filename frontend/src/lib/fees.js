

// export const FEES = {
//   im2: { // Section anglophone
//     nursery: {
//       classes: ["Nursery 1", "Nursery 2"],
//       inscription: 10000,
//       pension: [
//         { tranche: "1ère Tranche", amount: 35000 },
//         { tranche: "2e Tranche", amount: 15000 },
//         { tranche: "3e Tranche", amount: 5000 },
//       ],
//     },
//     primary: {
//       classes: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6"],
//       inscription: 10000,
//       pension: [
//         { tranche: "1ère Tranche", amount: 35000 },
//         { tranche: "2e Tranche", amount: 10000 },
//         { tranche: "3e Tranche", amount: 5000 },
//       ],
//     },
//   },

//   im1: { // Section francophone
//     maternelle: {
//       classes: ["Maternelle", "Pré-maternelle"],
//       inscription: 10000,
//       pension: [
//         { tranche: "1ère Tranche", amount: 35000 },
//         { tranche: "2e Tranche", amount: 10000 },
//         { tranche: "3e Tranche", amount: 5000 },
//       ],
//     },
//     sil_cm1: {
//       classes: ["SIL", "CP", "CE1", "CE2", "CM1"],
//       inscription: 10000,
//       pension: [
//         { tranche: "1ère Tranche", amount: 20000 },
//         { tranche: "2e Tranche", amount: 10000 },
//         { tranche: "3e Tranche", amount: 5000 },
//       ],
//     },
//     cm2: {
//       classes: ["CM2"],
//       inscription: 15000,
//       pension: [
//         { tranche: "1ère Tranche", amount: 35000 },
//         { tranche: "2e Tranche", amount: 10000 },
//         { tranche: "3e Tranche", amount: 5000 },
//       ],
//     },
//   },
// };

// /**
//  * Fonction utilitaire pour récupérer les barèmes
//  * @param {string} section - "im1" ou "im2"
//  * @param {string} cls - classe choisie
//  * @returns {object|null} - barème correspondant
//  */
// export function getFees(section, cls) {
//   const sec = FEES[section];
//   if (!sec) return null;

//   for (const key in sec) {
//     if (sec[key].classes.includes(cls)) {
//       return sec[key];
//     }
//   }
//   return null;
// }























































export const FEES = {
  im2: { // Section anglophone
    nursery: {
      classes: ["Nursery 1", "Nursery 2"],
      inscription: 10000,
      fraisAnnexes: 5000, // AJOUT
      pension: [
        { tranche: "1ère Tranche", amount: 35000 },
        { tranche: "2e Tranche", amount: 15000 },
        { tranche: "3e Tranche", amount: 5000 },
      ],
    },
    primary: {
      classes: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6"],
      inscription: 10000,
      fraisAnnexes: 5000, // AJOUT
      pension: [
        { tranche: "1ère Tranche", amount: 35000 },
        { tranche: "2e Tranche", amount: 10000 },
        { tranche: "3e Tranche", amount: 5000 },
      ],
    },
  },

  im1: { // Section francophone
    maternelle: {
      classes: ["Maternelle", "Pré-maternelle"],
      inscription: 10000,
      fraisAnnexes: 5000, // AJOUT
      pension: [
        { tranche: "1ère Tranche", amount: 35000 },
        { tranche: "2e Tranche", amount: 10000 },
        { tranche: "3e Tranche", amount: 5000 },
      ],
    },
    sil_cm1: {
      classes: ["SIL", "CP", "CE1", "CE2", "CM1"],
      inscription: 10000,
      fraisAnnexes: 5000, // AJOUT
      pension: [
        { tranche: "1ère Tranche", amount: 20000 },
        { tranche: "2e Tranche", amount: 10000 },
        { tranche: "3e Tranche", amount: 5000 },
      ],
    },
    cm2: {
      classes: ["CM2"],
      inscription: 15000,
      fraisAnnexes: 5000, // AJOUT
      pension: [
        { tranche: "1ère Tranche", amount: 35000 },
        { tranche: "2e Tranche", amount: 10000 },
        { tranche: "3e Tranche", amount: 5000 },
      ],
    },
  },
};

/**
 * Fonction utilitaire pour récupérer les barèmes
 * @param {string} section - "im1" ou "im2"
 * @param {string} cls - classe choisie
 * @returns {object|null} - barème correspondant
 */
export function getFees(section, cls) {
  const sec = FEES[section];
  if (!sec) return null;

  for (const key in sec) {
    if (sec[key].classes.includes(cls)) {
      return sec[key];
    }
  }
  return null;
}