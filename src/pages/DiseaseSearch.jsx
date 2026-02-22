// pages/DiseaseSearch.jsx
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import DiseaseDropdown from '../components/DiseaseDropdown/DiseaseDropdown';
//import './PageStyles.css';

export default function DiseaseSearch() {
  return (
    <div className="page">
      <Header />
      <main className="page-content">
        <DiseaseDropdown />
      </main>
      <Footer />
    </div>
  );
}