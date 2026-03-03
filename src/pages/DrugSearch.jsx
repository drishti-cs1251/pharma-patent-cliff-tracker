// pages/DrugSearch.jsx
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import SearchBar from '../components/SearchBar/SearchBar';

export default function DrugSearch() {
  return (
    <div className="page">
      <Header />
      <main className="page-content">
        <SearchBar />
      </main>
      <Footer />
    </div>
  );
}