import React from 'react';

const Mentorship: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ask PMory Chatbot</h1>
      <iframe
        src="https://moonlit-lolly-9ab72d.netlify.app/"
        width="100%"
        height="600px"
        style={{ border: 'none', borderRadius: '12px' }}
        title="PMory Chatbot"
      />
    </div>
  );
};

export default Mentorship;
