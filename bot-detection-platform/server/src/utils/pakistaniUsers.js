// Pakistani first names and last names for seeding
export const pakistaniNames = {
  firstNames: [
    'Ahmed',
    'Ali',
    'Muhammad',
    'Hassan',
    'Omar',
    'Fatima',
    'Ayesha',
    'Zainab',
    'Amina',
    'Layla',
    'Noor',
    'Sara',
    'Hana',
    'Mariam',
    'Leena',
    'Dina',
    'Samir',
    'Karim',
    'Bilal',
    'Rashid',
    'Walid',
    'Jamal',
    'Malik',
    'Tariq',
    'Salim',
    'Hamza',
    'Adnan',
    'Kamal',
    'Iqbal',
    'Nasir',
    'Wahab',
    'Hafiz',
    'Imran',
    'Rizwan',
    'Naveed',
    'Usman',
    'Yasir',
    'Zafar',
    'Amin',
    'Feroz',
    'Gul',
    'Hassan',
    'Iqra',
    'Jamila',
    'Khadija',
    'Laila',
    'Mehwish',
    'Nadia',
  ],
  lastNames: [
    'Khan',
    'Ahmed',
    'Ali',
    'Hassan',
    'Ibrahim',
    'Abdullah',
    'Mohammad',
    'Hussain',
    'Malik',
    'Mirza',
    'Siddiqui',
    'Baig',
    'Raja',
    'Rana',
    'Sheikh',
    'Shaikh',
    'Qureshi',
    'Akhtar',
    'Raza',
    'Nasir',
    'Ansari',
    'Farooq',
    'Haque',
    'Karim',
    'Amin',
    'Aziz',
    'Beg',
    'Chaudhry',
    'Dar',
    'Deen',
    'Faridi',
    'Ghani',
  ],
};

export const generatePakistaniUsers = (count) => {
  const users = [];
  const { firstNames, lastNames } = pakistaniNames;

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const username = `${firstName.toLowerCase()}_${i + 1}`;

    users.push({
      name: `${firstName} ${lastName}`,
      email: `${username}@botguard.pk`,
      password: 'Password123', // Default password for seed
      role: 'user',
    });
  }

  return users;
};
