// src/pages/FestivalInsightPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import './FestivalInsightPage.css'; 

interface InsightData {
  [key: string]: {
    name: string;
    color: string;
    topProducts: string[];
    keywords: string[];
    regions: string[];
  };
}

const insightData: InsightData = {
  diwali: {
    name: 'Diwali',
    color: '#FF6B35',
    topProducts: ['Zari Sarees', 'Anarkali Suits'],
    keywords: ['Ethnic wear', 'Diwali outfits', 'Festive sari'],
    regions: ['Lucknow', 'Delhi', 'Ahmedabad'],
  },
  eid: {
    name: 'Eid',
    color: '#00BFFF',
    topProducts: ['White Kurtas', 'Pathani Suits'],
    keywords: ['Eid kurta', 'Muslim fashion', 'Traditional dress'],
    regions: ['Hyderabad', 'Bhopal', 'Lucknow'],
  },
  navratri: {
    name: 'Navratri',
    color: '#FFA500',
    topProducts: ['Lehenga Choli', 'Chaniya Choli'],
    keywords: ['Garba fashion', 'Navratri look', 'Lehenga set'],
    regions: ['Rajkot', 'Surat', 'Vadodara'],
  },
  basant: {
    name: 'Basant',
    color: '#FFD700',
    topProducts: ['Yellow Dupattas', 'Cotton Suits'],
    keywords: ['Spring fashion', 'Basant style', 'Yellow ethnic wear'],
    regions: ['Amritsar', 'Ludhiana', 'Chandigarh'],
  }
};

const FestivalInsightPage = () => {
  const { festival } = useParams<{ festival: string }>();
  const navigate = useNavigate();
  const data = insightData[festival?.toLowerCase() || ''];

  if (!data) {
    return <div>Festival insights not found.</div>;
  }

  return (
    <div className="insight-page" style={{ background: `${data.color}20`, padding: '2rem' }}>
      <h1 style={{ color: data.color }}>{data.name} Insights</h1>

      <section>
        <h2>🔥 Top Trending Products</h2>
        <ul>
          {data.topProducts.map((item, idx) => (
            <li key={idx}>- {item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>📍 High-Demand Regions</h2>
        <ul>
          {data.regions.map((city, idx) => (
            <li key={idx}>- {city}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>🔎 Keyword Trends</h2>
        <ul>
          {data.keywords.map((kw, idx) => (
            <li key={idx}>- {kw}</li>
          ))}
        </ul>
      </section>

      <div style={{ marginTop: '2rem' }}>
        <button
          style={{
            backgroundColor: data.color,
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onClick={() => navigate('/campaigns')}
        >
          Generate Campaign
        </button>
      </div>
    </div>
  );
};

export default FestivalInsightPage;
