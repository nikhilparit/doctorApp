import React from 'react';

const MyBot = () => {
  const webside = `
    <html>
      <body>
        <script>
          window.$zoho = window.$zoho || {};
          $zoho.salesiq = $zoho.salesiq || { ready: function(){} };
        </script>
        <script 
          id="zsiqscript" 
          src="https://salesiq.zohopublic.com/widget?wc=siqedb8a9aa4f9e0c68e2bf876b235f13739d5c1cae6aebec661c75d207d8cdde5e" 
          defer>
        </script>
      </body>
    </html>
  `;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <iframe
        srcDoc={webside}
        style={{ width: '100%', height: '550px', border: 'none' }}
        title="External Content"
        allow="fullscreen"
      />
    </div>
  );
};

export default MyBot;
