import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Product } from '../types/index';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';

const photo = (name: string) => `/assets/garments/${name}.jpg`;
export const HomePage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [failed, setFailed] = useState(false);
  useEffect(() => { api.getProducts().then(({ products }) => setProducts(products.filter(p => p.images[0]?.endsWith('.jpg')).slice(0, 4))).catch(() => setFailed(true)); }, []);
  return <div className="brand-home">
    <section className="heritage-grid" aria-label="Discover African style">
      <div className="heritage-hero image-tile">
        <img src={photo('botanical-wrap-skirt')} alt="Gold and black African print wrap skirt with a matching headwrap" fetchPriority="high" />
        <div className="hero-shade" />
        <div className="hero-copy"><span className="eyebrow">A culture. A craft. A way of life.</span><h1>Wear your<br />roots.<br /><em>Own your</em><br />story.</h1><p>African heritage, expressed in every print.<br />Made for the way you move through the world.</p><button className="brand-button light" onClick={() => onNavigate('/collections')}>Explore collections <ArrowUpRight size={17} /></button></div>
        <span className="image-caption">THE HERITAGE EDIT / 2026</span>
      </div>
      <button className="image-tile category-tile women-tile" onClick={() => onNavigate('/shop?category=cat_eveningwear')}><img src={photo('ankara-peplum-mini')} alt="Crimson Ankara peplum dress" /><span className="tile-title">For her <ArrowUpRight /></span><span className="tile-note">Prints with presence</span></button>
      <button className="image-tile category-tile men-tile" onClick={() => onNavigate('/shop?category=cat_tailoring')}><img src={photo('mens-asooke-jacket')} alt="Black and white striped menswear jacket" /><span className="tile-title">For him <ArrowUpRight /></span><span className="tile-note">A new tradition</span></button>
    </section>
    <section className="culture-grid" aria-label="Explore the atelier">
      <button className="image-tile story-tile" onClick={() => onNavigate('/shop/geometric-maze-maxi-gown')}><img src={photo('geometric-maze-maxi')} alt="Geometric African print maxi gown" /><span>Rooted in culture.<br />Styled by you.</span><ArrowUpRight /></button>
      <button className="image-tile story-tile" onClick={() => onNavigate('/shop/regal-mosaic-boubou-gown')}><img src={photo('regal-mosaic-boubou')} alt="Statement crimson and black boubou with headwrap" /><span>Bold prints.<br />Endless expression.</span><ArrowUpRight /></button>
      <div className="tradition-copy"><span className="eyebrow">Beyond the garment</span><h2>Tradition.<br />With a twist.</h2><p>Rich colour. Unmistakable silhouettes. Discover a wardrobe that carries African expression into the everyday.</p><button className="text-link" onClick={() => onNavigate('/shop')}>Find your expression <ArrowUpRight size={18} /></button></div>
    </section>
    <div className="brand-manifesto"><span>African soul.</span><span>Modern expression.</span><span>Unmistakably you.</span></div>
    <section className="brand-arrivals"><div className="section-heading"><div><span className="eyebrow">The wardrobe edit</span><h2>Made to stand out.</h2></div><button className="text-link" onClick={() => onNavigate('/shop')}>Shop all pieces <ArrowUpRight size={18} /></button></div><div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7">{products.map(product => <ProductCard key={product.id} product={product} onSelect={slug => onNavigate(`/shop/${slug}`)} />)}</div>{failed && <p>We couldn't load the collection. <button className="text-link" onClick={() => onNavigate('/shop')}>Visit the shop <ArrowRight size={16} /></button></p>}</section>
    <section className="craft-feature"><div className="craft-copy"><span className="eyebrow">Atelier &amp; Académie</span><h2>African craft.<br />A world of<br /><em>possibility.</em></h2><p>Wear the story. Learn the craft. From your first pattern to your next statement piece, make room for your own creative expression.</p><div className="craft-actions"><button className="brand-button gold" onClick={() => onNavigate('/academy')}>Discover the academy <ArrowUpRight size={17} /></button><button className="text-link" onClick={() => onNavigate('/tutoring')}>Meet your mentor <ArrowUpRight size={17} /></button></div></div><div className="craft-photo"><img src={photo('royal-golden-boubou')} alt="Golden African print boubou and sculptural headwrap" loading="lazy" /><span>HERITAGE IN EVERY DETAIL</span></div></section>
    <section className="next-chapter"><span className="eyebrow">Your next chapter starts here</span><h2>Not just worn.<br /><em>Passed on.</em></h2><p>Learn to cut, shape, and create with the next generation of fashion makers.</p><button className="brand-button" onClick={() => onNavigate('/classes')}>Explore live classes <ArrowUpRight size={17} /></button></section>
  </div>;
};
