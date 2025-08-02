// Script to add comprehensive fields including full currency list
import { config } from 'dotenv';

config();

const AIRTABLE_API_KEY = process.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.VITE_AIRTABLE_BASE_ID || 'app0tFfsjLbI1qXq0';
const AIRTABLE_TABLE_NAME = 'Directory Submissions';
const AIRTABLE_META_URL = `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`;

async function getTableSchema() {
  const response = await fetch(AIRTABLE_META_URL, {
    headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
  });
  const data = await response.json();
  return data.tables.find(table => table.name === AIRTABLE_TABLE_NAME);
}

async function createFields(fields, tableId) {
  const response = await fetch(`${AIRTABLE_META_URL}/${tableId}/fields`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields: fields })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Field creation error: ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}

async function addComprehensiveFields() {
  try {
    console.log('🚀 Creating comprehensive field set...');
    
    const schema = await getTableSchema();
    const existingFields = schema.fields.map(f => f.name);
    
    // Comprehensive currency list with symbols
    const currencyChoices = [
      { name: 'AED – د.إ' }, { name: 'AFN – ؋' }, { name: 'ALL – Lek' }, { name: 'AMD – ֏' },
      { name: 'AOA – Kz' }, { name: 'ARS – AR$' }, { name: 'AUD – AU$' }, { name: 'AWG – AWƒ' },
      { name: 'AZN – ₼' }, { name: 'BAM – KM' }, { name: 'BBD – BB$' }, { name: 'BDT – ৳' },
      { name: 'BGN – лв' }, { name: 'BHD – ب.د' }, { name: 'BIF – FBu' }, { name: 'BMD – BM$' },
      { name: 'BND – BN$' }, { name: 'BOB – Bs' }, { name: 'BRL – R$' }, { name: 'BSD – BS$' },
      { name: 'BTN – Nu' }, { name: 'BYN – Br' }, { name: 'CAD – CA$' }, { name: 'CDF – FCF' },
      { name: 'CHF – CHFr' }, { name: 'CLP – CL$' }, { name: 'CNY – CN¥' }, { name: 'COP – CO$' },
      { name: 'CRC – ₡' }, { name: 'CUP – CU$' }, { name: 'CZK – Kč' }, { name: 'DJF – Fdj' },
      { name: 'DKK – kr' }, { name: 'DOP – RD$' }, { name: 'DZD – د.ج' }, { name: 'EGP – LE' },
      { name: 'ERN – Nkf' }, { name: 'ETB – Br' }, { name: 'EUR – €' }, { name: 'FJD – FJ$' },
      { name: 'GBP – £' }, { name: 'GEL – ₾' }, { name: 'GHS – ₵' }, { name: 'GIP – GI£' },
      { name: 'GMD – D' }, { name: 'GNF – FG' }, { name: 'GTQ – Q' }, { name: 'HKD – HK$' },
      { name: 'HNL – L' }, { name: 'HRK – kn' }, { name: 'HUF – Ft' }, { name: 'IDR – Rp' },
      { name: 'ILS – ₪' }, { name: 'INR – ₹' }, { name: 'IQD – ع.د' }, { name: 'IRR – ﷼' },
      { name: 'ISK – kr' }, { name: 'JMD – JM$' }, { name: 'JOD – د.ا' }, { name: 'JPY – JP¥' },
      { name: 'KES – KSh' }, { name: 'KGS – с' }, { name: 'KHR – ៛' }, { name: 'KMF – FC' },
      { name: 'KRW – ₩' }, { name: 'KWD – ك' }, { name: 'KYD – KY$' }, { name: 'KZT – ₸' },
      { name: 'LAK – ₭' }, { name: 'LBP – ل.ل' }, { name: 'LKR – රු' }, { name: 'LSL – L' },
      { name: 'MAD – د.م' }, { name: 'MDL – L' }, { name: 'MGA – Ar' }, { name: 'MKD – ден' },
      { name: 'MMK – K' }, { name: 'MNT – ₮' }, { name: 'MOP – MOP$' }, { name: 'MRU – UM' },
      { name: 'MUR – MURs' }, { name: 'MVR – Rf' }, { name: 'MWK – MK' }, { name: 'MXN – MX$' },
      { name: 'MYR – RM' }, { name: 'MZN – MT' }, { name: 'NAD – NA$' }, { name: 'NGN – ₦' },
      { name: 'NIO – NI$' }, { name: 'NOK – kr' }, { name: 'NPR – ₨' }, { name: 'NZD – NZ$' },
      { name: 'OMR – ر.ع' }, { name: 'PAB – B/.' }, { name: 'PEN – S/.' }, { name: 'PGK – K' },
      { name: 'PHP – ₱' }, { name: 'PKR – ₨' }, { name: 'PLN – zł' }, { name: 'PYG – ₲' },
      { name: 'QAR – ر.ق' }, { name: 'RON – lei' }, { name: 'RSD – RSD' }, { name: 'RUB – ₽' },
      { name: 'RWF – FRw' }, { name: 'SAR – ﷼' }, { name: 'SCR – SCRs' }, { name: 'SDG – ج.س' },
      { name: 'SEK – kr' }, { name: 'SGD – SG$' }, { name: 'SHP – SH£' }, { name: 'SLE – Le' },
      { name: 'SRD – SR$' }, { name: 'STN – Db' }, { name: 'SVC – ₡' }, { name: 'SYP – SY£' },
      { name: 'THB – ฿' }, { name: 'TJS – ЅМ' }, { name: 'TMT – T' }, { name: 'TND – د.ت' },
      { name: 'TOP – T$' }, { name: 'TRY – ₺' }, { name: 'TTD – TT$' }, { name: 'TWD – NT$' },
      { name: 'TZS – TSh' }, { name: 'UAH – ₴' }, { name: 'UGX – USh' }, { name: 'USD – US$' },
      { name: 'UYU – UY$' }, { name: 'UZS – soʻm' }, { name: 'VES – Bs.S' }, { name: 'VND – ₫' },
      { name: 'XAF – FCFA' }, { name: 'XCD – EC$' }, { name: 'XOF – CFA' }, { name: 'XPF – CFP₣' },
      { name: 'YER – ﷼' }, { name: 'ZAR – R' }, { name: 'ZMW – ZK' }
    ];

    const desiredFields = [
      {
        name: 'PMS Used',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'Hostfully' }, { name: 'Guesty' }, { name: 'Lodgify' }, { name: 'BookingSync' },
            { name: 'OwnerRez' }, { name: 'Streamline' }, { name: 'Hostaway' }, { name: 'YourPorter' },
            { name: 'Avantio' }, { name: 'RentalNinja' }, { name: 'Kigo' }, { name: 'RemoteLock' },
            { name: 'Tokeet' }, { name: 'Bookerville' }, { name: 'LiveRez' }, { name: 'iGMS' },
            { name: 'Mynd' }, { name: 'RedAwning' }, { name: 'Rental United' }, { name: 'CiiRUS' },
            { name: 'Track' }, { name: 'RMS Cloud' }, { name: 'Cloudbeds' }, { name: 'BookingBoss' },
            { name: 'VRScheduler' }, { name: 'Smartbnb' }, { name: 'PriceLabs' }, { name: 'Beyond Pricing' },
            { name: 'Wheelhouse' }, { name: 'AirDNA' }, { name: 'Key Data Dashboard' }, { name: 'Transparent' },
            { name: 'Rented' }, { name: 'Property Meld' }, { name: 'Breezeway' }, { name: 'TurnoverBnB' },
            { name: 'Properly' }, { name: 'TIDY' }, { name: 'Jetstream' }, { name: 'FantasticStay' },
            { name: 'Red' }, { name: 'Guest' }, { name: 'TouchStay' }, { name: 'Hostco' },
            { name: 'DPGO' }, { name: 'StayFi' }, { name: 'GuestTek' }, { name: 'NoiseAware' },
            { name: 'Minut' }, { name: 'Party Squasher' }, { name: 'Alertify' }, { name: 'August' },
            { name: 'Schlage' }, { name: 'Yale' }, { name: 'Lynx' }, { name: 'PointCentral' },
            { name: 'SALTO' }, { name: 'Nest' }, { name: 'Ecobee' }, { name: 'Honeywell' },
            { name: 'Ring' }, { name: 'SimpliSafe' }, { name: 'ADT' }, { name: 'Kangaroo' },
            { name: 'Airbnb' }, { name: 'VRBO' }, { name: 'Booking.com' }, { name: 'Expedia' },
            { name: 'HomeAway' }, { name: 'TripAdvisor' }, { name: 'FlipKey' }, { name: 'RedWeek' },
            { name: 'Other' }, { name: 'Custom Solution' }, { name: 'No PMS' }
          ]
        }
      },
      {
        name: 'Min Price (ADR)',
        type: 'number',
        options: { precision: 2 }
      },
      {
        name: 'Max Price (ADR)', 
        type: 'number',
        options: { precision: 2 }
      },
      {
        name: 'Currency',
        type: 'singleSelect',
        options: { choices: currencyChoices }
      },
      {
        name: 'Google Reviews Link',
        type: 'url'
      },
      {
        name: 'Cancellation Policy',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'Flexible - Free cancellation up to 24 hours before check-in' },
            { name: 'Moderate - Free cancellation up to 5 days before check-in' },
            { name: 'Strict - Free cancellation up to 14 days before check-in' },
            { name: 'Super Strict - 50% refund up to 30 days before check-in' },
            { name: 'Non-refundable - No refunds allowed' }
          ]
        }
      }
    ];

    console.log('📋 Comprehensive currency options:', currencyChoices.length, 'currencies');

    // Since API creation has been failing, let's generate the manual instructions
    console.log('\n🔧 MANUAL AIRTABLE FIELD CREATION INSTRUCTIONS:');
    console.log('='.repeat(60));
    
    desiredFields.forEach((field, index) => {
      console.log(`\n${index + 1}. Field Name: "${field.name}"`);
      console.log(`   Type: ${field.type}`);
      
      if (field.options && field.options.choices) {
        console.log(`   Options (${field.options.choices.length} total):`);
        if (field.name === 'Currency') {
          console.log('   [Copy these currency options to your Airtable field:]');
          field.options.choices.forEach(choice => console.log(`   - ${choice.name}`));
        } else {
          console.log('   Options:', field.options.choices.map(c => c.name).join(', '));
        }
      }
      
      if (field.options && field.options.precision) {
        console.log(`   Format: Allow ${field.options.precision} decimal places`);
      }
    });

    console.log('\n✅ Instructions generated!');
    console.log('📝 Please create these fields manually in your Airtable base.');
    console.log('🎯 The comprehensive currency list has been provided above.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addComprehensiveFields();