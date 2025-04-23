import React, { useState } from 'react';
import './CardForm.css';

const ALL_ROLES = [
  'Mitosian',
  'Settler',
  'Guru',
  'Gakusei',
  'Daigakusei',
  'Sensei',
  'Emeritus Sensei',
  'Mitosis OG',
  'MORSE Genesis',
  'Intern Artist',
  'miArtist',
  'Intern Tuber',
  'miTuber',
  'Intern Analyst',
  'miAnalyst',
  'Intern Evangelist',
  'miEvangelist',
  'Intern Consultant',
  'miConsultant',
  'Mitosis Marketing Manager',
  'Co-Founder at Mitosis',
  'Co-Founder & CPO at Mitosis',
  'Bad Dev Mitosis',
  'Strategy Mitosis',
  'Mitosis Designer',
  'Mitosis Head of Community',
  'Mitosis Product',
  'Mitosis Community Lead',
  'Product Designer at Mitosis'
];

const CardForm = ({ onFormSubmit }) => {
  const [username, setUsername] = useState('');
  const [roles, setRoles] = useState([]);
  const [cardColor, setCardColor] = useState('purple');
  const [customColor, setCustomColor] = useState('#666BFC');
  const [cardTemplate, setCardTemplate] = useState('blue-waves');
  const [logo, setLogo] = useState('purple');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [twitterHandle, setTwitterHandle] = useState('');
  const [name, setName] = useState('');

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !roles.length || !name || !profilePicture) {
      alert('Please fill in all required fields and upload a profile picture');
      return;
    }
    
    onFormSubmit({
      name,
      username,
      roles,
      cardColor: cardColor === 'custom' ? customColor : cardColor,
      profilePicture: previewUrl,
      twitterHandle: twitterHandle || username.toLowerCase().replace(/\s+/g, ''),
      cardTemplate,
      logo
    });
  };

  return (
    <div className="card-form-container">
      <h2>Create Your Mitosis Card</h2>
      <form onSubmit={handleSubmit} className="card-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Discord Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your Discord username"
            required
          />
        </div>

        <div className="form-group">
          <label>Roles (select up to 2):</label>
          <select
            multiple
            value={roles}
            onChange={e => {
              const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
              if (selected.length <= 2) setRoles(selected);
            }}
            style={{ minHeight: 70 }}
          >
            {ALL_ROLES.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Card Templates:</label>
          <div className="template-options" style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {[
              { value: 'blue-waves', label: 'Blue Waves' },
              { value: 'clean-lines', label: 'Clean Lines' },
              { value: 'radiate-top-left', label: 'Radiate Top-Left' },
              { value: 'diagonal-waves', label: 'Diagonal Waves' },
              { value: 'flowing-mesh', label: 'Flowing Mesh' },
              { value: 'concentric-lines', label: 'Concentric Lines' },
              { value: 'circular-echoes', label: 'Circular Echoes' },
              { value: 'overlapping-circles', label: 'Overlapping Circles' }
            ].map(template => (
              <label key={template.value} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 10px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="cardTemplate"
                  value={template.value}
                  checked={cardTemplate === template.value}
                  onChange={() => setCardTemplate(template.value)}
                  style={{ marginBottom: 6 }}
                />
                <span style={{ fontSize: 13, marginTop: 2 }}>{template.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Card Color:</label>
          <div className="color-options" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 400 }}>
              <input type="radio" name="cardColor" value="purple" checked={cardColor === 'purple'} onChange={() => setCardColor('purple')} />
              Purple
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 400 }}>
              <input type="radio" name="cardColor" value="white" checked={cardColor === 'white'} onChange={() => setCardColor('white')} />
              White
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 400 }}>
              <input type="radio" name="cardColor" value="custom" checked={cardColor === 'custom'} onChange={() => setCardColor('custom')} />
              <input type="color" value={customColor} onChange={e => setCustomColor(e.target.value)} style={{ width: 28, height: 28, border: 'none', background: 'none', padding: 0 }} disabled={cardColor !== 'custom'} />
              <input type="text" value={customColor} onChange={e => setCustomColor(e.target.value)} placeholder="#E1FFFF" style={{ width: 80, padding: '2px 6px', borderRadius: 4, border: '1px solid #ccc', fontFamily: 'inherit', fontSize: 15 }} disabled={cardColor !== 'custom'} maxLength={7} />
              Custom
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Mitosis Logo:</label>
          <div className="logo-options">
            <label>
              <input
                type="radio"
                name="logo"
                value="purple"
                checked={logo === 'purple'}
                onChange={() => setLogo('purple')}
              />
              Purple
            </label>
            <label>
              <input
                type="radio"
                name="logo"
                value="mint"
                checked={logo === 'mint'}
                onChange={() => setLogo('mint')}
              />
              Mint
            </label>
            <label>
              <input
                type="radio"
                name="logo"
                value="white"
                checked={logo === 'white'}
                onChange={() => setLogo('white')}
              />
              White
            </label>
            <label>
              <input
                type="radio"
                name="logo"
                value="black"
                checked={logo === 'black'}
                onChange={() => setLogo('black')}
              />
              Black
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="twitterHandle">Twitter/X Handle (optional):</label>
          <div className="twitter-input">
            <span className="twitter-prefix">@</span>
            <input
              type="text"
              id="twitterHandle"
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              placeholder="your_handle"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="profilePicture">Profile Picture:</label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            onChange={handleProfilePictureChange}
            required
          />
          {previewUrl && (
            <div className="profile-preview">
              <img src={previewUrl} alt="Profile preview" />
            </div>
          )}
        </div>

        <button type="submit" className="submit-button">Generate Card</button>
      </form>
    </div>
  );
};

export default CardForm;
