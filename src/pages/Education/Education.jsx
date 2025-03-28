import React from 'react';

const Education = () => {
  // Array of YouTube video IDs (you can replace them with any valid IDs)
  const videoLinks = [
    'vjXwhoCCaYA', // Random video 1
    // '9bZkp7q19f0'  // Random video 2
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>📚 Learn with Videos</h2>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {videoLinks.map((id, index) => (
          <div key={index} style={{ flex: '1 1 45%', minWidth: '300px' }}>
            <iframe
              width="100%"
              height="550"
              src={`https://www.youtube.com/embed/${id}`}
              title={`YouTube Video ${index + 1}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>

      {/* Content Description Below the Video */}
      <div style={{ marginTop: '20px' }}>
        <h3>📈 Introduction to Stock Market Investing</h3>
        <p>
          In this video, we’ll be introducing the basics of stock market investing. Whether you're a beginner or someone looking to refine your knowledge, this video will cover all the foundational concepts you need to understand before diving into the world of investing.
        </p>
        <ul>
          <li><strong>What is the Stock Market?</strong> - Learn how the stock market functions, the role of exchanges like NSE/BSE, and the difference between stocks and bonds.</li>
          <li><strong>How Stocks Are Bought and Sold:</strong> Understand the process of buying and selling stocks through brokers and the role of market orders, limit orders, and stop-loss orders.</li>
          <li><strong>Stock Market Terminology:</strong> Familiarize yourself with key terms like dividends, market capitalization, bear markets, bull markets, etc.</li>
          <li><strong>How to Start Investing:</strong> A brief introduction to investment strategies, including long-term investing and day trading.</li>
          <li><strong>The Importance of Diversification:</strong> Why spreading your investments across different sectors and asset classes reduces risk.</li>
        </ul>
        <p>By the end of this video, you'll have a solid understanding of stock market investing and be ready to explore deeper topics like technical analysis, fundamental analysis, and building a diversified portfolio.</p>
      </div>
    </div>
  );
};

export default Education;
