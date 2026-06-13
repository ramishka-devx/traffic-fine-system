const stations = [
  { station_code: 'CMB-01', name: 'Colombo Police Station', district_code: 'CMB' },
  { station_code: 'GMP-01', name: 'Gampaha Police Station', district_code: 'GMP' },
  { station_code: 'KT-01', name: 'Kalutara Police Station', district_code: 'KT' },

  { station_code: 'KD-01', name: 'Kandy Police Station', district_code: 'KD' },
  { station_code: 'MT-01', name: 'Matale Police Station', district_code: 'MT' },
  { station_code: 'NW-01', name: 'Nuwara Eliya Police Station', district_code: 'NW' },

  { station_code: 'GL-01', name: 'Galle Police Station', district_code: 'GL' },
  { station_code: 'MTR-01', name: 'Matara Police Station', district_code: 'MTR' },
  { station_code: 'HB-01', name: 'Hambantota Police Station', district_code: 'HB' },

  { station_code: 'JF-01', name: 'Jaffna Police Station', district_code: 'JF' },
  { station_code: 'KLN-01', name: 'Kilinochchi Police Station', district_code: 'KLN' },
  { station_code: 'MNR-01', name: 'Mannar Police Station', district_code: 'MNR' },
  { station_code: 'VA-01', name: 'Vavuniya Police Station', district_code: 'VA' },
  { station_code: 'MUL-01', name: 'Mullaitivu Police Station', district_code: 'MUL' },

  { station_code: 'BTC-01', name: 'Batticaloa Police Station', district_code: 'BTC' },
  { station_code: 'AMP-01', name: 'Ampara Police Station', district_code: 'AMP' },
  { station_code: 'TRI-01', name: 'Trincomalee Police Station', district_code: 'TRI' },

  { station_code: 'KUR-01', name: 'Kurunegala Police Station', district_code: 'KUR' },
  { station_code: 'PTM-01', name: 'Puttalam Police Station', district_code: 'PTM' },

  { station_code: 'ANR-01', name: 'Anuradhapura Police Station', district_code: 'ANR' },
  { station_code: 'PLR-01', name: 'Polonnaruwa Police Station', district_code: 'PLR' },

  { station_code: 'BD-01', name: 'Badulla Police Station', district_code: 'BD' },
  { station_code: 'MON-01', name: 'Moneragala Police Station', district_code: 'MON' },

  { station_code: 'RTN-01', name: 'Ratnapura Police Station', district_code: 'RTN' },
  { station_code: 'KGL-01', name: 'Kegalle Police Station', district_code: 'KGL' }
];

async function seedStations(client) {
  console.log('Inserting Stations...');
  for (const st of stations) {
    // Look up the district ID from the district_code
    const distResult = await client.query('SELECT id FROM districts WHERE code = $1', [st.district_code]);
    if (distResult.rows.length === 0) continue;
    
    const districtId = distResult.rows[0].id;
    
    await client.query(
      `INSERT INTO stations (station_code, name, district_id) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (station_code) DO NOTHING`,
      [st.station_code, st.name, districtId]
    );
  }
}

module.exports = { seedStations, stations };
