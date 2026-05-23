# 🍳 NeYesem - Akıllı Yemek Tarifi ve Malzeme Eşleştirme Uygulaması

**NeYesem**, dolabınızdaki malzemelere göre tarif bulmanızı sağlayan, yapay zeka destekli kamera tarayıcısı, kişiselleştirilmiş tarif defteri ve sosyal etkileşim özellikleriyle donatılmış modern bir yemek tarifi platformudur. 

React 19, Vite, Tailwind CSS v4 ve Firebase kullanılarak geliştirilmiştir.

---

## ✨ Öne Çıkan Özellikler

*   **🔍 Akıllı Tarif Arama & Filtreleme (Dashboard):** Onlarca yemek tarifi arasından malzemeye, kategoriye veya hazırlama süresine göre arama ve filtreleme yapın.
*   **🥦 "Ne Var?" Dolap Eşleştirme:** Dolabınızda bulunan malzemeleri seçin; uygulama size sadece elinizdeki malzemelerle hazırlayabileceğiniz en uygun tarifleri listelesin.
*   **📷 Gemini AI Destekli Kamera ile Malzeme Tarama:** Dolabınızdaki malzemelerin fotoğrafını çekin! Google Gemini 2.5 Flash entegrasyonu sayesinde görseldeki malzemeler otomatik olarak analiz edilir ve malzeme listenize eklenir.
*   **🎲 Kararsızlar İçin "Zar At":** "Bugün ne yesem?" diye düşünmekten yorulduğunuzda zar atarak tamamen rastgele veya seçtiğiniz kriterlere uygun sürpriz bir tarif keşfedin.
*   **📖 Tarif Defterim (Kişisel Tarif Ekleme):** Kendi özel tariflerinizi oluşturun, fotoğraflarını yükleyin, malzemelerini belirleyin ve düzenleyin. Eklediğiniz tarifler Firebase Firestore ve Storage üzerinde güvenle saklanır.
*   **⭐ Yorum ve Değerlendirme Sistemi:** Tariflerin altına yorum yapın, yıldız puanı verin ve diğer kullanıcıların deneyimlerinden faydalanın.
*   **❤️ Favorilerim:** Beğendiğiniz tarifleri favori listenize ekleyerek daha sonra kolayca erişin.
*   **👤 Kullanıcı Profili:** Profil bilgilerinizi güncelleyin, kendi eklediğiniz tariflerin ve favorilerinizin istatistiklerini takip edin.

---

## 🛠️ Teknolojik Altyapı

*   **Frontend:** React 19, React Router Dom v7, Vite
*   **Tasarım & Stil:** Tailwind CSS v4, React Icons (modern ve dinamik bir arayüz)
*   **Backend & Veritabanı:**
    *   **Firebase Authentication:** Güvenli e-posta/şifre tabanlı üyelik ve giriş sistemi.
    *   **Firebase Firestore:** Tarifler, kullanıcı profilleri, favoriler ve yorumlar için gerçek zamanlı NoSQL veritabanı.
    *   **Firebase Storage:** Kullanıcıların kendi tariflerine yüklediği görsellerin güvenli depolanması.
*   **Yapay Zeka:** Google Gemini 2.5 Flash API (görsel analiz ve malzeme algılama)

---

## 🚀 Kurulum ve Başlangıç

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz.

### Gereksinimler

*   [Node.js](https://nodejs.org/) (v18 veya üzeri önerilir)
*   [Firebase Hesabı](https://firebase.google.com/)
*   [Gemini API Anahtarı](https://aistudio.google.com/) (Kamera ile tarama özelliğini kullanmak için)

### Adım 1: Projeyi Klonlayın

```bash
git clone https://github.com/iirmakertas/NeYesem.git
cd NeYesem
```

### Adım 2: Bağımlılıkları Yükleyin

```bash
npm install
```

### Adım 3: Çevre Değişkenlerini Ayarlayın

Projenin kök dizininde bir `.env` dosyası oluşturun ve Firebase bilgilerinizi ekleyin:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

*(Not: Firebase bağlantı bilgileri `src/firebase/config.js` dosyasında varsayılan olarak tanımlıdır, ancak `.env` kullanımı önerilir).*

### Adım 4: Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışmaya başlayacaktır.

---

## 📁 Proje Klasör Yapısı

```text
neyesem/
├── public/                 # Statik varlıklar (favicon vb.)
├── src/
│   ├── components/
│   │   ├── auth/          # Giriş ve kayıt bileşenleri
│   │   ├── layout/        # Navbar ve genel sayfa düzeni
│   │   ├── ui/            # Kamera tarayıcı, yorum alanı, tarif kartları vb.
│   │   └── utils/         # Hata yakalayıcı (ErrorBoundary) gibi araçlar
│   ├── context/           # Global durum yönetimi (AuthContext)
│   ├── data/              # Statik malzeme ve yemek verileri (ingredients, meals)
│   ├── firebase/          # Firebase yapılandırması (config.js)
│   ├── hooks/             # Özel React hook'ları (useComments, useFavorites, useMyRecipes)
│   ├── pages/             # Uygulama sayfaları (Dashboard, Favorites, NeVar, Profile, vb.)
│   ├── App.jsx            # Ana uygulama bileşeni ve rota tanımları
│   ├── index.css          # Küresel CSS ve tasarım sistemi (Tailwind CSS v4)
│   └── main.jsx           # Giriş noktası
├── firestore.rules        # Firebase Firestore güvenlik kuralları
├── package.json           # Bağımlılıklar ve scriptler
└── vite.config.js         # Vite yapılandırması
```

---

## 🔒 Güvenlik Kuralları (Firestore)

Kullanıcı verilerinin güvenliği için projenin kök dizininde yer alan `firestore.rules` dosyasındaki kurallar uygulanmaktadır. Bu kurallar sayesinde:
*   Herkes tarifleri okuyabilir.
*   Yalnızca giriş yapmış kullanıcılar kendi tariflerini ve yorumlarını oluşturabilir, düzenleyebilir veya silebilir.
