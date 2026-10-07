import {
  User,
  Category,
  Collection,
  Product,
  Course,
  ClassSession,
  Instructor,
  Certificate,
  Review,
  Notification
} from '../../src/types/index';

export const SEED_USERS: User[] = [
  { id: 'usr_customer_1', email: 'customer@atelierofficial.com', name: 'Amara Okafor', roles: ['CUSTOMER'], createdAt: '2026-10-07T00:00:00Z' },
  {
    id: 'usr_admin_1',
    email: 'admin@atelierofficial.com',
    name: 'Elena Rostova',
    roles: ['ADMIN', 'INSTRUCTOR', 'STUDENT', 'CUSTOMER'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 234-8901',
    bio: 'Creative Director at ATELIER & ACADÉMIE. Pioneer in blending European architectural suiting with West African indigenous master textiles.',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'usr_instructor_1',
    email: 'vivienne@atelierofficial.com',
    name: 'Madame Vivienne Vance',
    roles: ['INSTRUCTOR', 'CUSTOMER'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 432-1098',
    bio: 'Former Master Patternmaker at Parisian haute couture ateliers. Specializes in 3D bias draping, anatomical blocks, and silk manipulation.',
    createdAt: '2026-01-15T09:30:00Z',
  },
  {
    id: 'usr_instructor_2',
    email: 'julian@atelierofficial.com',
    name: 'Julian Sterling',
    roles: ['INSTRUCTOR', 'CUSTOMER'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 987-6543',
    bio: 'Savile Row-trained Master Tailor. Authority on floating horsehair canvas construction, hand pad-stitching, and fusing English worsteds with heritage textiles.',
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'usr_instructor_3',
    email: 'folashade@atelierofficial.com',
    name: 'Folashade Adeleke',
    roles: ['INSTRUCTOR', 'CUSTOMER'],
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    phone: '+234 803 456 7890',
    bio: 'Lagos & London Master Couturière and CFDA Fellow. Renowned for structural Aso-Oke narrow-strip tailoring, geometric alignment, and contemporary eveningwear.',
    createdAt: '2026-01-22T11:00:00Z',
  },
  {
    id: 'usr_student_1',
    email: 'student@atelierofficial.com',
    name: 'Claire Chen',
    roles: ['STUDENT', 'CUSTOMER'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 345-6789',
    bio: 'Apparel designer specializing in Afro-Western eveningwear silhouettes and hand-dyed Abeokuta Adire silks.',
    createdAt: '2026-02-01T11:00:00Z',
  }
];

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat_outerwear',
    slug: 'outerwear',
    name: 'Boubous & Outerwear',
    description: 'Floor-sweeping African wax print kimono dusters, melton wool trench coats with Aso-Oke facings, and architectural outerwear.',
  },
  {
    id: 'cat_eveningwear',
    slug: 'eveningwear',
    name: 'African Couture Eveningwear',
    description: 'Imperial sunburst gala boubous, geometric maze A-line ballgowns, crimson Ankara peplum dresses, and Bonwire Kente capes.',
  },
  {
    id: 'cat_tailoring',
    slug: 'tailoring',
    name: 'Handwoven Aso-Oke Menswear',
    description: 'Bespoke handloom zip jackets and Savile Row floating canvas suiting structured with Yoruba narrow-strip cloth.',
  },
  {
    id: 'cat_leather',
    slug: 'leather-goods',
    name: 'Wrap Skirts & Separates',
    description: 'High-waisted botanical fan wrap maxi skirts with cascading sashes, Tuscan leather totes, and artisan studio accessories.',
  }
];

export const SEED_COLLECTIONS: Collection[] = [
  {
    id: 'col_autumn_2026',
    slug: 'autumn-winter-2026',
    name: 'Sahara to Savile Row Sartorial Capsule',
    season: 'AW 2026',
    description: 'Savile Row architectural suiting fused with West African handwoven Aso-Oke, 420gsm melton wool, and cast bronze buttons.',
    bannerImage: '/assets/garments/royal-golden-boubou.jpg',
    isFeatured: true,
  },
  {
    id: 'col_archive_tailoring',
    slug: 'archive-tailoring',
    name: 'Adire & Silk Haute Couture Archive',
    season: 'Permanent Collection',
    description: 'Abeokuta indigo resist-dyed silks, Grade 6A mulberry satin, and structural French bias tailoring.',
    bannerImage: '/assets/garments/regal-mosaic-boubou.jpg',
    isFeatured: true,
  }
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    slug: 'sovereignty-wool-trench',
    name: 'The Sovereignty Double-Breasted Wool Trench',
    tagline: 'Heavy 420gsm melton wool with handwoven Yoruba Aso-Oke storm facing and cast bronze buttons.',
    description: 'A masterwork bridging European outerwear engineering with West African textile heritage. Features an exaggerated notched lapel, dropped raglan shoulders, and storm flaps lined in authentic handwoven Yoruba Aso-Oke strip cloth crafted by master weavers in Iseyin. Cast solid brass buttons forged by artisan bronze casters in Benin City.',
    details: [
      'Outer: 80% Virgin Wool, 20% Mongolian Cashmere (420gsm heavy melton)',
      'Internal storm facing: 100% Handwoven Aso-Oke (raw silk & hand-spun organic cotton)',
      'Lining: 100% Bemberg Cupro in Noir with hand-bound French seams',
      'Solid antiqued brass cast buttons forged using lost-wax casting technique',
      'Removable belt with matching cast rectangular brass buckle',
      'Limited production run of 40 serialized pieces produced across Milan and Lagos ateliers'
    ],
    fabricCare: 'Specialist dry clean only. Steam gently; do not press iron directly on Aso-Oke weave.',
    price: 890,
    compareAtPrice: 1100,
    categoryId: 'cat_outerwear',
    collectionId: 'col_autumn_2026',
    isPublished: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'var_1_camel_s', productId: 'prod_1', sku: 'AT-TRN-CAM-S', title: 'Camel / Small', size: 'S', color: 'Sahara Camel & Gold Aso-Oke', colorHex: '#C5A059', price: 890, stock: 6, reservedStock: 0 },
      { id: 'var_1_camel_m', productId: 'prod_1', sku: 'AT-TRN-CAM-M', title: 'Camel / Medium', size: 'M', color: 'Sahara Camel & Gold Aso-Oke', colorHex: '#C5A059', price: 890, stock: 8, reservedStock: 0 },
      { id: 'var_1_camel_l', productId: 'prod_1', sku: 'AT-TRN-CAM-L', title: 'Camel / Large', size: 'L', color: 'Sahara Camel & Gold Aso-Oke', colorHex: '#C5A059', price: 890, stock: 4, reservedStock: 0 },
      { id: 'var_1_noir_m', productId: 'prod_1', sku: 'AT-TRN-NOIR-M', title: 'Noir / Medium', size: 'M', color: 'Midnight Noir & Indigo Weave', colorHex: '#141414', price: 890, stock: 5, reservedStock: 0 }
    ],
    averageRating: 4.95,
    reviewCount: 22,
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'prod_2',
    slug: 'bias-cut-mulberry-silk-gown',
    name: 'Bias-Cut Mulberry Silk & Indigo Adire Slip Gown',
    tagline: 'Hand-dyed Abeokuta cassava resist-indigo motifs on 28-momme French bias silk.',
    description: 'A transcendent harmony of Parisian Madeleine Vionnet bias drape and sacred Nigerian Adire Eleko textile art. Grade 6A mulberry silk is hand-painted with cassava starch resist and immersed in natural fermented indigo vats in Abeokuta, Nigeria, before being precision-cut on the true 45-degree diagonal grain in our Paris studio.',
    details: [
      '100% Grade 6A Mulberry Silk Satin (28-momme heavy fluid drape)',
      'Authentic Adire Eleko resist patterns (each gown pattern varies slightly as a living artwork)',
      'True 45-degree bias cut that molds naturally to the silhouette without stiff internal boning',
      'Low architectural cowl back with Rouleau ties and natural brass cord weights',
      'Hand-rolled picot hems requiring 8 hours of needlework per piece'
    ],
    fabricCare: 'Cold hand wash with pH-neutral silk wash or specialist eco dry clean. Dry flat away from direct sunlight.',
    price: 650,
    categoryId: 'cat_eveningwear',
    collectionId: 'col_archive_tailoring',
    isPublished: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'var_2_ivory_xs', productId: 'prod_2', sku: 'AT-SLP-IVO-XS', title: 'Indigo & Ivory / XS', size: 'XS', color: 'Indigo Eleko & Ivory', colorHex: '#253B56', price: 650, stock: 3, reservedStock: 0 },
      { id: 'var_2_ivory_s', productId: 'prod_2', sku: 'AT-SLP-IVO-S', title: 'Indigo & Ivory / S', size: 'S', color: 'Indigo Eleko & Ivory', colorHex: '#253B56', price: 650, stock: 7, reservedStock: 0 },
      { id: 'var_2_champ_m', productId: 'prod_2', sku: 'AT-SLP-CHP-M', title: 'Champagne Ochre / M', size: 'M', color: 'Warm Champagne Ochre', colorHex: '#D8C6A8', price: 650, stock: 5, reservedStock: 0 },
      { id: 'var_2_obsidian_m', productId: 'prod_2', sku: 'AT-SLP-OBS-M', title: 'Obsidian Midnight / M', size: 'M', color: 'Deep Obsidian Indigo', colorHex: '#0F0F10', price: 650, stock: 4, reservedStock: 0 }
    ],
    averageRating: 5.0,
    reviewCount: 16,
    createdAt: '2026-02-05T14:30:00Z',
  },
  {
    id: 'prod_3',
    slug: 'architectural-sculpted-blazer',
    name: 'Aso-Oke Sculpted Tuxedo Blazer & Tailored Trouser',
    tagline: 'Savile Row floating horsehair canvas structured with hand-loomed gold and navy Aso-Oke strip cloth.',
    description: 'An authoritative study in Afro-Western tailoring. Cut with sharp British roped shoulders and a hand-shaped floating horsehair canvas chest piece, integrated with handwoven metallic-threaded Aso-Oke narrow strips. The lapels feature bespoke hand pick-stitching and silk satin contrast facing.',
    details: [
      'Body: Hand-loomed Yoruba Aso-Oke narrow strip cloth (Oyo, Nigeria) & English Super 130s Wool Worsted',
      'Internal architecture: Full floating horsehair canvas with hand pad-stitched lapels',
      'Working four-button surgeon cuffs with genuine mother-of-pearl buttons',
      'Cinch-back tailored architecture that creates an athletic, sculpted silhouette',
      'Handmade Milanese lapel buttonhole for lapel blooms or atelier brooch'
    ],
    fabricCare: 'Professional bespoke dry clean only. Steam after wear; natural boar bristle brush maintenance.',
    price: 780,
    compareAtPrice: 920,
    categoryId: 'cat_tailoring',
    collectionId: 'col_autumn_2026',
    isPublished: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'var_3_charcoal_38', productId: 'prod_3', sku: 'AT-BLZ-CHR-S', title: 'Charcoal & Gold Aso-Oke / 38 (S)', size: 'S', color: 'Deep Charcoal & Gold', colorHex: '#26282B', price: 780, stock: 5, reservedStock: 0 },
      { id: 'var_3_charcoal_40', productId: 'prod_3', sku: 'AT-BLZ-CHR-M', title: 'Charcoal & Gold Aso-Oke / 40 (M)', size: 'M', color: 'Deep Charcoal & Gold', colorHex: '#26282B', price: 780, stock: 7, reservedStock: 0 },
      { id: 'var_3_bone_40', productId: 'prod_3', sku: 'AT-BLZ-BON-M', title: 'Bone Ivory & Royal Blue / 40 (M)', size: 'M', color: 'Bone Ivory & Royal Blue', colorHex: '#EDE8DF', price: 780, stock: 3, reservedStock: 0 }
    ],
    averageRating: 4.88,
    reviewCount: 14,
    createdAt: '2026-02-10T12:00:00Z',
  },
  {
    id: 'prod_4',
    slug: 'vegetable-tanned-atelier-tote',
    name: 'Artisan Bògòlanfini Mud Cloth & Tuscan Leather Studio Tote',
    tagline: 'Hand-dyed fermented Malian river mud cloth lined with full-grain Vacchetta leather.',
    description: 'Crafted from hand-spun Malian Bògòlanfini (fermented river mud cloth dyed with sun-cured tree bark and iron-rich river silt) and trimmed with 3.2mm full-grain Tuscan vegetable-tanned Vacchetta leather. Designed to hold full architectural drafting rolls, cutting shears, and a 16-inch workstation.',
    details: [
      'Main body: Handwoven organic Malian cotton fermented in sacred Niger River mud',
      'Trim & Straps: Tuscan Vacchetta vegetable-tanned saddle leather with burnished wax edges',
      'Hand saddle-stitched using heavyweight Irish waxed linen thread',
      'Solid forged brass hardware with protective bottom atelier stud feet',
      'Internal zippered pocket for tailor shears, chalks, and personal valuables'
    ],
    fabricCare: 'Condition leather biannually with all-natural beeswax leather balm. Spot clean cloth with damp cloth.',
    price: 490,
    categoryId: 'cat_leather',
    collectionId: 'col_autumn_2026',
    isPublished: true,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'var_4_cognac', productId: 'prod_4', sku: 'AT-BAG-COG-STD', title: 'Ochre Mud Cloth & Cognac / One Size', size: 'Custom', color: 'Malian Ochre & Cognac', colorHex: '#9E5B32', price: 490, stock: 9, reservedStock: 0 },
      { id: 'var_4_noir', productId: 'prod_4', sku: 'AT-BAG-NOIR-STD', title: 'Charcoal Mud Cloth & Noir / One Size', size: 'Custom', color: 'Charcoal Mud & Noir', colorHex: '#181818', price: 490, stock: 4, reservedStock: 0 }
    ],
    averageRating: 5.0,
    reviewCount: 19,
    createdAt: '2026-02-15T16:00:00Z',
  },
  {
    id: 'prod_5',
    slug: 'royal-kente-organza-cape',
    name: 'Royal Bonwire Kente Silk Organza Architectural Cape',
    tagline: 'Handwoven Ashanti royal silk motifs integrated with French pleated organza.',
    description: 'A ceremonial evening statement piece honoring Ghanaian royal heritage and French couture volume. Woven by generational master weavers in Bonwire, Ghana, featuring the "Adwinasa" motif (signifying all motifs exhausted in perfection), set against diaphanous black silk organza.',
    details: [
      '100% Handwoven Ghanaian Royal Kente Silk & Pure Mulberry Silk Organza',
      'Padded architectural shoulders inspired by classical 1950s Parisian bal gowns',
      'High standing collar with discreet hidden magnet closures',
      'Floor-sweeping train with structured horsehair hem braid for dramatic motion',
      'Numbered atelier certificate of textile provenance signed by the Ashanti master weaver'
    ],
    fabricCare: 'Specialist dry clean only. Store on wide velvet hanger with breathable cotton garment bag.',
    price: 950,
    categoryId: 'cat_eveningwear',
    collectionId: 'col_archive_tailoring',
    isPublished: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'var_5_gold_std', productId: 'prod_5', sku: 'AT-KNT-GLD-STD', title: 'Royal Gold & Emerald / Standard', size: 'Custom', color: 'Royal Gold & Emerald Kente', colorHex: '#D4AF37', price: 950, stock: 4, reservedStock: 0 },
      { id: 'var_5_noir_std', productId: 'prod_5', sku: 'AT-KNT-NOIR-STD', title: 'Monochrome Noir & Gold / Standard', size: 'Custom', color: 'Monochrome Gold', colorHex: '#1F1F1F', price: 950, stock: 3, reservedStock: 0 }
    ],
    averageRating: 5.0,
    reviewCount: 8,
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'prod_afro_1',
    slug: 'grand-boubou-geometric-kimono',
    name: 'The Grand Boubou Geometric Kimono Duster',
    tagline: 'Sweeping floor-length African print duster with wide kimono sleeves and wine-striped lapels.',
    description: 'A striking statement piece showcasing geometric tribal motifs in black, off-white, and deep crimson. Cut with an exaggerated floor-length drape, wide kimono sleeves, and signature vertical striped lapels inspired by West African ceremonial attire. Perfect for layering over couture jumpsuits or tailored separates.',
    details: [
      '100% Premium African Wax Cotton with soft satin finish',
      'Contrasting vertical striped front lapel and sleeve cuff borders',
      'Deep hidden side pockets and relaxed flowing silhouette',
      'Floor-sweeping length (150cm from high shoulder point)',
      'Handcrafted by master artisans in our Lagos atelier'
    ],
    fabricCare: 'Dry clean recommended or gentle hand wash in cold water with mild detergent. Iron on reverse.',
    price: 680,
    compareAtPrice: 850,
    categoryId: 'cat_outerwear',
    collectionId: 'col_autumn_2026',
    isPublished: true,
    isFeatured: true,
    images: ['/assets/garments/graphic-boubou-duster.svg'],
    variants: [
      { id: 'var_afro1_s', productId: 'prod_afro_1', sku: 'AT-BOU-GEO-S', title: 'Noir & Crimson / Small', size: 'S', color: 'Noir & Wine Crimson', colorHex: '#7A1822', price: 680, stock: 6, reservedStock: 0 },
      { id: 'var_afro1_m', productId: 'prod_afro_1', sku: 'AT-BOU-GEO-M', title: 'Noir & Crimson / Medium', size: 'M', color: 'Noir & Wine Crimson', colorHex: '#7A1822', price: 680, stock: 8, reservedStock: 0 },
      { id: 'var_afro1_l', productId: 'prod_afro_1', sku: 'AT-BOU-GEO-L', title: 'Noir & Crimson / Large', size: 'L', color: 'Noir & Wine Crimson', colorHex: '#7A1822', price: 680, stock: 5, reservedStock: 0 }
    ],
    averageRating: 4.96,
    reviewCount: 28,
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prod_afro_2',
    slug: 'geometric-maze-maxi-gown',
    name: 'The Geometric Maze A-Line Maxi Gown',
    tagline: 'Deep V-neck ballgown with concentric circle and labyrinth maze prints on bronze ochre.',
    description: 'An architectural marvel celebrating sacred geometric art. Features a sculpted deep V-neckline, capped sleeves, a nipped natural waist with hidden seam pockets, and a dramatic, voluminous A-line skirt. Screen-printed with bronze, obsidian, and beige concentric circles and maze motifs.',
    details: [
      'Heavyweight 100% Cotton Sateen with crisp structured drape',
      'Deep plunge V-neck with reinforced contrast binding',
      'Concealed back zip closure and generous hidden side pockets',
      'Includes matching geometric headwrap fabric sash (gele)',
      'Constructed with French seams throughout'
    ],
    fabricCare: 'Dry clean only to maintain crisp structural pleating.',
    price: 740,
    compareAtPrice: 920,
    categoryId: 'cat_eveningwear',
    collectionId: 'col_autumn_2026',
    isPublished: true,
    isFeatured: true,
    images: ['/assets/garments/geometric-maze-maxi.jpg'],
    variants: [
      { id: 'var_afro2_xs', productId: 'prod_afro_2', sku: 'AT-MZE-MAX-XS', title: 'Bronze Maze / XS', size: 'XS', color: 'Bronze & Obsidian', colorHex: '#845339', price: 740, stock: 4, reservedStock: 0 },
      { id: 'var_afro2_s', productId: 'prod_afro_2', sku: 'AT-MZE-MAX-S', title: 'Bronze Maze / S', size: 'S', color: 'Bronze & Obsidian', colorHex: '#845339', price: 740, stock: 6, reservedStock: 0 },
      { id: 'var_afro2_m', productId: 'prod_afro_2', sku: 'AT-MZE-MAX-M', title: 'Bronze Maze / M', size: 'M', color: 'Bronze & Obsidian', colorHex: '#845339', price: 740, stock: 7, reservedStock: 0 },
      { id: 'var_afro2_l', productId: 'prod_afro_2', sku: 'AT-MZE-MAX-L', title: 'Bronze Maze / L', size: 'L', color: 'Bronze & Obsidian', colorHex: '#845339', price: 740, stock: 3, reservedStock: 0 }
    ],
    averageRating: 5.0,
    reviewCount: 19,
    createdAt: '2026-03-02T11:00:00Z',
  },
  {
    id: 'prod_afro_3',
    slug: 'regal-mosaic-boubou-gown',
    name: 'The Regal Mosaic Batwing Boubou Gown',
    tagline: 'Opulent crimson & noir mosaic geometric boubou with dramatic thigh slit and matching gele.',
    description: 'Pure African royalty. This showstopping boubou kaftan features a breathtaking mosaic of crimson, ivory, and onyx geometric patterns. Cut in a flowing batwing silhouette with a high front thigh slit that reveals the leg in motion, framed by a crimson placket and matching pleated gele headpiece.',
    details: [
      '100% Hand-dyed Silk Crepe de Chine with lustrous fluid drape',
      'Hand-finished neck placket and reinforced front thigh slit',
      'Includes sculpted pleated crown headwrap (gele)',
      'Loose, commanding regal silhouette that flatters every posture',
      'Artisan production limited to 30 serialized garments'
    ],
    fabricCare: 'Specialist dry clean only. Steam with low heat.',
    price: 820,
    compareAtPrice: 1050,
    categoryId: 'cat_eveningwear',
    collectionId: 'col_archive_tailoring',
    isPublished: true,
    isFeatured: true,
    images: ['/assets/garments/regal-mosaic-boubou.jpg'],
    variants: [
      { id: 'var_afro3_s', productId: 'prod_afro_3', sku: 'AT-REG-MOS-S', title: 'Crimson Mosaic / S', size: 'S', color: 'Crimson & Onyx Mosaic', colorHex: '#8E1D24', price: 820, stock: 5, reservedStock: 0 },
      { id: 'var_afro3_m', productId: 'prod_afro_3', sku: 'AT-REG-MOS-M', title: 'Crimson Mosaic / M', size: 'M', color: 'Crimson & Onyx Mosaic', colorHex: '#8E1D24', price: 820, stock: 6, reservedStock: 0 },
      { id: 'var_afro3_l', productId: 'prod_afro_3', sku: 'AT-REG-MOS-L', title: 'Crimson Mosaic / L', size: 'L', color: 'Crimson & Onyx Mosaic', colorHex: '#8E1D24', price: 820, stock: 4, reservedStock: 0 }
    ],
    averageRating: 4.98,
    reviewCount: 31,
    createdAt: '2026-03-03T12:00:00Z',
  },
  {
    id: 'prod_afro_4',
    slug: 'crimson-ankara-peplum-mini',
    name: 'The Crimson Ankara Peplum Mini Dress',
    tagline: 'Off-shoulder sweetheart neckline with smocked bodice and dramatic flared bell angel sleeves.',
    description: 'A vibrant party and cocktail silhouette crafted from authentic Nigerian wax Ankara in crimson red and cream spiral prints. Engineered with an elasticated smocked bodice that molds comfortably to the torso, an off-the-shoulder neckline, a double-flared peplum ruffle, and show-stopping angel bell sleeves.',
    details: [
      '100% Authentic Dutch Wax Cotton Ankara Print',
      'Hand-smocked stretch elastic midsection for tailored flexible fit',
      'Dramatic sweeping angel bell sleeves with voluminous flare',
      'Built-in structured peplum flounce over fitted mini skirt',
      'Concealed zipper and elasticated shoulder grip band'
    ],
    fabricCare: 'Cold hand wash with mild soap; line dry in shade. Warm iron on reverse side.',
    price: 460,
    compareAtPrice: 580,
    categoryId: 'cat_eveningwear',
    collectionId: 'col_autumn_2026',
    isPublished: true,
    isFeatured: true,
    images: ['/assets/garments/ankara-peplum-mini.jpg'],
    variants: [
      { id: 'var_afro4_xs', productId: 'prod_afro_4', sku: 'AT-PEP-MIN-XS', title: 'Crimson Spiral / XS', size: 'XS', color: 'Crimson Ankara', colorHex: '#B81D24', price: 460, stock: 5, reservedStock: 0 },
      { id: 'var_afro4_s', productId: 'prod_afro_4', sku: 'AT-PEP-MIN-S', title: 'Crimson Spiral / S', size: 'S', color: 'Crimson Ankara', colorHex: '#B81D24', price: 460, stock: 8, reservedStock: 0 },
      { id: 'var_afro4_m', productId: 'prod_afro_4', sku: 'AT-PEP-MIN-M', title: 'Crimson Spiral / M', size: 'M', color: 'Crimson Ankara', colorHex: '#B81D24', price: 460, stock: 6, reservedStock: 0 }
    ],
    averageRating: 4.92,
    reviewCount: 24,
    createdAt: '2026-03-04T13:00:00Z',
  },
  {
    id: 'prod_afro_5',
    slug: 'mens-handwoven-asooke-jacket',
    name: 'The Handwoven Aso-Oke Zip Bomber Jacket',
    tagline: 'Bespoke Savile Row menswear jacket handwoven with Yoruba vertical slate and obsidian stripes.',
    description: 'An authoritative study in modern African menswear. Hand-loomed on traditional wooden strip-cloth treadle looms in Iseyin, Nigeria, combining raw silk, organic cotton, and metallic threads into rich vertical charcoal and slate stripes. Features a polished chrome zip front, tailored collar, and horizontal-stripe patch pockets.',
    details: [
      'Body: 100% Handwoven Nigerian Aso-Oke strip cloth with bone accent pick-stitching',
      'Lining: Breathable Japanese cupro in obsidian black',
      'Solid forged chrome two-way front zipper with atelier pull tab',
      'Dual chest-height hand warmer pockets with horizontal stripe contrast',
      'Designed in London, handwoven in Oyo, tailored in Savile Row standards'
    ],
    fabricCare: 'Specialist dry clean only. Brush with boar bristle brush after wear.',
    price: 690,
    compareAtPrice: 840,
    categoryId: 'cat_tailoring',
    collectionId: 'col_autumn_2026',
    isPublished: true,
    isFeatured: true,
    images: ['/assets/garments/mens-asooke-jacket.jpg'],
    variants: [
      { id: 'var_afro5_38', productId: 'prod_afro_5', sku: 'AT-JKT-ASO-38', title: 'Slate Stripe / 38 (S)', size: 'S', color: 'Slate & Obsidian', colorHex: '#3A3D42', price: 690, stock: 4, reservedStock: 0 },
      { id: 'var_afro5_40', productId: 'prod_afro_5', sku: 'AT-JKT-ASO-40', title: 'Slate Stripe / 40 (M)', size: 'M', color: 'Slate & Obsidian', colorHex: '#3A3D42', price: 690, stock: 7, reservedStock: 0 },
      { id: 'var_afro5_42', productId: 'prod_afro_5', sku: 'AT-JKT-ASO-42', title: 'Slate Stripe / 42 (L)', size: 'L', color: 'Slate & Obsidian', colorHex: '#3A3D42', price: 690, stock: 5, reservedStock: 0 }
    ],
    averageRating: 5.0,
    reviewCount: 17,
    createdAt: '2026-03-05T14:00:00Z',
  },
  {
    id: 'prod_afro_6',
    slug: 'royal-golden-sunburst-boubou',
    name: 'The Royal Golden Sunburst Boubou Gown',
    tagline: 'Luminous marigold sunburst print kaftan with antique brass buckle cinched leather waist.',
    description: 'An unforgettable gala gown commanding royal presence. Cut from glowing marigold and terracotta printed silk satin, featuring sunburst medallions and geometric chevron motifs. The plunging V-neckline is cinched with an authentic 3-inch vegetable-tanned leather belt centered with a lost-wax cast Benin brass medallion buckle.',
    details: [
      '100% Pure Silk Twill with luminous warm sunburst reflection',
      'Includes 3.2mm full-grain Tuscan bridle leather cinch belt with solid cast brass buckle',
      'Wide kimono sleeves with hand-embroidered border bands',
      'Floor-length center front slit for fluid movement',
      'Accompanied by custom sculpted pleated golden gele crown'
    ],
    fabricCare: 'Specialist luxury dry clean only. Condition leather belt with natural balm.',
    price: 880,
    compareAtPrice: 1100,
    categoryId: 'cat_eveningwear',
    collectionId: 'col_archive_tailoring',
    isPublished: true,
    isFeatured: true,
    images: ['/assets/garments/royal-golden-boubou.jpg'],
    variants: [
      { id: 'var_afro6_s', productId: 'prod_afro_6', sku: 'AT-GLD-BOU-S', title: 'Marigold Sunburst / S', size: 'S', color: 'Marigold & Terracotta', colorHex: '#E58B12', price: 880, stock: 4, reservedStock: 0 },
      { id: 'var_afro6_m', productId: 'prod_afro_6', sku: 'AT-GLD-BOU-M', title: 'Marigold Sunburst / M', size: 'M', color: 'Marigold & Terracotta', colorHex: '#E58B12', price: 880, stock: 5, reservedStock: 0 },
      { id: 'var_afro6_l', productId: 'prod_afro_6', sku: 'AT-GLD-BOU-L', title: 'Marigold Sunburst / L', size: 'L', color: 'Marigold & Terracotta', colorHex: '#E58B12', price: 880, stock: 3, reservedStock: 0 }
    ],
    averageRating: 5.0,
    reviewCount: 35,
    createdAt: '2026-03-06T15:00:00Z',
  },
  {
    id: 'prod_afro_7',
    slug: 'botanical-fan-wrap-skirt',
    name: 'The Botanical Fan High-Waisted Wrap Skirt & Bodice',
    tagline: 'Golden ochre botanical palm fan wrap maxi with sculptural side-tie and noir square-neck bodice.',
    description: 'Contemporary elegance distilled. A high-waisted wrap maxi skirt printed with radiant golden ochre palm leaf and botanical fans against an obsidian base, secured by a dramatic cascading side-tie sash. Paired effortlessly with our seamless, double-lined jet black square-neck bodice and matching headwrap.',
    details: [
      'Skirt: 100% Breathable Organic Cotton Sateen with botanical leaf fan motifs',
      'Bodice: Double-layered compression jersey in matte noir',
      'Adjustable wrap waist tie creates customized hourglass silhouette',
      'Front overlap slit designed for effortless movement and shoe showcase',
      'Includes matching botanical fan print turban/gele headwrap'
    ],
    fabricCare: 'Machine wash delicate cold or dry clean. Hang to dry.',
    price: 580,
    compareAtPrice: 720,
    categoryId: 'cat_leather',
    collectionId: 'col_autumn_2026',
    isPublished: true,
    isFeatured: true,
    images: ['/assets/garments/botanical-wrap-skirt.jpg'],
    variants: [
      { id: 'var_afro7_xs', productId: 'prod_afro_7', sku: 'AT-BOT-WRP-XS', title: 'Botanical Gold / XS', size: 'XS', color: 'Golden Ochre Botanical', colorHex: '#D19C38', price: 580, stock: 5, reservedStock: 0 },
      { id: 'var_afro7_s', productId: 'prod_afro_7', sku: 'AT-BOT-WRP-S', title: 'Botanical Gold / S', size: 'S', color: 'Golden Ochre Botanical', colorHex: '#D19C38', price: 580, stock: 7, reservedStock: 0 },
      { id: 'var_afro7_m', productId: 'prod_afro_7', sku: 'AT-BOT-WRP-M', title: 'Botanical Gold / M', size: 'M', color: 'Golden Ochre Botanical', colorHex: '#D19C38', price: 580, stock: 8, reservedStock: 0 }
    ],
    averageRating: 4.97,
    reviewCount: 26,
    createdAt: '2026-03-07T16:00:00Z',
  }
];

export const SEED_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst_1',
    userId: 'usr_instructor_1',
    name: 'Madame Vivienne Vance',
    title: 'Master Patternmaker & Haute Couture Fellow',
    bio: 'Vivienne spent over two decades directing cutting rooms for Parisian high couture houses on Avenue Montaigne. She teaches precision flat pattern manipulation, anatomically tailored slopers, and 3D muslin stand draping.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    specialties: ['Western Architectural Pattern Drafting', 'Haute Couture Stand Draping', 'Bias Cutting & Grain Alignment', 'Parisian Corsetry'],
    hourlyRate: 175,
    experienceYears: 22,
    rating: 4.98,
    reviewCount: 68,
    studioLocation: 'Atelier Central, Paris & Live Zoom'
  },
  {
    id: 'inst_2',
    userId: 'usr_instructor_2',
    name: 'Julian Sterling',
    title: 'Savile Row Master Tailor & Suiting Specialist',
    bio: 'Apprenticed in London bespoke tailoring before establishing his independent bespoke house. Julian specializes in anatomical chest-canvas shaping, iron press-forming, and integrating traditional English worsteds with heritage textiles.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    specialties: ['Savile Row Canvas Shaping', 'Afro-Western Suiting Fusion', 'Hand Pad-Stitching', 'Trouser Balance & Pitch'],
    hourlyRate: 190,
    experienceYears: 16,
    rating: 4.95,
    reviewCount: 52,
    studioLocation: 'Savile Row Studio, London & Live Zoom'
  },
  {
    id: 'inst_3',
    userId: 'usr_instructor_3',
    name: 'Folashade Adeleke',
    title: 'Master Couturière & African Textile Authority',
    bio: 'Folashade is a renowned Lagos & London fashion designer and CFDA Fellow. She pioneered methods for precision pattern-matching on handwoven narrow-strip Aso-Oke, structural tailoring for African volumes, and botanical resist dyeing.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    specialties: ['Aso-Oke Structural Tailoring', 'Adire Eleko Resist Silk Lab', 'Narrow-Strip French Seaming', 'Contemporary African Red Carpet Couture'],
    hourlyRate: 185,
    experienceYears: 19,
    rating: 4.99,
    reviewCount: 76,
    studioLocation: 'Victoria Island Atelier, Lagos & Live Zoom'
  }
];

export const SEED_COURSES: Course[] = [
  {
    id: 'course_pattern_drafting',
    slug: 'architectural-pattern-drafting',
    title: 'Architectural Pattern Drafting & Bespoke Fit',
    subtitle: 'From anatomical body measurements to pristine master sloper blocks and silhouette manipulation.',
    description: 'This foundational yet rigorous masterclass demystifies flat pattern cutting. You will learn to draft bespoke front, back, sleeve, and skirt blocks from raw anatomical measurements, adjust for asymmetric postures, and manipulate darts into contemporary sculptural silhouettes.',
    level: 'Intermediate',
    durationHours: 32,
    price: 340,
    thumbnail: '/assets/garments/geometric-maze-maxi.jpg',
    instructorId: 'inst_1',
    instructorName: 'Madame Vivienne Vance',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    isPublished: true,
    isFeatured: true,
    learningOutcomes: [
      'Draft zero-error bodice, skirt, and two-piece sleeve slopers from exact client measurements',
      'Perform dart rotations, contouring, and neckline adjustments for strapless garments',
      'Grade commercial patterns accurately across European and US sizing increments',
      'Produce production-ready technical specification packs with grainlines, notches, and seam allowances'
    ],
    prerequisites: ['Basic machine sewing ability', 'Familiarity with metric or imperial measuring tapes', 'A drafting table or flat surface $\\ge 120\\text{cm}$'],
    enrolledCount: 142,
    rating: 4.96,
    modules: [
      {
        id: 'mod_1',
        courseId: 'course_pattern_drafting',
        title: 'Module 1: Anatomical Measurement & The Bodice Sloper',
        order: 1,
        lessons: [
          {
            id: 'les_1_1',
            moduleId: 'mod_1',
            courseId: 'course_pattern_drafting',
            title: '1.1 Taking Precision Measurements & Understanding Ease Allowances',
            slug: 'taking-precision-measurements',
            durationMinutes: 28,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            summary: 'Learn the exact 18-point anatomical measurement protocol used in European and African couture ateliers.',
            contentMarkdown: `### Precision Measurement Protocol

Accuracy at the tape measure is the difference between a bespoke garment that breathes with the wearer and a stiff failure.

1. **High Bust vs. Full Bust**: Measure High Bust directly under armpits, straight across back and above bust swell.
2. **Waist Circumference**: Tie an elastic cord around the natural waist; observe where it settles during natural movement.
3. **Across Back**: Measure from posterior shoulder fold to posterior shoulder fold across shoulder blades.
4. **Armscye Depth**: Measure vertically from 7th cervical vertebra to level of armpit line.

#### Studio Checklist
- Calibrated non-stretch fiberglass tape measure
- L-Square (tailor's ruler) & French Curve (Vary Form curve)
- Craft pattern paper (60–80 gsm)
- 0.5mm 2B technical pencil and chalk wheel`,
            order: 1,
            isFreePreview: true,
            resources: [
              { id: 'res_1', title: 'Atelier 18-Point Measurement Chart (PDF)', url: '/resources/measurement-chart.pdf', type: 'pdf' },
              { id: 'res_2', title: 'Ease Matrix for Woven Fabrics (PDF)', url: '/resources/ease-matrix.pdf', type: 'sheet' }
            ]
          },
          {
            id: 'les_1_2',
            moduleId: 'mod_1',
            courseId: 'course_pattern_drafting',
            title: '1.2 Drafting the Back Bodice Grid & Neckline Slope',
            slug: 'drafting-back-bodice-grid',
            durationMinutes: 35,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            summary: 'Establish the foundational grid, shoulder pitch, and back neck curve mathematically.',
            contentMarkdown: `### The Back Bodice Grid

Setting up the coordinate box is step one.
1. Draw vertical baseline $AB$ equal to Nape to Waist + 0.5cm.
2. Mark armscye depth point $C$ down from $A$.
3. Square horizontal lines from $A$, $C$, and $B$.
4. Calculate Back Neck Width: $(1/6 \\times \\text{Neck Circumference}) + 0.2\\text{cm}$.
5. Establish back shoulder drop at $4.5\\text{cm}$ below top baseline.`,
            order: 2,
            isFreePreview: false,
            resources: [
              { id: 'res_3', title: 'Back Bodice Drafting Diagram (PDF)', url: '/resources/back-bodice-diagram.pdf', type: 'pattern' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course_african_textile_couture',
    slug: 'african-textiles-contemporary-couture',
    title: 'African Textile Heritage & Contemporary Haute Couture',
    subtitle: 'Integrating handwoven Aso-Oke, royal Bonwire Kente, and Abeokuta Adire silks into high-end fashion silhouettes.',
    description: 'Led by Folashade Adeleke, this groundbreaking masterclass bridges traditional African narrow-strip weaving with Paris and Savile Row tailoring. Learn the physics of grainline tension on hand-loomed strips, pattern matching across geometric warp threads, and fusing indigenous textiles with floating horsehair canvas.',
    level: 'Masterclass',
    durationHours: 30,
    price: 380,
    thumbnail: '/assets/garments/ankara-peplum-mini.jpg',
    instructorId: 'inst_3',
    instructorName: 'Folashade Adeleke',
    instructorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    isPublished: true,
    isFeatured: true,
    learningOutcomes: [
      'Master narrow-strip joining techniques for Aso-Oke without bulk using specialized flat-fell and French seams',
      'Engineer dart rotations around intricate geometric Kente motifs without distorting cultural symbology',
      'Create botanical indigo resist vats using cassava starch (Adire Eleko) on fine mulberry silk',
      'Tailor structured Afro-Western outerwear featuring horsehair canvas and traditional Aso-Oke facings'
    ],
    prerequisites: ['Intermediate garment construction', 'Knowledge of basic sloper blocks'],
    enrolledCount: 118,
    rating: 4.99,
    modules: [
      {
        id: 'mod_afro_1',
        courseId: 'course_african_textile_couture',
        title: 'Module 1: The Anatomy of Handwoven Narrow-Strip Cloth',
        order: 1,
        lessons: [
          {
            id: 'les_af1_1',
            moduleId: 'mod_afro_1',
            courseId: 'course_african_textile_couture',
            title: '1.1 Sourcing & Grain Alignment: From Yoruba Looms to the Cutting Table',
            slug: 'sourcing-grain-alignment-aso-oke',
            durationMinutes: 32,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            summary: 'Understand the tension, warp density, and selvage integrity of 10cm-wide handwoven cloth.',
            contentMarkdown: `### The Physics of Aso-Oke & Kente Strips

Unlike industrial mill-woven yardage that spans 140cm with uniform selvedges, African artisanal strip cloth is hand-loomed on double-heddle treadle looms in widths ranging from 10cm to 15cm.

1. **Selvage Joining**: Never overlap selvages mechanically; edge-to-edge blind stitching preserves hand drape.
2. **Pre-shrinking & Steaming**: Natural cotton and raw silk shrink up to 8% under moisture. Preshrink with gravity iron.
3. **Warp Tension Control**: Align warp stripe intervals meticulously across jacket lapels and pocket flaps.`,
            order: 1,
            isFreePreview: true,
            resources: [
              { id: 'res_af_1', title: 'Aso-Oke Pattern Alignment Guide (PDF)', url: '/resources/aso-oke-guide.pdf', type: 'pattern' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course_haute_couture_draping',
    slug: 'haute-couture-draping',
    title: 'Haute Couture Stand Draping: Paris to Dakar',
    subtitle: 'Sculpting structural volumes and bias silhouettes directly on the mannequin.',
    description: 'Move beyond 2D calculations into the organic art of draping. This masterclass teaches you how to drape fluid bias-cut slips, build internal corselettes, and drape dramatic Senegalese Grand Boubou volumes paired with modern European corsetry.',
    level: 'Masterclass',
    durationHours: 24,
    price: 390,
    thumbnail: '/assets/garments/royal-golden-boubou.jpg',
    instructorId: 'inst_1',
    instructorName: 'Madame Vivienne Vance',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    isPublished: true,
    isFeatured: true,
    learningOutcomes: [
      'Master French style tape-marking on tailor dummies to establish impeccable proportions',
      'Drape fluid bias-cut slips with zero grainline twist or bubble',
      'Construct reinforced interior corselettes with spiral steel boning',
      'Transfer 3D pinned muslin to 2D true paper patterns without altering the sculptural line'
    ],
    prerequisites: ['Prior pattern drafting knowledge recommended', 'Professional dress form / mannequin'],
    enrolledCount: 96,
    rating: 4.99,
    modules: [
      {
        id: 'mod_drape_1',
        courseId: 'course_haute_couture_draping',
        title: 'Module 1: Stand Preparation & Grainline Taping',
        order: 1,
        lessons: [
          {
            id: 'les_d1_1',
            moduleId: 'mod_drape_1',
            courseId: 'course_haute_couture_draping',
            title: '1.1 Applying Style Tape: Apex, Princess Line & Balance Grid',
            slug: 'applying-style-tape',
            durationMinutes: 30,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            summary: 'Position style tapes with laser precision across center front, side seam, and armscye.',
            contentMarkdown: `### Dress Form Taping Guidelines
Style tape defines the boundaries where your pinned muslin will rest. Check symmetry with a metal ruler from ground level.`,
            order: 1,
            isFreePreview: true,
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'course_bespoke_tailoring',
    slug: 'bespoke-tailoring-construction',
    title: 'Foundations of Bespoke Tailoring & Canvas Construction',
    subtitle: 'The craft of hand-canvassed suiting, pad stitching, and bespoke trousers.',
    description: 'Learn the exacting craft of bespoke tailoring taught by Savile Row veteran Julian Sterling. Understand canvas shaping, pocket jetting, hand bar-tacking, and sleeve setting.',
    level: 'Beginner',
    durationHours: 20,
    price: 290,
    thumbnail: '/assets/garments/mens-asooke-jacket.jpg',
    instructorId: 'inst_2',
    instructorName: 'Julian Sterling',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isPublished: true,
    isFeatured: false,
    learningOutcomes: [
      'Hand pad-stitch lapels and collar stands for permanent roll memory',
      'Assemble welt pockets and double-jetted flap pockets with razor precision',
      'Fit and ease a two-piece tailored jacket sleeve with zero puckering',
      'Understand chest canvas layering (horsehair, domette, haircloth)'
    ],
    prerequisites: ['Basic machine sewing competence'],
    enrolledCount: 114,
    rating: 4.92,
    modules: [
      {
        id: 'mod_tailor_1',
        courseId: 'course_bespoke_tailoring',
        title: 'Module 1: The Tailor’s Toolset & Wool Behavior',
        order: 1,
        lessons: [
          {
            id: 'les_t1_1',
            moduleId: 'mod_tailor_1',
            courseId: 'course_bespoke_tailoring',
            title: '1.1 The Anvil, The Clapper & The Iron: Molding Wool with Steam',
            slug: 'molding-wool-with-steam',
            durationMinutes: 24,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            summary: 'Discover how heavy gravity-fed irons and oak tailor clappers permanently compress wool fibers.',
            contentMarkdown: `### Ironwork Fundamentals in Bespoke Tailoring
Wool is plastic under heat, moisture, and pressure. We do not press garments flat; we shape them into anatomical curves.`,
            order: 1,
            isFreePreview: true,
            resources: []
          }
        ]
      }
    ]
  }
];

export const SEED_CLASSES: ClassSession[] = [
  {
    id: 'class_1',
    courseId: 'course_african_textile_couture',
    instructorId: 'inst_3',
    instructorName: 'Folashade Adeleke',
    title: 'Live Masterclass: Joining Handwoven Narrow-Strip Aso-Oke with French Seams',
    description: 'An interactive studio critique where students practice connecting hand-loomed narrow strips with invisible flat French seams without distortion. Live Q&A and close-up camera angles.',
    date: '2026-10-14',
    startTime: '16:00',
    endTime: '18:00',
    capacity: 25,
    enrolledCount: 19,
    isOnline: true,
    location: 'Atelier Live Video Studio (Lagos & London)',
    meetingUrl: 'https://meet.google.com/xyz-atelier-live',
    price: 55,
    status: 'SCHEDULED',
    enrolledUserIds: ['usr_student_1']
  },
  {
    id: 'class_2',
    courseId: 'course_bespoke_tailoring',
    instructorId: 'inst_2',
    instructorName: 'Julian Sterling',
    title: 'Studio Workshop: Bespoke Savile Row Collar Pad-Stitching Intensive',
    description: 'Hands-on in-person workshop at our London atelier studio. Limited to 10 attendees to guarantee 1-on-1 hand stitch guidance on horsehair canvas shaping.',
    date: '2026-10-22',
    startTime: '10:00',
    endTime: '15:00',
    capacity: 10,
    enrolledCount: 7,
    isOnline: false,
    location: 'Atelier West Studio, 14 Savile Row, London W1S 3JN',
    price: 180,
    status: 'SCHEDULED',
    enrolledUserIds: []
  }
];

export const SEED_CERTIFICATES: Certificate[] = [
  {
    id: 'cert_1',
    certificateCode: 'CERT-2026-ATELIER-01',
    userId: 'usr_student_1',
    studentName: 'Claire Chen',
    courseId: 'course_pattern_drafting',
    courseTitle: 'Architectural Pattern Drafting & Bespoke Fit',
    instructorName: 'Madame Vivienne Vance',
    instructorTitle: 'Master Patternmaker & Haute Couture Fellow',
    issueDate: '2026-03-15',
    grade: 'Distinction',
    verificationUrl: '/certificates/CERT-2026-ATELIER-01'
  }
];

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    userId: 'usr_student_1',
    userName: 'Claire Chen',
    productId: 'prod_1',
    rating: 5,
    title: 'The trench coat of a lifetime.',
    comment: 'The fusion of heavy 420gsm melton wool with the Aso-Oke storm facing is mesmerizing. The cast brass buttons have genuine weight, and the fit is pure Savile Row architecture.',
    verifiedPurchase: true,
    createdAt: '2026-03-01T15:20:00Z'
  },
  {
    id: 'rev_2',
    userId: 'usr_student_1',
    userName: 'Claire Chen',
    courseId: 'course_pattern_drafting',
    rating: 5,
    title: 'Completely transformed how I construct garments.',
    comment: 'The anatomical formulas for bust apex and armscye depth work flawlessly across diverse body types. Indispensable for any modern couturier.',
    verifiedPurchase: true,
    createdAt: '2026-03-16T09:15:00Z'
  }
];
