import React, { useState } from 'react';

const FD_RATES = [
  { bank: 'State Bank of India', short: 'SBI', type: 'Public', rates: { '6M': 5.75, '1Y': 6.80, '2Y': 7.00, '3Y': 6.75 }, safe: 'Very High', color: '#2563eb' },
  { bank: 'HDFC Bank', short: 'HDFC', type: 'Private', rates: { '6M': 6.00, '1Y': 6.60, '2Y': 7.00, '3Y': 7.00 }, safe: 'Very High', color: '#7c3aed' },
  { bank: 'ICICI Bank', short: 'ICICI', type: 'Private', rates: { '6M': 6.00, '1Y': 6.70, '2Y': 7.00, '3Y': 7.00 }, safe: 'Very High', color: '#0891b2' },
  { bank: 'Axis Bank', short: 'Axis', type: 'Private', rates: { '6M': 6.00, '1Y': 6.70, '2Y': 7.10, '3Y': 7.10 }, safe: 'Very High', color: '#dc2626' },
  { bank: 'Kotak Mahindra Bank', short: 'Kotak', type: 'Private', rates: { '6M': 6.00, '1Y': 7.10, '2Y': 7.10, '3Y': 7.00 }, safe: 'Very High', color: '#d97706' },
  { bank: 'Suryoday Small Finance', short: 'Suryoday', type: 'Small Finance', rates: { '6M': 6.75, '1Y': 8.25, '2Y': 8.50, '3Y': 8.60 }, safe: 'High', color: '#f59e0b' },
  { bank: 'AU Small Finance', short: 'AU SFB', type: 'Small Finance', rates: { '6M': 6.75, '1Y': 7.25, '2Y': 7.50, '3Y': 7.50 }, safe: 'High', color: '#10b981' },
  { bank: 'Jana Small Finance', short: 'Jana', type: 'Small Finance', rates: { '6M': 6.50, '1Y': 8.00, '2Y': 8.25, '3Y': 8.25 }, safe: 'High', color: '#06b6d4' },
  { bank: 'Post Office (POSS)', short: 'Post Office', type: 'Government', rates: { '6M': 6.60, '1Y': 6.90, '2Y': 7.00, '3Y': 7.10 }, safe: 'Highest', color: '#16a34a' },
  { bank: 'RBL Bank', short: 'RBL', type: 'Private', rates: { '6M': 6.00, '1Y': 7.50, '2Y': 7.80, '3Y': 7.80 }, safe: 'High', color: '#9333ea' },
];

const TENORS = ['6M', '1Y', '2Y', '3Y'];

const SAFE_COLORS = {
  'Highest': '#16a34a',
  'Very High': '#0891b2',
  'High': '#f59e0b',
};

const tenorMonths = { '6M': 6, '1Y': 12, '2Y': 24, '3Y': 36 };

// All UI text translations
const TEXT = {
  Hindi: {
    title: '📊 FD दरें',
    subtitle: 'किसी भी दर पर टैप करें और FD Mitra से पूछें',
    all: 'सभी', public: 'सरकारी', private: 'निजी', smallFinance: 'स्मॉल फाइनेंस', government: 'सरकार',
    ask: 'पूछें →',
    calcTitle: '🧮 FD कैलकुलेटर',
    calcSubtitle: 'देखें आपको कितना मिलेगा',
    investAmount: 'निवेश राशि',
    customPlaceholder: 'कस्टम राशि दर्ज करें',
    selectBank: 'बैंक चुनें',
    duration: 'अवधि',
    maturityLabel: 'परिपक्वता राशि',
    interestLabel: 'ब्याज',
    afterLabel: 'के बाद',
    atLabel: 'पर',
    savingsCompare: 'बचत खाते से तुलना (3.5% प्रति वर्ष)',
    savingsEarn: 'बचत खाते में केवल मिलता',
    extraWithFD: 'FD में अधिक',
    askBtn: 'FD Mitra से पूछें →',
    disclaimer: '* दरें सांकेतिक हैं। निवेश से पहले बैंक से जांचें। DICGC ₹5 लाख तक बीमा करता है।',
    tenorLabels: { '6M': '6 महीने', '1Y': '1 साल', '2Y': '2 साल', '3Y': '3 साल' },
    safeLabels: { 'Highest': 'सर्वोच्च', 'Very High': 'बहुत उच्च', 'High': 'उच्च' },
    typeLabels: { 'Public': 'सरकारी', 'Private': 'निजी', 'Small Finance': 'स्मॉल फाइनेंस', 'Government': 'सरकार' },
  },
  English: {
    title: '📊 Live FD Rates',
    subtitle: 'Tap any rate to ask FD Mitra about it instantly',
    all: 'All', public: 'Public', private: 'Private', smallFinance: 'Small Finance', government: 'Government',
    ask: 'Ask →',
    calcTitle: '🧮 FD Calculator',
    calcSubtitle: 'See exactly how much you will earn',
    investAmount: 'Investment Amount',
    customPlaceholder: 'Enter custom amount',
    selectBank: 'Select Bank',
    duration: 'Duration',
    maturityLabel: 'MATURITY AMOUNT',
    interestLabel: 'INTEREST EARNED',
    afterLabel: 'after',
    atLabel: 'at',
    savingsCompare: 'vs Savings Account (3.5% p.a.)',
    savingsEarn: 'You would only earn',
    extraWithFD: 'extra with FD',
    askBtn: 'Ask FD Mitra about this →',
    disclaimer: '* Rates are indicative. Verify with bank before investing. DICGC insures up to ₹5 lakh.',
    tenorLabels: { '6M': '6 Months', '1Y': '1 Year', '2Y': '2 Years', '3Y': '3 Years' },
    safeLabels: { 'Highest': 'Highest', 'Very High': 'Very High', 'High': 'High' },
    typeLabels: { 'Public': 'Public', 'Private': 'Private', 'Small Finance': 'Small Finance', 'Government': 'Government' },
  },
  Bhojpuri: {
    title: '📊 FD दरें',
    subtitle: 'कौनो भी दर पर टैप करीं आउर FD Mitra से पूछीं',
    all: 'सब', public: 'सरकारी', private: 'निजी', smallFinance: 'स्मॉल फाइनेंस', government: 'सरकार',
    ask: 'पूछीं →',
    calcTitle: '🧮 FD कैलकुलेटर',
    calcSubtitle: 'देखीं कतना मिली',
    investAmount: 'निवेश राशि',
    customPlaceholder: 'राशि दर्ज करीं',
    selectBank: 'बैंक चुनीं',
    duration: 'अवधि',
    maturityLabel: 'परिपक्वता राशि',
    interestLabel: 'ब्याज',
    afterLabel: 'के बाद',
    atLabel: 'पर',
    savingsCompare: 'बचत खाता से तुलना (3.5% प्रति साल)',
    savingsEarn: 'बचत खाता में केवल मिलत',
    extraWithFD: 'FD में बेसी',
    askBtn: 'FD Mitra से पूछीं →',
    disclaimer: '* दरें सांकेतिक बाड़ी। निवेश से पहले बैंक से जांचीं। DICGC ₹5 लाख तक बीमा करेला।',
    tenorLabels: { '6M': '6 महीना', '1Y': '1 साल', '2Y': '2 साल', '3Y': '3 साल' },
    safeLabels: { 'Highest': 'सर्वोच्च', 'Very High': 'बहुत उच्च', 'High': 'उच्च' },
    typeLabels: { 'Public': 'सरकारी', 'Private': 'निजी', 'Small Finance': 'स्मॉल फाइनेंस', 'Government': 'सरकार' },
  },
  Marathi: {
    title: '📊 FD दर',
    subtitle: 'कोणत्याही दरावर टॅप करा आणि FD Mitra ला विचारा',
    all: 'सर्व', public: 'सार्वजनिक', private: 'खाजगी', smallFinance: 'स्मॉल फायनान्स', government: 'सरकार',
    ask: 'विचारा →',
    calcTitle: '🧮 FD कॅल्क्युलेटर',
    calcSubtitle: 'तुम्हाला किती मिळेल ते पहा',
    investAmount: 'गुंतवणूक रक्कम',
    customPlaceholder: 'सानुकूल रक्कम टाका',
    selectBank: 'बँक निवडा',
    duration: 'कालावधी',
    maturityLabel: 'परिपक्वता रक्कम',
    interestLabel: 'व्याज',
    afterLabel: 'नंतर',
    atLabel: 'वर',
    savingsCompare: 'बचत खात्याशी तुलना (3.5% प्रतिवर्ष)',
    savingsEarn: 'बचत खात्यात फक्त मिळेल',
    extraWithFD: 'FD मध्ये जास्त',
    askBtn: 'FD Mitra ला विचारा →',
    disclaimer: '* दर सूचक आहेत. गुंतवणूक करण्यापूर्वी बँकेकडे तपासा. DICGC ₹5 लाखांपर्यंत विमा देते.',
    tenorLabels: { '6M': '6 महिने', '1Y': '1 वर्ष', '2Y': '2 वर्षे', '3Y': '3 वर्षे' },
    safeLabels: { 'Highest': 'सर्वोच्च', 'Very High': 'अतिशय उच्च', 'High': 'उच्च' },
    typeLabels: { 'Public': 'सार्वजनिक', 'Private': 'खाजगी', 'Small Finance': 'स्मॉल फायनान्स', 'Government': 'सरकार' },
  },
  Gujarati: {
    title: '📊 FD દરો',
    subtitle: 'કોઈ પણ દર પર ટૅપ કરો અને FD Mitra ને પૂછો',
    all: 'બધા', public: 'સાર્વજનિક', private: 'ખાનગી', smallFinance: 'સ્મોલ ફાઇનાન્સ', government: 'સરકાર',
    ask: 'પૂછો →',
    calcTitle: '🧮 FD કૅલ્ક્યુલેટર',
    calcSubtitle: 'જુઓ તમને કેટલું મળશે',
    investAmount: 'રોકાણ રકમ',
    customPlaceholder: 'કસ્ટમ રકમ દાખલ કરો',
    selectBank: 'બેંક પસંદ કરો',
    duration: 'સમયગાળો',
    maturityLabel: 'મેચ્યોરિટી રકમ',
    interestLabel: 'વ્યાજ',
    afterLabel: 'પછી',
    atLabel: 'પર',
    savingsCompare: 'બચત ખાતા સાથે સરખામણી (3.5% વાર્ષિક)',
    savingsEarn: 'બચત ખાતામાં માત્ર મળશે',
    extraWithFD: 'FD માં વધુ',
    askBtn: 'FD Mitra ને પૂછો →',
    disclaimer: '* દરો સૂચક છે. રોકાણ કરતા પહેલા બેંક પાસે ચકાસો. DICGC ₹5 લાખ સુધી વીમો આપે છે.',
    tenorLabels: { '6M': '6 મહિના', '1Y': '1 વર્ષ', '2Y': '2 વર્ષ', '3Y': '3 વર્ષ' },
    safeLabels: { 'Highest': 'સર્વોચ્ચ', 'Very High': 'ખૂબ ઊંચું', 'High': 'ઊંચું' },
    typeLabels: { 'Public': 'સાર્વજનિક', 'Private': 'ખાનગી', 'Small Finance': 'સ્મોલ ફાઇનાન્સ', 'Government': 'સરકાર' },
  },
};

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function calcMaturity(principal, rate, months) {
  const years = months / 12;
  return Math.round(principal * Math.pow(1 + rate / 100, years));
}

const ASK_QUESTIONS = {
  Hindi: (bank, tenor, principal) => `${bank.bank} ${bank.rates[tenor]}% p.a. ${tenor} FD safe hai kya? Agar main ₹${principal.toLocaleString('en-IN')} lagaun toh kitna milega?`,
  English: (bank, tenor, principal) => `Is ${bank.bank} ${bank.rates[tenor]}% p.a. ${tenor} FD safe? If I invest ₹${principal.toLocaleString('en-IN')}, how much will I get?`,
  Bhojpuri: (bank, tenor, principal) => `${bank.bank} ${bank.rates[tenor]}% p.a. ${tenor} FD safe baa ka? ₹${principal.toLocaleString('en-IN')} lagaile toh kitna milega?`,
  Marathi: (bank, tenor, principal) => `${bank.bank} ${bank.rates[tenor]}% p.a. ${tenor} FD सुरक्षित आहे का? ₹${principal.toLocaleString('en-IN')} गुंतवल्यास किती मिळेल?`,
  Gujarati: (bank, tenor, principal) => `${bank.bank} ${bank.rates[tenor]}% p.a. ${tenor} FD સુરક્ષિત છે? ₹${principal.toLocaleString('en-IN')} રોકાણ કરવા પર કેટલું મળશે?`,
};

export default function RatesTab({ onAskQuestion, language }) {
  const [selectedTenor, setSelectedTenor] = useState('1Y');
  const [principal, setPrincipal] = useState(100000);
  const [calcBank, setCalcBank] = useState(FD_RATES[0]);
  const [calcTenor, setCalcTenor] = useState('1Y');
  const [filterType, setFilterType] = useState('All');

  const t = TEXT[language] || TEXT['English'];
  const types = ['All', 'Public', 'Private', 'Small Finance', 'Government'];
  const typeDisplay = { 'All': t.all, 'Public': t.public, 'Private': t.private, 'Small Finance': t.smallFinance, 'Government': t.government };

  const filtered = filterType === 'All' ? FD_RATES : FD_RATES.filter(b => b.type === filterType);
  const sorted = [...filtered].sort((a, b) => b.rates[selectedTenor] - a.rates[selectedTenor]);

  const maturity = calcMaturity(principal, calcBank.rates[calcTenor], tenorMonths[calcTenor]);
  const interest = maturity - principal;
  const savingsMaturity = calcMaturity(principal, 3.5, tenorMonths[calcTenor]);
  const savingsInterest = savingsMaturity - principal;
  const extra = interest - savingsInterest;

  const handleAsk = (bank, tenor) => {
    const fn = ASK_QUESTIONS[language] || ASK_QUESTIONS['English'];
    onAskQuestion(fn(bank, tenor, principal));
  };

  return (
    <div style={{
      flex: 1, overflowY: 'auto', padding: '20px 16px',
      fontFamily: "'DM Sans', sans-serif",
      background: 'linear-gradient(135deg, #020917 0%, #071428 100%)',
    }}>

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
          {t.title}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>
          {t.subtitle}
        </div>
      </div>

      {/* Tenor selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {TENORS.map(tenor => (
          <button key={tenor} onClick={() => setSelectedTenor(tenor)} style={{
            padding: '6px 16px', borderRadius: '20px', border: 'none',
            background: selectedTenor === tenor ? 'linear-gradient(135deg, #0055cc, #00aaff)' : 'rgba(255,255,255,0.06)',
            color: selectedTenor === tenor ? '#fff' : 'rgba(255,255,255,0.5)',
            fontSize: '13px', cursor: 'pointer', fontWeight: selectedTenor === tenor ? '600' : '400',
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: selectedTenor === tenor ? '0 4px 12px rgba(0,100,255,0.3)' : 'none',
            transition: 'all 0.2s'
          }}>{t.tenorLabels[tenor]}</button>
        ))}
      </div>

      {/* Type filter */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {types.map(type => (
          <button key={type} onClick={() => setFilterType(type)} style={{
            padding: '4px 12px', borderRadius: '20px',
            border: filterType === type ? '1px solid rgba(0,180,255,0.5)' : '1px solid rgba(255,255,255,0.08)',
            background: filterType === type ? 'rgba(0,180,255,0.1)' : 'transparent',
            color: filterType === type ? '#00b4ff' : 'rgba(255,255,255,0.35)',
            fontSize: '11px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.2s'
          }}>{typeDisplay[type]}</button>
        ))}
      </div>

      {/* Rate cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
        {sorted.map((bank, idx) => (
          <div key={bank.short} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px', padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '12px', transition: 'all 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                background: idx === 0 ? 'linear-gradient(135deg, #f59e0b, #fcd34d)' : idx === 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: '700',
                color: idx === 0 ? '#92400e' : 'rgba(255,255,255,0.4)'
              }}>{idx + 1}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {bank.short}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                  <span style={{ fontSize: '10px', padding: '1px 7px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}>
                    {t.typeLabels[bank.type] || bank.type}
                  </span>
                  <span style={{ fontSize: '10px', padding: '1px 7px', borderRadius: '10px', background: `${SAFE_COLORS[bank.safe]}22`, color: SAFE_COLORS[bank.safe] }}>
                    🛡 {t.safeLabels[bank.safe] || bank.safe}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '20px', fontWeight: '800',
                  background: 'linear-gradient(90deg, #0099ff, #00e5cc)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>{bank.rates[selectedTenor]}%</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>p.a.</div>
              </div>
              <button onClick={() => handleAsk(bank, selectedTenor)} style={{
                padding: '7px 12px', borderRadius: '9px', border: 'none',
                background: 'rgba(0,180,255,0.1)', color: '#00b4ff',
                fontSize: '12px', cursor: 'pointer', fontWeight: '600',
                fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', whiteSpace: 'nowrap'
              }}
                onMouseEnter={e => e.target.style.background = 'rgba(0,180,255,0.2)'}
                onMouseLeave={e => e.target.style.background = 'rgba(0,180,255,0.1)'}
              >{t.ask}</button>
            </div>
          </div>
        ))}
      </div>

      {/* Calculator */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,180,255,0.15)',
        borderRadius: '16px', padding: '20px', marginBottom: '20px'
      }}>
        <div style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{t.calcTitle}</div>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginBottom: '18px' }}>{t.calcSubtitle}</div>

        {/* Principal */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '6px', fontWeight: '500' }}>{t.investAmount}</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[10000, 50000, 100000, 500000].map(amt => (
              <button key={amt} onClick={() => setPrincipal(amt)} style={{
                padding: '6px 14px', borderRadius: '8px', border: 'none',
                background: principal === amt ? 'linear-gradient(135deg, #0055cc, #00aaff)' : 'rgba(255,255,255,0.06)',
                color: principal === amt ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s', fontWeight: principal === amt ? '600' : '400'
              }}>₹{amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}K`}</button>
            ))}
          </div>
          <input
            type="number" value={principal}
            onChange={e => setPrincipal(Number(e.target.value))}
            placeholder={t.customPlaceholder}
            style={{
              marginTop: '10px', width: '100%', height: '42px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,180,255,0.2)',
              borderRadius: '10px', color: '#fff', padding: '0 14px', fontSize: '14px',
              outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Bank selector */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '6px', fontWeight: '500' }}>{t.selectBank}</div>
          <select value={calcBank.short} onChange={e => setCalcBank(FD_RATES.find(b => b.short === e.target.value))} style={{
            width: '100%', height: '42px', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(0,180,255,0.2)', borderRadius: '10px',
            color: '#fff', padding: '0 14px', fontSize: '14px',
            outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box'
          }}>
            {FD_RATES.map(b => (
              <option key={b.short} value={b.short} style={{ background: '#071428' }}>
                {b.bank} — {b.rates[calcTenor]}% ({t.tenorLabels[calcTenor]})
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '6px', fontWeight: '500' }}>{t.duration}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {TENORS.map(tenor => (
              <button key={tenor} onClick={() => setCalcTenor(tenor)} style={{
                flex: 1, padding: '8px 0', borderRadius: '8px', border: 'none',
                background: calcTenor === tenor ? 'linear-gradient(135deg, #0055cc, #00aaff)' : 'rgba(255,255,255,0.06)',
                color: calcTenor === tenor ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s', fontWeight: calcTenor === tenor ? '600' : '400'
              }}>{t.tenorLabels[tenor]}</button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
          <div style={{ background: 'rgba(0,180,255,0.08)', border: '1px solid rgba(0,180,255,0.2)', borderRadius: '12px', padding: '14px' }}>
            <div style={{ color: 'rgba(0,180,255,0.7)', fontSize: '11px', marginBottom: '6px', fontWeight: '600' }}>{t.maturityLabel}</div>
            <div style={{ color: '#fff', fontSize: '20px', fontWeight: '800' }}>{formatINR(maturity)}</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '4px' }}>{t.afterLabel} {t.tenorLabels[calcTenor]}</div>
          </div>
          <div style={{ background: 'rgba(0,229,204,0.08)', border: '1px solid rgba(0,229,204,0.2)', borderRadius: '12px', padding: '14px' }}>
            <div style={{ color: 'rgba(0,229,204,0.7)', fontSize: '11px', marginBottom: '6px', fontWeight: '600' }}>{t.interestLabel}</div>
            <div style={{ color: '#00e5cc', fontSize: '20px', fontWeight: '800' }}>{formatINR(interest)}</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '4px' }}>{t.atLabel} {calcBank.rates[calcTenor]}% p.a.</div>
          </div>
        </div>

        {/* Savings comparison */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '3px' }}>{t.savingsCompare}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{t.savingsEarn} {formatINR(savingsInterest)}</div>
          </div>
          <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '6px 12px', textAlign: 'center' }}>
            <div style={{ color: '#10b981', fontSize: '13px', fontWeight: '700' }}>+{formatINR(extra)}</div>
            <div style={{ color: 'rgba(16,185,129,0.6)', fontSize: '10px' }}>{t.extraWithFD}</div>
          </div>
        </div>

        {/* Ask button */}
        <button onClick={() => handleAsk(calcBank, calcTenor)} style={{
          width: '100%', marginTop: '14px', padding: '13px',
          background: 'linear-gradient(135deg, #0055cc, #00aaff)',
          border: 'none', borderRadius: '12px', color: '#fff',
          fontSize: '14px', fontWeight: '600', cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: '0 4px 16px rgba(0,100,255,0.3)', transition: 'all 0.2s'
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >{t.askBtn}</button>
      </div>

      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.15)', textAlign: 'center', paddingBottom: '16px' }}>
        {t.disclaimer}
      </div>
    </div>
  );
}
          
