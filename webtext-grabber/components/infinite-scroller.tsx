import React, { useState, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';

export const InfiniteScroller = forwardRef((props, ref) => {
  const [items, setItems] = useState([])
  const [loading] = useState(false)
  const observer = useRef(null)

  // Expose functions to parent
  useImperativeHandle(ref, () => ({
    addNewTextBlob: (item) => {
      setItems((prevItems) => [...prevItems, item])
    },
    items: items
  }))

  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // Load more items if needed
        }
      });
      if (node) observer.current.observe(node)
    },
    [loading]
  )

  return (
    <div className="infinite-scroller">
      {items.map((item, index) => {

        const innerHTML = `
          <details>
            <summary>${item.title}</summary>
            <a href=${item.url} target="_blank">${item.title}</a>
            <img src="${item.screenshotUrl}"/>
          </details>
          `
        return (
          <div
            key={index}
            // ref={index === items.length - 1 ? lastItemRef : null}
            className="item"
          >
            {item.title ? <h3>{item.title + ' #' + (index + 1)}</h3> : null}
            <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
          </div>
        )
      }
      )}
      {loading && <div className="loading">Loading...</div>}
    </div>
  )
})
