/**
 * Firebase seed script — populates Realtime Database with initial data.
 *
 * BEFORE RUNNING:
 * 1. npm install -D firebase-admin ts-node @types/node
 * 2. Go to Firebase Console → Project Settings → Service accounts
 *    → Generate new private key → save as scripts/serviceAccountKey.json
 * 3. Replace REPLACE_WITH_YOUR_UID below with your Firebase Auth UID
 *    (sign in via /login first, then find the UID in Firebase Console → Authentication → Users)
 * 4. Replace YOUR_DATABASE_URL with your Realtime Database URL
 *    (e.g. https://your-project-default-rtdb.firebaseio.com)
 * 5. npm run seed
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const admin = require('firebase-admin');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const serviceAccount = require('./serviceAccountKey.json');

const DATABASE_URL = 'https://dog-kennel-ca0e8-default-rtdb.europe-west1.firebasedatabase.app';
const ADMIN_UID = 'WrndDdumoKTU1SQov2sz54feWjz2';
const ADMIN_EMAIL = 'lazarevic.nebojsa1005@gmail.com';
const ADMIN_NAME = 'Admin';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: DATABASE_URL,
});

const db = admin.database();

async function seed() {
  console.log('Seeding Firebase Realtime Database...\n');

  // ── BREEDS ──────────────────────────────────────────────────────────────────
  const breeds: Record<string, object> = {
    'bernese-mountain-dog': {
      about:
        'The Bernese Mountain Dog is a large, sturdy working dog originating from the Swiss Alps. Known for their gentle temperament, striking tricolor coat, and loyalty, they make excellent family companions and working dogs.',
      standards: {
        appearance: 'Sturdy, well-balanced tricolor dog of large size',
        size: 'Males 64–70 cm, Females 58–66 cm',
        weight: 'Males 39–50 kg, Females 36–48 kg',
        coat: 'Long, slightly wavy or straight, silky',
        colors: 'Jet black with rich tan markings and white blaze, chest, paws and tail tip',
      },
    },
    maltese: {
      about:
        'The Maltese is one of the oldest toy breeds, with a history spanning over two millennia. This elegant small dog features a long, silky white coat, a gentle and playful personality, and an affectionate nature.',
      standards: {
        appearance: 'Fine-boned, elegant toy dog covered in long silky white hair',
        size: 'Under 25 cm at the withers',
        weight: '3–4 kg',
        coat: 'Long, silky, pure white, flowing to the ground',
        colors: 'Pure white; slight lemon or cream shading permissible',
      },
    },
    'bolonka-zwetna': {
      about:
        'The Bolonka Zwetna is a rare Russian colored toy breed with a curly or wavy coat. Highly adaptable and affectionate, they thrive in city apartments and are known for their playful, gentle character.',
      standards: {
        appearance: 'Small, compact dog with curly or wavy coat of various colors',
        size: '18–26 cm at the withers',
        weight: '1.5–4 kg',
        coat: 'Long, wavy or loosely curly, silky',
        colors: 'All colors except white; multicolored patterns common',
      },
    },
  };

  await db.ref('breeds').set(breeds);
  console.log('✓ Breeds seeded');

  // ── DOGS ────────────────────────────────────────────────────────────────────
  const dogs = [
    // Bernese males
    {
      breedId: 'bernese-mountain-dog',
      gender: 'male',
      name: 'Baron vom Schwarzwald',
      dateOfBirth: '2021-03-15',
      color: 'tricolor',
      titles: 'CH',
      photoBase64: '',
      status: 'available',
      createdAt: Date.now(),
    },
    {
      breedId: 'bernese-mountain-dog',
      gender: 'male',
      name: 'Duke von Alpenrose',
      dateOfBirth: '2020-07-22',
      color: 'tricolor',
      titles: '—',
      photoBase64: '',
      status: 'available',
      createdAt: Date.now(),
    },
    // Bernese females
    {
      breedId: 'bernese-mountain-dog',
      gender: 'female',
      name: 'Bella vom Schwarzwald',
      dateOfBirth: '2022-01-10',
      color: 'tricolor',
      titles: 'JCH',
      photoBase64: '',
      status: 'available',
      createdAt: Date.now(),
    },
    {
      breedId: 'bernese-mountain-dog',
      gender: 'female',
      name: 'Luna von Alpenrose',
      dateOfBirth: '2021-05-18',
      color: 'tricolor',
      titles: '—',
      photoBase64: '',
      status: 'available',
      createdAt: Date.now(),
    },
    // Maltese males
    {
      breedId: 'maltese',
      gender: 'male',
      name: 'Angelo Bianconeve',
      dateOfBirth: '2022-06-01',
      color: 'white',
      titles: 'CH',
      photoBase64: '',
      status: 'available',
      createdAt: Date.now(),
    },
    {
      breedId: 'maltese',
      gender: 'male',
      name: 'Romeo di Milano',
      dateOfBirth: '2021-11-30',
      color: 'white',
      titles: '—',
      photoBase64: '',
      status: 'available',
      createdAt: Date.now(),
    },
    // Maltese females
    {
      breedId: 'maltese',
      gender: 'female',
      name: 'Sofia Bianconeve',
      dateOfBirth: '2023-02-14',
      color: 'white',
      titles: '—',
      photoBase64: '',
      status: 'available',
      createdAt: Date.now(),
    },
    {
      breedId: 'maltese',
      gender: 'female',
      name: 'Stella di Milano',
      dateOfBirth: '2022-08-20',
      color: 'white',
      titles: 'CH',
      photoBase64: '',
      status: 'available',
      createdAt: Date.now(),
    },
    // Bolonka males
    {
      breedId: 'bolonka-zwetna',
      gender: 'male',
      name: 'Mishka Zvezdny',
      dateOfBirth: '2022-04-05',
      color: 'brown-white',
      titles: '—',
      photoBase64: '',
      status: 'available',
      createdAt: Date.now(),
    },
    {
      breedId: 'bolonka-zwetna',
      gender: 'male',
      name: 'Boris Tsvetnoj',
      dateOfBirth: '2021-09-12',
      color: 'black-white',
      titles: 'CH',
      photoBase64: '',
      status: 'available',
      createdAt: Date.now(),
    },
    // Bolonka females
    {
      breedId: 'bolonka-zwetna',
      gender: 'female',
      name: 'Masha Zvezdny',
      dateOfBirth: '2023-01-20',
      color: 'red-white',
      titles: '—',
      photoBase64: '',
      status: 'available',
      createdAt: Date.now(),
    },
    {
      breedId: 'bolonka-zwetna',
      gender: 'female',
      name: 'Zara Tsvetnoj',
      dateOfBirth: '2022-07-07',
      color: 'gray-white',
      titles: 'JCH',
      photoBase64: '',
      status: 'available',
      createdAt: Date.now(),
    },
  ];

  for (const dog of dogs) {
    await db.ref('dogs').push(dog);
  }
  console.log(`✓ ${dogs.length} dogs seeded`);

  // ── LITTERS + PUPPIES ────────────────────────────────────────────────────────
  const littersData = [
    {
      litter: {
        breedId: 'bernese-mountain-dog',
        name: 'A-litter Schwarzwald',
        dateOfBirth: '2024-11-01',
        motherName: 'Bella vom Schwarzwald',
        fatherName: 'Baron vom Schwarzwald',
        status: 'available',
        createdAt: Date.now(),
      },
      puppies: [
        { name: 'Alpha', gender: 'male', color: 'tricolor' },
        { name: 'Amber', gender: 'female', color: 'tricolor' },
        { name: 'Ace', gender: 'male', color: 'tricolor' },
      ],
    },
    {
      litter: {
        breedId: 'maltese',
        name: 'B-litter Bianconeve',
        dateOfBirth: '2024-12-15',
        motherName: 'Sofia Bianconeve',
        fatherName: 'Angelo Bianconeve',
        status: 'available',
        createdAt: Date.now(),
      },
      puppies: [
        { name: 'Bianco', gender: 'male', color: 'white' },
        { name: 'Bella', gender: 'female', color: 'white' },
        { name: 'Bruno', gender: 'male', color: 'white' },
      ],
    },
    {
      litter: {
        breedId: 'bolonka-zwetna',
        name: 'C-litter Zvezdny',
        dateOfBirth: '2025-01-10',
        motherName: 'Masha Zvezdny',
        fatherName: 'Mishka Zvezdny',
        status: 'available',
        createdAt: Date.now(),
      },
      puppies: [
        { name: 'Czar', gender: 'male', color: 'brown-white' },
        { name: 'Cleo', gender: 'female', color: 'black-white' },
        { name: 'Coco', gender: 'female', color: 'red-white' },
      ],
    },
  ];

  let puppyCount = 0;
  for (const { litter, puppies } of littersData) {
    const litterRef = await db.ref('litters').push(litter);
    const litterId: string = litterRef.key;

    for (const p of puppies) {
      await db.ref('puppies').push({
        ...p,
        litterId,
        breedId: litter.breedId,
        dateOfBirth: litter.dateOfBirth,
        photoBase64: '',
        status: 'available',
        createdAt: Date.now(),
      });
      puppyCount++;
    }
  }
  console.log(`✓ 3 litters + ${puppyCount} puppies seeded`);

  // ── ADMIN ────────────────────────────────────────────────────────────────────
  await db.ref(`admins/${ADMIN_UID}`).set({
    email: ADMIN_EMAIL,
    name: ADMIN_NAME,
    addedAt: Date.now(),
  });
  console.log(`✓ Admin seeded: ${ADMIN_EMAIL}`);

  console.log('\nSeeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
