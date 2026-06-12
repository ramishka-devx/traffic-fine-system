const categories = [
  {
    code: 'SPD-01',
    name: 'Exceeding Speed Limit',
    description: 'Driving above the posted speed limit',
    amount: 3000.00
  },
  {
    code: 'HLM-01',
    name: 'Riding without a Helmet',
    description: 'Rider or pillion rider without a protective helmet',
    amount: 1500.00
  },
  {
    code: 'SIG-01',
    name: 'Disobeying Traffic Signals',
    description: 'Running a red light or ignoring traffic signs',
    amount: 2000.00
  },
  {
    code: 'LIC-01',
    name: 'Driving without a Valid License',
    description: 'Operating a vehicle without a valid driving license',
    amount: 25000.00
  },
  {
    code: 'INS-01',
    name: 'Driving without Insurance',
    description: 'Operating a vehicle without valid third-party insurance',
    amount: 25000.00
  },
  {
    code: 'MBL-01',
    name: 'Using Mobile Phone While Driving',
    description: 'Using a handheld mobile phone while operating a vehicle',
    amount: 3000.00
  },
  {
    code: 'PKG-01',
    name: 'Illegal Parking',
    description: 'Parking in a prohibited or restricted area',
    amount: 2000.00
  },
  {
    code: 'SEA-01',
    name: 'Failure to Wear Seat Belt',
    description: 'Driver or passenger not wearing a seat belt',
    amount: 1000.00
  },
  {
    code: 'OVT-01',
    name: 'Improper Overtaking',
    description: 'Overtaking in a prohibited or dangerous manner',
    amount: 3000.00
  },
  {
    code: 'LAN-01',
    name: 'Failure to Keep Lane',
    description: 'Unsafe lane changing or lane discipline violation',
    amount: 2000.00
  },
  {
    code: 'DOC-01',
    name: 'Failure to Carry Vehicle Documents',
    description: 'Not carrying required vehicle registration or revenue license',
    amount: 1000.00
  },
  {
    code: 'DRK-01',
    name: 'Driving Under the Influence',
    description: 'Operating a vehicle while intoxicated by alcohol',
    amount: 25000.00
  },
  {
    code: 'REC-01',
    name: 'Reckless or Dangerous Driving',
    description: 'Driving in a manner that endangers other road users',
    amount: 10000.00
  },
  {
    code: 'PED-01',
    name: 'Failure to Yield to Pedestrians',
    description: 'Not giving way to pedestrians at crossings',
    amount: 2000.00
  },
  {
    code: 'VEH-01',
    name: 'Defective Vehicle Condition',
    description: 'Operating a vehicle with unsafe or defective equipment',
    amount: 3000.00
  }
];

async function seedCategories(client) {
  console.log('Inserting Fine Categories...');
  for (const cat of categories) {
    await client.query(
      `INSERT INTO fine_categories (code, name, description, base_amount) 
       VALUES ($1, $2, $3, $4) ON CONFLICT (code) DO NOTHING`,
      [cat.code, cat.name, cat.description, cat.amount]
    );
  }
}

module.exports = { seedCategories, categories };
