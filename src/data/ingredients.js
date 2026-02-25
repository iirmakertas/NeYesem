export const ingredientCategories = [
    {
        name: 'Et & Tavuk',
        emoji: '🥩',
        items: ['Kıyma', 'Tavuk Göğsü', 'Tavuk But', 'Dana Eti', 'Kuzu Eti', 'Sucuk', 'Sosis', 'Pastırma', 'Jambon', 'Balık', 'Karides', 'Ciğer', 'Köfte', 'Biftek']
    },
    {
        name: 'Sebzeler',
        emoji: '🥬',
        items: ['Domates', 'Soğan', 'Sarımsak', 'Biber', 'Patlıcan', 'Kabak', 'Patates', 'Havuç', 'Ispanak', 'Brokoli', 'Karnabahar', 'Fasulye', 'Bezelye', 'Mısır', 'Bamya', 'Enginar', 'Kereviz', 'Pırasa', 'Lahana', 'Turp', 'Mantar', 'Salatalık', 'Marul', 'Roka', 'Semizotu', 'Pazı', 'Taze Fasulye', 'Sivri Biber', 'Dolmalık Biber']
    },
    {
        name: 'Meyveler',
        emoji: '🍎',
        items: ['Elma', 'Muz', 'Portakal', 'Limon', 'Çilek', 'Nar', 'Üzüm', 'Karpuz', 'Kavun', 'Armut', 'Kayısı', 'Şeftali', 'Avokado', 'Hurma', 'İncir']
    },
    {
        name: 'Bakliyat',
        emoji: '🫘',
        items: ['Mercimek', 'Nohut', 'Kuru Fasulye', 'Bulgur', 'Pirinç', 'Makarna', 'Erişte', 'Kuskus', 'Kinoa', 'Yeşil Mercimek', 'Barbunya']
    },
    {
        name: 'Süt Ürünleri',
        emoji: '🧀',
        items: ['Süt', 'Yoğurt', 'Peynir', 'Beyaz Peynir', 'Kaşar Peyniri', 'Lor Peyniri', 'Tulum Peyniri', 'Tereyağı', 'Krema', 'Labne', 'Ayran']
    },
    {
        name: 'Yumurta & Temel',
        emoji: '🥚',
        items: ['Yumurta', 'Un', 'Şeker', 'Tuz', 'Ekmek', 'Galeta Unu', 'Maya', 'Nişasta', 'Kabartma Tozu', 'Vanilya', 'Kakao']
    },
    {
        name: 'Yağ & Sos',
        emoji: '🫒',
        items: ['Zeytinyağı', 'Ayçiçek Yağı', 'Sıvı Yağ', 'Salça', 'Domates Salçası', 'Biber Salçası', 'Soya Sosu', 'Nar Ekşisi', 'Sirke', 'Ketçap', 'Mayonez', 'Hardal']
    },
    {
        name: 'Baharat',
        emoji: '🌶️',
        items: ['Karabiber', 'Kırmızı Biber', 'Pul Biber', 'Kimyon', 'Kekik', 'Nane', 'Maydanoz', 'Dereotu', 'Defne Yaprağı', 'Tarçın', 'Zencefil', 'Zerdeçal', 'Köri', 'Biberiye', 'Fesleğen']
    },
    {
        name: 'Kuruyemiş',
        emoji: '🥜',
        items: ['Ceviz', 'Fındık', 'Badem', 'Fıstık', 'Çam Fıstığı', 'Susam', 'Kaju', 'Çekirdek', 'Kuru Üzüm', 'Kuru Kayısı']
    },
    {
        name: 'İçecek & Diğer',
        emoji: '☕',
        items: ['Çay', 'Kahve', 'Bal', 'Pekmez', 'Reçel', 'Tahin', 'Zeytin', 'Turşu', 'Makarna Sosu', 'Çikolata', 'Puding']
    }
];

// Flat ingredient list for search
export const allIngredients = ingredientCategories.flatMap(cat => cat.items);
