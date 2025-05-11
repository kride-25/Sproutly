import React, { useState, useEffect, useRef } from 'react';

// Botanical minimal colors for light and dark modes
const COLORS = {
  light: {
    background: '#ffffff',
    textPrimary: '#2e4a1f',
    accent: '#4caf50',
    accentDark: '#3b662a',
    textSecondary: '#6b8e23',
    borderColor: '#dbe7d1',
    toggleBg: '#a5d6a7',
    toggleCircle: '#ffffff',
    factText: '#3b662a',
    inputBg: '#f7faf5',
    cardBg: '#fcfff8',
  },
  dark: {
    background: '#1a1a1a',
    textPrimary: '#a5d6a7',
    accent: '#7ccc4c',
    accentDark: '#5ea031',
    textSecondary: '#8dc63f',
    borderColor: '#445544',
    toggleBg: '#37472f',
    toggleCircle: '#cce3a2',
    factText: '#9fc97e',
    inputBg: '#26332c',
    cardBg: '#2e4233',
  },
};

// Plant facts array for loading screen
const PLANT_FACTS = [
  'Over 80% of the world\'s plant species are flowering plants.',
  'Some plants can live for thousands of years, like the Bristlecone Pine.',
  'Plants communicate through chemical signals in the air and soil.',
  'Leaves contain chlorophyll, essential for photosynthesis and plant food.',
  'The tallest tree ever recorded was a redwood over 379 feet tall!',
];

// Loading screen component
function LoadingScreen({ onFinish, darkMode }) {
  const [factIndex, setFactIndex] = useState(0);
  const [nameVisible, setNameVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [letterIndex, setLetterIndex] = useState(0);

  // Cycle plant facts every 4 seconds
  useEffect(() => {
    const factTimer = setInterval(() => {
      setFactIndex(i => (i + 1) % PLANT_FACTS.length);
    }, 4000);
    return () => clearInterval(factTimer);
  }, []);

  // Typewriter effect for the name "Sproutly"
  useEffect(() => {
    if (!nameVisible) return;
    if (letterIndex < 'Sproutly'.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + 'Sproutly'[letterIndex]);
        setLetterIndex(i => i + 1);
      }, 150);
      return () => clearTimeout(timeout);
    } else {
      const finishTimeout = setTimeout(() => {
        onFinish();
      }, 1500);
      return () => clearTimeout(finishTimeout);
    }
  }, [letterIndex, nameVisible, onFinish]);

  // Show name after 3 seconds of plant animation approximately
  useEffect(() => {
    const nameTimeout = setTimeout(() => {
      setNameVisible(true);
    }, 3000);
    return () => clearTimeout(nameTimeout);
  }, []);

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let rafId;
    let start = null;
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      setOffset(Math.sin(progress / 1000) * 15);
      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: darkMode ? COLORS.dark.background : COLORS.light.background,
        color: darkMode ? COLORS.dark.textPrimary : COLORS.light.textPrimary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Poppins', sans-serif",
        overflow: 'hidden',
        zIndex: 9999,
        userSelect: 'none',
      }}
      aria-label="Loading screen with plant growth animation"
    >
      <div
        style={{
          position: 'relative',
          width: 150,
          height: 220,
          marginBottom: 24,
          transform: `translateY(${offset}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <PlantGrowingSVG darkMode={darkMode} />
      </div>
      <h1
        aria-live="polite"
        style={{
          fontSize: 42,
          fontWeight: '700',
          letterSpacing: '0.1em',
          minHeight: 54,
          color: darkMode ? COLORS.dark.accent : COLORS.light.accent,
          fontFamily: "'Montserrat', sans-serif",
          borderRight: nameVisible ? `2px solid ${darkMode ? COLORS.dark.accent : COLORS.light.accent}` : 'none',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          width: 'fit-content',
          maxWidth: 300,
        }}
      >
        {typedText}
      </h1>
      <p
        aria-live="polite"
        style={{
          maxWidth: 320,
          textAlign: 'center',
          fontWeight: '500',
          fontSize: 14,
          color: darkMode ? COLORS.dark.factText : COLORS.light.factText,
          opacity: nameVisible ? 1 : 0,
          transition: 'opacity 0.7s ease-in-out',
          marginTop: 10,
          fontStyle: 'italic',
        }}
      >
        {PLANT_FACTS[factIndex]}
      </p>
      <p
        style={{
          position: 'absolute',
          bottom: 20,
          fontSize: 12,
          fontWeight: '500',
          color: darkMode ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
          userSelect: 'none',
        }}
      >
        Loading...
      </p>
    </div>
  );
}

// Plant SVG with growing stem and leaves animation
function PlantGrowingSVG({ darkMode }) {
  const strokeColor = darkMode ? COLORS.dark.accentDark : COLORS.light.accentDark;
  const leafFill = darkMode ? COLORS.dark.accent : COLORS.light.accent;

  return (
    <svg
      width="150"
      height="220"
      viewBox="0 0 150 220"
      aria-hidden="true"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id="leafShadow" x="-20%" y="-20%" width="150%" height="150%" >
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor={leafFill} floodOpacity="0.4" />
        </filter>
        <style>
          {`
            @keyframes stemGrow {
              0% {
                stroke-dashoffset: 400;
                opacity: 0;
              }
              100% {
                stroke-dashoffset: 0;
                opacity: 1;
              }
            }
            @keyframes leafFadeIn {
              0% { opacity: 0; transform: scale(0.5); }
              100% { opacity: 1; transform: scale(1); }
            }
            .stem {
              stroke-dasharray: 400;
              stroke-dashoffset: 400;
              animation: stemGrow 3s forwards ease-out;
            }
            .leaf {
              transform-origin: center;
              opacity: 0;
              animation: leafFadeIn 1.5s forwards ease-out;
              animation-delay: 3s;
            }
          `}
        </style>
      </defs>
      {/* Stem */}
      <path
        className="stem"
        d="M75 210 L75 50"
        style={{
          fill: 'none',
          stroke: strokeColor,
          strokeWidth: 8,
          strokeLinecap: 'round',
        }}
      />
      {/* Left leaf */}
      <ellipse
        className="leaf"
        cx="53"
        cy="110"
        rx="20"
        ry="35"
        fill={leafFill}
        filter="url(#leafShadow)"
        style={{ transformOrigin: '53px 110px', animationDelay: '3s' }}
      />
      {/* Right leaf */}
      <ellipse
        className="leaf"
        cx="97"
        cy="130"
        rx="22"
        ry="37"
        fill={leafFill}
        filter="url(#leafShadow)"
        style={{ transformOrigin: '97px 130px', animationDelay: '3.5s' }}
      />
      {/* Top leaf */}
      <ellipse
        className="leaf"
        cx="75"
        cy="75"
        rx="18"
        ry="28"
        fill={leafFill}
        filter="url(#leafShadow)"
        style={{ transformOrigin: '75px 75px', animationDelay: '4s' }}
      />
    </svg>
  );
}

// Chatbot component
const Chatbot = ({ colors }) => {
  // Use passed-in colors for theme consistency
  const botanicalColors = colors;

  const [messages, setMessages] = useState([
    { id: 0, sender: 'bot', text: "Hi! How can I help your garden grow today?" },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const getBotReply = userText => {
    const text = userText.toLowerCase();
    if (text.includes('soil')) {
      return "Soil type affects which plants will thrive. I recommend loamy soil for most gardens.";
    }
    if (text.includes('water')) {
      return "Watering deeply but less often encourages roots to grow stronger.";
    }
    if (text.includes('disease') || text.includes('sick')) {
      return "Look for yellowing leaves or spots. I can help identify common plant diseases.";
    }
    if (text.includes('plant')) {
      return "I can help identify plants or suggest care tips. What plant are you interested in?";
    }
    const defaultBotReplies = [
      "I'm here to help your garden grow! Ask me anything.",
      "Did you know tomatoes were once considered poisonous?",
      "Remember to water plants early in the morning or late evening.",
      "Companion planting can protect your garden naturally!",
      "Leaf color changes might indicate nutrient deficiencies.",
    ];
    return defaultBotReplies[Math.floor(Math.random() * defaultBotReplies.length)];
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setTimeout(() => {
      const botReply = getBotReply(input);
      const botMessage = { id: Date.now() + 1, sender: 'bot', text: botReply };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const onKeyDown = e => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div
      style={{
        backgroundColor: botanicalColors.inputBg, // Changed from bgLight to inputBg for consistency if needed, or use cardBg
        borderRadius: 12,
        padding: 16,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        color: botanicalColors.textPrimary
      }}
      aria-label="Garden chatbot interface"
    >
      <div
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          marginBottom: 12,
          paddingRight: 8,
          scrollBehavior: 'smooth',
          display: 'flex', // Added for alignSelf to work on children
          flexDirection: 'column', // Added for alignSelf to work on children
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              maxWidth: '80%',
              marginBottom: 10,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor:
                msg.sender === 'user'
                  ? (botanicalColors.toggleBg || '#a5d6a7') // Using toggleBg as an example for user bubble
                  : botanicalColors.accent,
              color:
                msg.sender === 'user'
                  ? botanicalColors.textPrimary
                  : botanicalColors.bubbleBotText,
              padding: '10px 16px',
              borderRadius:
                msg.sender === 'user'
                  ? '20px 20px 5px 20px'
                  : '20px 20px 20px 5px',
              fontSize: '0.95rem',
              whiteSpace: 'pre-line',
              boxShadow:
                msg.sender === 'bot' ? '0 2px 5px rgba(0,0,0,0.15)' : 'none',
            }}
            aria-live="polite"
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask your garden assistant..."
          aria-label="Type your message"
          style={{
            flexGrow: 1,
            borderRadius: 20,
            padding: '10px 16px',
            border: `1px solid ${botanicalColors.borderColor}`,
            outline: 'none',
            fontSize: '1rem',
            marginRight: 8,
            backgroundColor: botanicalColors.inputBg, // Ensure this is distinct from chat area background
            color: botanicalColors.textPrimary,
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          }}
        />
        <button
          onClick={sendMessage}
          aria-label="Send message"
          style={{
            backgroundColor: botanicalColors.accent,
            border: 'none',
            borderRadius: 20,
            padding: '10px 14px',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '1rem',
            minWidth: 60,
            transition: 'background-color 0.3s ease, transform 0.2s ease',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

// Main Sproutly app component
const NAV_ITEMS = [
  'Home',
  'Chatbot',
  'Community',
  'Marketplace',
  'AR Features',
  'My Account',
];

const SproutlyBotanicalMinimalApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const colors = darkMode ? COLORS.dark : COLORS.light;

  const [loadingComplete, setLoadingComplete] = useState(false);

  const [soilImage, setSoilImage] = useState(null);
  const [plantImage, setPlantImage] = useState(null);

  const handleSoilImageChange = e => {
    const file = e.target.files[0];
    if (file) setSoilImage(URL.createObjectURL(file));
    else setSoilImage(null);
  };

  const handlePlantImageChange = e => {
    const file = e.target.files[0];
    if (file) setPlantImage(URL.createObjectURL(file));
    else setPlantImage(null);
  };

  const communityPosts = [
    { id: 1, user: 'Rosa', text: 'Just harvested my first tomatoes! 🍅' },
    { id: 2, user: 'GreenThumb42', text: 'Any tips on watering succulents?' },
    { id: 3, user: 'PlantLover', text: 'Trying companion planting this season.' },
  ];

  const sampleProducts = [
    {
      id: 1,
      name: 'Organic Tomato Seeds',
      price: '$5.99',
      image:
        'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=60&h=60&q=80',
    },
    {
      id: 2,
      name: 'Eco-friendly Fertilizer',
      price: '$12.99',
      image:
        'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=60&h=60&q=80',
    },
    {
      id: 3,
      name: 'Gardening Gloves',
      price: '$8.49',
      image:
        'https://images.unsplash.com/photo-1533055640609-24b498cdfa20?auto=format&fit=crop&w=60&h=60&q=80',
    },
  ];

  const [userProducts, setUserProducts] = useState([]);

  const [sellName, setSellName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellImageFile, setSellImageFile] = useState(null);
  const [sellImageURL, setSellImageURL] = useState(null);
  const [marketplaceTab, setMarketplaceTab] = useState('Buy');

  const handleSellImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setSellImageFile(file);
      setSellImageURL(URL.createObjectURL(file));
    } else {
      setSellImageFile(null);
      setSellImageURL(null);
    }
  };
  const handleSellSubmit = e => {
    e.preventDefault();
    if (!sellName.trim() || !sellPrice.trim() || !sellImageFile) {
      alert('Please fill all product details and upload an image.');
      return;
    }
    const newProduct = {
      id: Date.now(),
      name: sellName.trim(),
      price: sellPrice.trim(),
      image: sellImageURL,
    };
    setUserProducts([...userProducts, newProduct]);
    setSellName('');
    setSellPrice('');
    setSellImageFile(null);
    setSellImageURL(null);
    alert('Product added to sell list!');
  };

  const [userName, setUserName] = useState('John Doe');
  const [userEmail, setUserEmail] = useState('john.doe@gmail.com');
  const [history] = useState([
    'Bought Organic Tomato Seeds',
    'Sold Fresh Carrots',
    'Logged in from Mobile Device',
  ]);
  const handleLogout = () => alert('Logged out!');

  const ARFeature = () => (
    <div
      style={{
        backgroundColor: colors.cardBg,
        borderRadius: 12,
        padding: 24,
        color: colors.textPrimary,
        fontWeight: 500,
        fontSize: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        height: '100%',
        overflowY: 'auto',
      }}
      aria-label="AR Features tab"
    >
      <h2 style={{ color: colors.accent, marginBottom: 20 }}>AR Features</h2>
      <p>
        The Augmented Reality (AR) feature allows you to visualize plants and gardening setups in your real environment using your device camera. Simply press the <strong>View</strong> button below to launch the AR experience.
      </p>
      <p style={{ marginTop: 20, fontStyle: 'italic', color: colors.textSecondary }}>
        Note: This is a demo placeholder. Real AR requires device support and permissions.
      </p>
      <button
        type="button"
        onClick={() => alert('Launching AR view (demo placeholder)...')}
        style={{
          marginTop: 40,
          backgroundColor: colors.accent,
          border: 'none',
          borderRadius: 12,
          padding: '14px 30px',
          color: 'white',
          fontWeight: '700',
          fontSize: 18,
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'background-color 0.3s ease',
        }}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = colors.accentDark)}
        onMouseOut={e => (e.currentTarget.style.backgroundColor = colors.accent)}
        aria-label="View AR"
      >
        View
      </button>
    </div>
  );

  const Home = () => (
    <>
      <h2
        style={{
          color: colors.accent,
          fontWeight: 700,
          fontSize: 22,
          marginBottom: 6,
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        Your AI Gardening Assistant
      </h2>
      <p
        style={{
          marginBottom: 24,
          color: colors.textSecondary,
          fontWeight: 500,
          fontSize: 14,
          maxWidth: 320,
        }}
      >
        Upload images below to detect soil type and identify plant diseases.
      </p>
      <div
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          textAlign: 'center',
        }}
        aria-label="Soil Image Upload Section"
      >
        <h3
          style={{
            color: colors.accentDark,
            fontWeight: 600,
            fontSize: 18,
            marginBottom: 16,
          }}
        >
          Soil Image for Soil Type Detection
        </h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleSoilImageChange}
          aria-label="Upload soil image"
          style={{
            borderRadius: 10,
            backgroundColor: colors.inputBg,
            padding: 10,
            color: colors.textPrimary,
            fontWeight: '500',
            fontSize: 14,
            cursor: 'pointer',
          }}
        />
        {soilImage && (
          <img
            src={soilImage}
            alt="Uploaded Soil Preview"
            style={{
              marginTop: 16,
              maxWidth: '100%',
              maxHeight: 180,
              borderRadius: 12,
              boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
              objectFit: 'cover',
            }}
          />
        )}
      </div>
      <div
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          textAlign: 'center',
        }}
        aria-label="Plant Image Upload Section"
      >
        <h3
          style={{
            color: colors.accentDark,
            fontWeight: 600,
            fontSize: 18,
            marginBottom: 16,
          }}
        >
          Plant Image for Disease Identification
        </h3>
        <input
          type="file"
          accept="image/*"
          onChange={handlePlantImageChange}
          aria-label="Upload plant image"
          style={{
            borderRadius: 10,
            backgroundColor: colors.inputBg,
            padding: 10,
            color: colors.textPrimary,
            fontWeight: '500',
            fontSize: 14,
            cursor: 'pointer',
          }}
        />
        {plantImage && (
          <img
            src={plantImage}
            alt="Uploaded Plant Preview"
            style={{
              marginTop: 16,
              maxWidth: '100%',
              maxHeight: 180,
              borderRadius: 12,
              boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
              objectFit: 'cover',
            }}
          />
        )}
      </div>
    </>
  );

  const Community = () => (
    <>
      <h2
        style={{
          color: colors.accent,
          fontWeight: 700,
          fontSize: 22,
          marginBottom: 18,
        }}
      >
        Community Feed
      </h2>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          maxHeight: 440,
          overflowY: 'auto',
        }}
      >
        {communityPosts.map(post => (
          <li
            key={post.id}
            style={{
              backgroundColor: colors.cardBg,
              marginBottom: 14,
              padding: 18,
              borderRadius: 12,
              color: colors.textPrimary,
              boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
              fontSize: 15,
              fontWeight: 500,
              userSelect: 'text',
            }}
          >
            <strong style={{ color: colors.accentDark }}>{post.user}</strong>: {post.text}
          </li>
        ))}
      </ul>
    </>
  );

  const Marketplace = () => (
    <>
      <h2
        style={{
          color: colors.accent,
          fontWeight: 700,
          fontSize: 22,
          marginBottom: 18,
        }}
      >
        Marketplace
      </h2>
      <div role="tablist" aria-label="Marketplace Buy or Sell Tabs" style={{ display: 'flex', marginBottom: 18 }}>
        <div
          role="tab"
          tabIndex={0}
          aria-selected={marketplaceTab === 'Buy'}
          onClick={() => setMarketplaceTab('Buy')}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setMarketplaceTab('Buy'); }}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '10px 0',
            fontWeight: '700',
            color: marketplaceTab === 'Buy' ? colors.accentDark : colors.textSecondary,
            borderBottom: `3px solid ${marketplaceTab === 'Buy' ? colors.accent : 'transparent'}`,
            userSelect: 'none',
            cursor: 'pointer',
          }}
        >
          Buy
        </div>
        <div
          role="tab"
          tabIndex={0}
          aria-selected={marketplaceTab === 'Sell'}
          onClick={() => setMarketplaceTab('Sell')}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setMarketplaceTab('Sell'); }}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '10px 0',
            fontWeight: '700',
            color: marketplaceTab === 'Sell' ? colors.accentDark : colors.textSecondary,
            borderBottom: `3px solid ${marketplaceTab === 'Sell' ? colors.accent : 'transparent'}`,
            userSelect: 'none',
            cursor: 'pointer',
          }}
        >
          Sell
        </div>
      </div>
      {marketplaceTab === 'Buy' && (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            maxHeight: 400,
            overflowY: 'auto',
          }}
        >
          {sampleProducts.map(product => (
            <li
              key={product.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 14,
                backgroundColor: colors.cardBg,
                padding: 16,
                borderRadius: 12,
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: 60, height: 60, borderRadius: 12, marginRight: 18, objectFit: 'cover' }}
              />
              <div style={{ flexGrow: 1 }}>
                <div style={{ fontWeight: '700', fontSize: 16, color: colors.accentDark }}>{product.name}</div>
                <div style={{ fontWeight: 600, color: colors.accent }}>{product.price}</div>
              </div>
              <button
                type="button"
                onClick={() => alert('Purchase functionality coming soon!')}
                style={{
                  backgroundColor: colors.accent,
                  border: 'none',
                  borderRadius: 12,
                  padding: '10px 20px',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: 14,
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = colors.accentDark)}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = colors.accent)}
                aria-label={`Buy ${product.name}`}
              >
                Buy
              </button>
            </li>
          ))}
        </ul>
      )}
      {marketplaceTab === 'Sell' && (
        <form
          onSubmit={handleSellSubmit}
          aria-label="Sell product form"
          style={{
            backgroundColor: colors.cardBg,
            padding: 24,
            borderRadius: 12,
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            maxHeight: 440,
            overflowY: 'auto',
          }}
        >
          <label
            htmlFor="sell-name"
            style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: colors.accentDark }}
          >
            Product Name
          </label>
          <input
            id="sell-name"
            type="text"
            value={sellName}
            onChange={e => setSellName(e.target.value)}
            placeholder="E.g. Fresh Carrots"
            style={{
              width: '100%',
              padding: 10,
              fontSize: 16,
              color: colors.textPrimary,
              fontWeight: 500,
              backgroundColor: colors.inputBg,
              borderRadius: 10,
              border: `1px solid ${colors.borderColor}`,
              marginBottom: 16,
              outline: 'none',
            }}
            required
          />
          <label
            htmlFor="sell-price"
            style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: colors.accentDark }}
          >
            Price (e.g. $9.99)
          </label>
          <input
            id="sell-price"
            type="text"
            value={sellPrice}
            onChange={e => setSellPrice(e.target.value)}
            placeholder="$9.99"
            style={{
              width: '100%',
              padding: 10,
              fontSize: 16,
              color: colors.textPrimary,
              fontWeight: 500,
              backgroundColor: colors.inputBg,
              borderRadius: 10,
              border: `1px solid ${colors.borderColor}`,
              marginBottom: 16,
              outline: 'none',
            }}
            required
          />
          <label
            htmlFor="sell-image"
            style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: colors.accentDark }}
          >
            Product Image
          </label>
          <input
            id="sell-image"
            type="file"
            accept="image/*"
            onChange={handleSellImageChange}
            style={{
              width: '100%',
              padding: 10,
              fontSize: 16,
              color: colors.textPrimary,
              fontWeight: 500,
              backgroundColor: colors.inputBg,
              borderRadius: 10,
              border: `1px solid ${colors.borderColor}`,
              marginBottom: 16,
              cursor: 'pointer',
            }}
            aria-required="true"
          />
          {sellImageURL && (
            <img
              src={sellImageURL}
              alt="Product Preview"
              style={{
                width: '100%',
                maxHeight: 180,
                marginBottom: 16,
                objectFit: 'cover',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            />
          )}
          <button
            type="submit"
            style={{
              backgroundColor: colors.accent,
              border: 'none',
              borderRadius: 12,
              padding: '14px 25px',
              color: 'white',
              fontWeight: '700',
              fontSize: 18,
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = colors.accentDark)}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = colors.accent)}
          >
            Add Product
          </button>
          {userProducts.length > 0 && (
            <>
              <h3 style={{ marginTop: 36, color: colors.accent, fontWeight: 700 }}>
                Your Listed Products
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginTop: 16 }}>
                {userProducts.map(p => (
                  <li
                    key={p.id}
                    style={{
                      backgroundColor: colors.cardBg,
                      padding: 16,
                      borderRadius: 12,
                      marginBottom: 16,
                      boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: 60, height: 60, borderRadius: 12, marginRight: 18, objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: colors.accentDark }}>{p.name}</div>
                      <div style={{ fontWeight: 600, color: colors.accent }}>{p.price}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </form>
      )}
    </>
  );

  const Account = () => (
    <div
      style={{
        backgroundColor: colors.cardBg,
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        height: '100%',
        overflowY: 'auto',
        color: colors.textPrimary,
      }}
      aria-label="My Account"
    >
      <h2 style={{ color: colors.accent, marginBottom: 24, fontWeight: 700, fontSize: 22 }}>
        My Account
      </h2>
      <label htmlFor="account-name" style={{ marginBottom: 8, fontWeight: 600, display: 'block', color: colors.accentDark }}>
        Name
      </label>
      <input
        id="account-name"
        value={userName}
        onChange={e => setUserName(e.target.value)}
        style={{
          width: '100%',
          padding: 12,
          fontSize: 16,
          fontWeight: 500,
          backgroundColor: colors.inputBg,
          borderRadius: 10,
          border: `1px solid ${colors.borderColor}`,
          marginBottom: 24,
          outline: 'none',
          color: colors.textPrimary,
        }}
      />
      <label htmlFor="account-email" style={{ marginBottom: 8, fontWeight: 600, display: 'block', color: colors.accentDark }}>
        Email (Gmail)
      </label>
      <input
        id="account-email"
        type="email"
        value={userEmail}
        onChange={e => setUserEmail(e.target.value)}
        style={{
          width: '100%',
          padding: 12,
          fontSize: 16,
          fontWeight: 500,
          backgroundColor: colors.inputBg,
          borderRadius: 10,
          border: `1px solid ${colors.borderColor}`,
          marginBottom: 24,
          outline: 'none',
          color: colors.textPrimary,
        }}
      />
      <button
        type="button"
        onClick={handleLogout}
        style={{
          backgroundColor: colors.accent,
          borderRadius: 12,
          border: 'none',
          color: 'white',
          width: '100%',
          padding: 14,
          fontWeight: '700',
          fontSize: 18,
          cursor: 'pointer',
          userSelect: 'none',
          marginBottom: 24,
          transition: 'background-color 0.3s ease',
        }}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = colors.accentDark)}
        onMouseOut={e => (e.currentTarget.style.backgroundColor = colors.accent)}
        aria-label="Logout"
      >
        Logout
      </button>
      <h3 style={{ color: colors.accent, fontWeight: 700, marginBottom: 12 }}>History</h3>
      <ul style={{ color: colors.textSecondary, fontWeight: 500, fontSize: 14, listStyle: 'disc inside' }}>
        {history.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 4 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  const DarkModeToggle = () => (
    <label
      htmlFor="dark-mode-toggle"
      style={{
        position: 'absolute',
        right: 20,
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      aria-label="Toggle dark mode"
    >
      <input
        id="dark-mode-toggle"
        type="checkbox"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
        style={{ display: 'none' }}
      />
      <span
        style={{
          display: 'inline-block',
          width: 46,
          height: 24,
          backgroundColor: darkMode ? colors.toggleBg : '#ccc',
          borderRadius: 26,
          position: 'relative',
          transition: 'background-color 0.3s ease',
        }}
      >
        <span
          style={{
            position: 'absolute',
            height: 20,
            width: 20,
            borderRadius: '50%',
            backgroundColor: colors.toggleCircle,
            top: 2,
            left: darkMode ? 24 : 2,
            transition: 'left 0.3s ease',
            boxShadow: darkMode
              ? '0 2px 6px rgba(124, 180, 57, 0.8)'
              : '0 2px 6px rgba(200, 200, 200, 0.8)',
          }}
        />
      </span>
    </label>
  );

  const NAV_ICONS = {
    Home: (
      <svg
        style={{ width: 24, height: 24, marginBottom: 2 }}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path fill={activeTab === 'Home' ? colors.accent : colors.textSecondary} d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
    Chatbot: (
      <svg
        style={{ width: 24, height: 24, marginBottom: 2 }}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path fill={activeTab === 'Chatbot' ? colors.accent : colors.textSecondary} d="M4 4h16v12H5.17L4 17.17V4zM6 14v2h8v-2H6zM13 7v4h-2V7h2z" />
      </svg>
    ),
    Community: (
      <svg
        style={{ width: 24, height: 24, marginBottom: 2 }}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path fill={activeTab === 'Community' ? colors.accent : colors.textSecondary} d="M12 12c2.7 0 5.5 1.3 6 3.8v2.2H6v-2.2c.5-2.5 3.3-3.8 6-3.8zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      </svg>
    ),
    Marketplace: (
      <svg
        style={{ width: 24, height: 24, marginBottom: 2 }}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path fill={activeTab === 'Marketplace' ? colors.accent : colors.textSecondary} d="M3 6v12h18V6H3zm16 10H5v-8h14v8zm-7-6a3 3 0 100 6 3 3 0 000-6z" />
      </svg>
    ),
    'AR Features': (
      <svg
        style={{ width: 24, height: 24, marginBottom: 2 }}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path fill={activeTab === 'AR Features' ? colors.accent : colors.textSecondary} d="M4 4h16v16H4z" />
        <path stroke={activeTab === 'AR Features' ? colors.accent : colors.textSecondary} strokeWidth="2" strokeLinecap="round" d="M8 8l8 8M8 16l8-8" />
      </svg>
    ),
    'My Account': (
      <svg
        style={{ width: 24, height: 24, marginBottom: 2 }}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path fill={activeTab === 'My Account' ? colors.accent : colors.textSecondary} d="M12 12c2.7 0 5.5 1.3 6 3.8v2.2H6v-2.2c.5-2.5 3.3-3.8 6-3.8zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      </svg>
    ),
  };

  if (!loadingComplete) {
    return <LoadingScreen onFinish={() => setLoadingComplete(true)} darkMode={darkMode} />;
  }

  return (
    <div
      style={{
        maxWidth: 350,
        height: 600,
        margin: '0 auto',
        border: `1px solid ${colors.borderColor}`,
        borderRadius: 14,
        backgroundColor: colors.background,
        boxShadow: darkMode
          ? '0 0 30px rgba(0,0,0,0.7)'
          : '0 0 20px rgba(100, 140, 50, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Poppins', sans-serif",
        color: colors.textPrimary,
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          padding: '14px 20px',
          backgroundColor: darkMode ? COLORS.dark.accentDark : COLORS.light.accent,
          color: 'white',
          fontWeight: '700',
          fontSize: 26,
          position: 'relative',
          fontFamily: "'Montserrat', sans-serif",
          letterSpacing: '0.12em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
        }}
      >
        Sproutly
        <DarkModeToggle />
      </header>
      <main
        style={{
          flexGrow: 1,
          padding: 20,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          height: 'calc(600px - 68px - 60px)',
          backgroundColor: colors.background,
        }}
      >
        {activeTab === 'Home' && <Home />}
        {activeTab === 'Chatbot' && <Chatbot colors={colors} />}
        {activeTab === 'Community' && <Community />}
        {activeTab === 'Marketplace' && <Marketplace />}
        {activeTab === 'AR Features' && <ARFeature />}
        {activeTab === 'My Account' && <Account />}
      </main>
      <nav
        role="navigation"
        aria-label="Primary Navigation"
        style={{
          backgroundColor: colors.cardBg,
          display: 'flex',
          borderTop: `1px solid ${colors.borderColor}`,
          padding: '8px 0',
          boxShadow: '0 -3px 8px rgba(0,0,0,0.1)',
          userSelect: 'none',
          borderBottomLeftRadius: 14,
          borderBottomRightRadius: 14,
        }}
      >
        {NAV_ITEMS.map(item => {
          const isActive = activeTab === item;
          return (
            <button
              key={item}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item}
              onClick={() => setActiveTab(item)}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                cursor: isActive ? 'default' : 'pointer',
                color: isActive ? colors.accent : colors.textSecondary,
                fontWeight: isActive ? '700' : '500',
                padding: '8px 0 4px',
                fontSize: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'color 0.3s ease',
                // Add transform for subtle hover effect on non-active items
                transform: isActive ? 'none' : 'scale(1)',
                transition: 'color 0.3s ease, transform 0.2s ease',
              }}
              onMouseOver={e => { if (!isActive) e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';}}
              onMouseOut={e => { if (!isActive) e.currentTarget.style.transform = 'scale(1) translateY(0)';}}
            >
              {NAV_ICONS[item]}
              {item}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SproutlyBotanicalMinimalApp;
