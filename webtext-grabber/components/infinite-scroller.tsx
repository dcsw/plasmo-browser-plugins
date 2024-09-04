import React, { useState, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';

export const InfiniteScroller = forwardRef((props, ref) => {
  const [items, setItems] = useState([]);
  const [loading] = useState(false);
  const observer = useRef(null);

  // Expose functions to parent
  useImperativeHandle(ref, () => ({
    addNewTextBlob: (itemTitle, newHtml) => {
      setItems((prevItems) => [...prevItems, { title: itemTitle, html: newHtml }]);
    }
  }));

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

  return (
    <div className="infinite-scroller">
      {items.map((item, index) => (
        <div
          key={index}
          // ref={index === items.length - 1 ? lastItemRef : null}
          className="item"
        >
          <h3>{item.title + ' #' + (index + 1)}</h3>
          <div dangerouslySetInnerHTML={{ __html: item.html}}/>
        </div>
      ))}
      {loading && <div className="loading">Loading...</div>}
    </div>
  );
});
