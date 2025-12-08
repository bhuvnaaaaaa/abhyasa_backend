import mongoose from "mongoose";
import dotenv from "dotenv";

import Board from "../models/boardModel.js";
import Grade from "../models/gradeModel.js";
import Subject from "../models/subjectModel.js";
import Chapter from "../models/chapterModel.js";

dotenv.config();

// -----------------------------------------
// CONNECT DB
// -----------------------------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully (Seed)");
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
};

// -----------------------------------------
// CONFIGURABLE DATA
// -----------------------------------------
const boards = [
  {
    name: "CBSE",
    grades: ["6", "7", "8", "9", "10"],
  subjects: [
    { name: "Biology", chapterCount: 12 },
    { name: "Chemistry", chapterCount: 12 },
    { name: "Mathematics", chapterCount: 12 },
    { name: "Physics", chapterCount: 12 },
  ],
  },
  {
    name: "ICSE",
    grades: ["6", "7", "8", "9", "10"],
    subjects: [
      { name: "Biology", chapterCount: 8 },
      { name: "Chemistry", chapterCount: 8 },
      { name: "Mathematics", chapterCount: 12 },
      { name: "Physics", chapterCount: 8 },
    ],
  },
  {
    name: "State Board",
    grades: ["6", "7", "8", "9", "10"],
    subjects: [
      { name: "Biology", chapterCount: 8 },
      { name: "Chemistry", chapterCount: 8 },
      { name: "Mathematics", chapterCount: 12 },
      { name: "Physics", chapterCount: 8 },
    ],
  },
];

// -----------------------------------------
// SEED FUNCTION
// -----------------------------------------
const seedAll = async () => {
  try {
    await connectDB();

    console.log("Clearing old data...");
    await Board.deleteMany({});
    await Grade.deleteMany({});
    await Subject.deleteMany({});
    await Chapter.deleteMany({});
    console.log("Old data cleared.\n");

    for (const boardData of boards) {
      console.log(`Creating Board: ${boardData.name}`);

      const board = await Board.create({ name: boardData.name });

      for (const gradeName of boardData.grades) {
        console.log(`   ↳ Creating Grade ${gradeName}`);

        const grade = await Grade.create({
          grade: gradeName,
          board: board._id,
        });

        for (const subjectInfo of boardData.subjects) {
          console.log(`      ↳ Subject: ${subjectInfo.name}`);

          const subject = await Subject.create({
            name: subjectInfo.name,
            board: board._id,
            grade: grade._id,
          });

          // ------------------------------
          // AUTO-CREATE CHAPTERS (FIXED)
          // ------------------------------
          const chapterPromises = [];

          for (let i = 1; i <= subjectInfo.chapterCount; i++) {
            let chapterTitle = `Chapter ${i}`;
            let chapterContent = [
              {
                type: 'mcq',
                question: `Demo MCQ question for ${subjectInfo.name} Chapter ${i}`,
                options: ["Option A", "Option B", "Option C", "Option D"],
                answer: 0,
                reason: "This is a demo explanation. Content will be updated soon.",
              },
              {
                type: 'mcq',
                question: `Another demo MCQ for ${subjectInfo.name} - ${i}`,
                options: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
                answer: 1,
                reason: "Demo answer explanation. Replace with actual content.",
              },
              {
                type: 'mcq',
                question: `Third demo question in Chapter ${i}`,
                options: ["Yes", "No", "Maybe", "Always"],
                answer: 2,
                reason: "Demo response. Update with real content.",
              },
            ];

            // Special content for Chemistry Chapter 1: Chemical Bonding
            if (subjectInfo.name === 'Chemistry' && i === 1) {
              chapterTitle = 'Chemical Bonding';
              chapterContent = [
                {
                  type: 'mcq',
                  question: '1. The property which is characteristic of an electrovalent compound is that :',
                  options: [
                    'it is easily vaporized',
                    'it has a high melting point',
                    'it is a weak electrolyte',
                    'it often exists as a liquid'
                  ],
                  answer: 1,
                  reason: "It has a high melting point — Electrovalent compounds have a high melting point because there exists a strong force of attraction between the oppositely charged ions, so a large amount of energy is required to break the strong bonding force between ions."
                },
                {
                  type: 'mcq',
                  question: '2. When a metal atom becomes an ion :',
                  options: [
                    'it loses electrons and is oxidized',
                    'it gains electrons and is reduced',
                    'it gains electrons and is oxidized',
                    'it loses electrons and is reduced'
                  ],
                  answer: 0,
                  reason: "It loses electrons and is oxidized — Metals readily give the valence electron during reactions and are hence oxidised."
                },
                {
                  type: 'mcq',
                  question: '3. Which of the following compounds has all three bonds — ionic, covalent and coordinate bonds?',
                  options: [
                    'Ammonia',
                    'Ammonium chloride',
                    'Sodium hydroxide',
                    'Calcium chloride'
                  ],
                  answer: 1,
                  reason: "Ammonium chloride — When ammonium chloride NH4Cl is formed cation NH4+ (having 3 covalent and one coordinate bond) and anion Cl- are attracted towards each other, due to electrical charge existing between them and ionic bond is formed. Thus, ammonium chloride is a good example of compound having all three types of bonds i.e., covalent, coordinate and ionic bond."
                },
                {
                  type: 'mcq',
                  question: '4. Which of the following is not a typical property of an ionic compound ?',
                  options: [
                    'High melting point',
                    'Conduction of electricity in molten and aqueous states',
                    'Insolubility in water',
                    'Existence as oppositely charged ions even in the solid state.'
                  ],
                  answer: 2,
                  reason: "Insolubility in water. — Ionic compounds are soluble in water. They are insoluble in organic solvents. Water [polar solvent] has a high dielectric constant i.e., capacity to weaken the force of attraction, thus resulting in free ions. Organic solvents [non-polar] have low dielectric constants and do not cause dissolution."
                },
                {
                  type: 'mcq',
                  question: 'Metals lose electrons during ionization. This change is called:',
                  options: [
                    'Oxidation',
                    'Reduction',
                    'Redox reaction',
                    'Displacement'
                  ],
                  answer: 0,
                  reason: "Oxidation — Oxidation is the process when an atom or ion loses electrons in order to attain a stable state."
                },
                {
                  type: 'mcq',
                  question: "5. Compound 'X' consists of only molecules. 'X' will have:",
                  options: [
                    'A crystalline hard structure',
                    'Low melting and low boiling point',
                    'An ionic bond',
                    'A strong force of attraction between its molecules'
                  ],
                  answer: 1,
                  reason: "Low melting and low boiling point — There are weak Vander Waals forces of attraction between Chemical Bonding     8 Chemistry molecules. Thus, less amount of energy is required to break these forces of attraction."
                },
                {
                  type: 'mcq',
                  question: '6. The molecule which contains a triple covalent bond is:',
                  options: [
                    'Ammonia',
                    'Methane',
                    'Water',
                    'Nitrogen'
                  ],
                  answer: 3,
                  reason: "Nitrogen — The valency of nitrogen element is 3. Nitrogen needs three electrons to attain stable octet structure of nearest noble gas - Ne [2,8]. Each of the two N atoms contributes three electron so as to have three shared pair of electrons between them. Both atoms attain stable – octet structure, resulting in the – formation of a – triple covalent bond [N≡N] between them."
                },
                {
                  type: 'mcq',
                  question: '7. The formation of a covalent bond between two atoms is favoured when:',
                  options: [
                    'both the atoms have a large difference in electronegativity',
                    'both the atoms have high electron affinity',
                    'both the atoms have high electronegativity',
                    'both Q and R'
                  ],
                  answer: 3,
                  reason: "Both Q and R — Covalent bond between two atoms is favoured when 1. The electronegativity difference between the combining atoms should either be zero or negligible. 2. Both the atoms should have high electron affinity. 3. Both the atoms should have high electronegativity. Hence both Q and R are correct."
                },
                {
                  type: 'mcq',
                  question: '8. Assertion (A): If the electron affinity value is high, anions are formed easily. Reason (R): Ionic bonding is favoured by high electron affinity.',
                  options: [
                    'Both A and R are true and R is the correct explanation of A.',
                    'Both A and R are true but R is not the correct explanation of A.',
                    'A is true but R is false.',
                    'A is false but R is true.'
                  ],
                  answer: 0,
                  reason: "Both A and R are true and R is the correct explanation of A. Explanation — The anion is formed easily if the electron affinity value is high. A high (more negative) electron affinity means an atom releases a significant amount of energy when it gains an electron indicating it strongly attracts electrons. This makes it easier for the atom to accept an electron and form a negative ion (anion). Hence the Assertion (A) is true. Electron affinity encourages electron acceptance, which is a step in ionic bond formation. Hence Reason (R) is also true and it correctly explains Assertion (A)."
                },
                {
                  type: 'mcq',
                  question: '9. Assertion (A): Atoms can combine either by the transfer of valence electrons from one atom to another or by sharing of valence electrons. Reason (R): Sharing and transfer of valence electrons is done by atoms to have an octet in their valence shell.',
                  options: [
                    'Both A and R are true and R is the correct explanation of A.',
                    'Both A and R are true but R is not the correct explanation of A.',
                    'A is true but R is false.',
                    'A is false but R is true.'
                  ],
                  answer: 0,
                  reason: "Both A and R are true and R is the correct explanation of A. Explanation — By sharing the valence electron pair, atoms can combine to form Covalent bond and by transfering electron(s), atoms establish a strong electrostatic attraction to form an Ionic bond. Atoms always try to attain their stable elctron configuration i.e., to have 8 electrons in their valence shell. So, both Assertion (A) and Reason (R) are true and Reason (R) correctly explains Assertion (A)."
                },
                {
                  type: 'mcq',
                  question: '10. Assertion (A): Ionic compounds conduct electricity in molten or aqueous state. Reason (R): Ionic compounds consist of molecules.',
                  options: [
                    'Both A and R are true and R is the correct explanation of A.',
                    'Both A and R are true but R is not the correct explanation of A.',
                    'A is true but R is false.',
                    'A is false but R is true.'
                  ],
                  answer: 2,
                  reason: "A is true but R is false. Explanation — Ionic compounds when in molten or aqueous state dissociate into free moving ions, which carry electric current. That is why substances like NaCl conduct electricity when dissolved in water or melted. Hence Assertion (A) is true. Reason (R) is false because ionic compounds consist of positive and negatively charged ions bound by strong electrostatic forces. I will give you all the other chapters of other subjects later but lets see how this works. Add previous and next buttons below each question and show right answers at last as mentioned in previous commands. Also make UI smooth"
                }
              ];
            }

            chapterPromises.push(
              Chapter.create({
                title: chapterTitle,
                number: i,
                description: `${subjectInfo.name} Chapter ${i} description`,
                content: chapterContent,
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                subject: subject._id,
              })
            );
          }

          await Promise.all(chapterPromises);
          console.log(
            `         Created ${subjectInfo.chapterCount} chapters for ${subjectInfo.name}`
          );
        }
      }
    }

    console.log("\n SEEDING COMPLETE — Your database is ready!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedAll();
