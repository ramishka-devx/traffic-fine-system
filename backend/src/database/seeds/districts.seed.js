const districts = [
  { code: 'CMB', name: 'Colombo' }, { code: 'GMP', name: 'Gampaha' },
  { code: 'KT', name: 'Kalutara' }, { code: 'KD', name: 'Kandy' },
  { code: 'MT', name: 'Matale' }, { code: 'NW', name: 'Nuwara Eliya' },
  { code: 'GL', name: 'Galle' }, { code: 'MTR', name: 'Matara' },
  { code: 'HB', name: 'Hambantota' }, { code: 'JF', name: 'Jaffna' },
  { code: 'KLN', name: 'Kilinochchi' }, { code: 'MNR', name: 'Mannar' },
  { code: 'VA', name: 'Vavuniya' }, { code: 'MUL', name: 'Mullaitivu' },
  { code: 'BTC', name: 'Batticaloa' }, { code: 'AMP', name: 'Ampara' },
  { code: 'TRI', name: 'Trincomalee' }, { code: 'KUR', name: 'Kurunegala' },
  { code: 'PTM', name: 'Puttalam' }, { code: 'ANR', name: 'Anuradhapura' },
  { code: 'PLR', name: 'Polonnaruwa' }, { code: 'BD', name: 'Badulla' },
  { code: 'MON', name: 'Moneragala' }, { code: 'RTN', name: 'Ratnapura' },
  { code: 'KGL', name: 'Kegalle' }
];

async function seedDistricts(client) {
  console.log('Inserting Districts...');
  for (const dist of districts) {
    await client.query(
      `INSERT INTO districts (code, name) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING`,
      [dist.code, dist.name]
    );
  }
}

module.exports = { seedDistricts, districts };
