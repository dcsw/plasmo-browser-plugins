import React, { useState, useEffect, useRef, useCallback } from 'react';

const InfiniteScroller = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  const intervalRef = useRef();

  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // Load more items if needed
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  const generateLoremIpsum = (length) => {
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    let result = '';
    while (result.length < length) {
      result += lorem;
    }
    return result.slice(0, length);
  };

  const addNewTextBlob = useCallback((newText) => {
    setItems((prevItems) => [...prevItems, newText]);
  }, []);

  useEffect(() => {
    // addNewTextBlob(generateLoremIpsum(1000)); // Add initial text blob...

    intervalRef.current = setInterval(() => {
      addNewTextBlob(generateLoremIpsum(1000));
    }, 100) as any; // 0.1 second

    // Stop after 2.5 seconds
    const timeout = setTimeout(() => {
      clearInterval(intervalRef.current);
    }, 2500);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeout);
    };
    // }, [addNewTextBlob]);
    // }, [items.length]);
  }, []); // empty deps array makes useEffect() only trigger 1x on initial render

  return (
    <div className="infinite-scroller">
      {items.map((item, index) => (
        <div
          key={index}
          ref={index === items.length - 1 ? lastItemRef : null}
          className="item"
        >
          <h3>Text Blob {index + 1}</h3>
          <p>{item}</p>
        </div>
      ))}
      {loading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default InfiniteScroller;
