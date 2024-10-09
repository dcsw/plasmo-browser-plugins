import React, { useRef, useEffect, useState, forwardRef } from 'react';
import './CoverArtScroll.css';

const CoverArtScroll = forwardRef(({ initialHtmlContents }, ref) => {
  const [items, setItems] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      if (scrollContainerRef.current) {
        e.preventDefault();
        scrollContainerRef.current.scrollLeft += e.deltaY;
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  React.useImperativeHandle(ref, () => ({
    addItem: (newHtml) => {
      setItems(prevItems => [...prevItems, newHtml]);
    },
    removeItem: (index) => {
      setItems(prevItems => prevItems.filter((_, i) => i !== index));
    }
  }));

  return (
    <div className="scroll-container" ref={scrollContainerRef}>
      {items.map((html, index) => (
        <div key={index} className="cover-art-item">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      ))}
    </div>
  );
});

export default CoverArtScroll;





// import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
// import styled from 'styled-components';

// export const CoverArtFlow = forwardRef(({ images, interval = 5000 }, ref) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
//     }, interval);

//     return () => clearInterval(timer);
//   }, [items.length, interval]);
  
//   // Expose functions to parent
//   useImperativeHandle(ref, () => ({
//     addNewTextBlob: (itemTitle, newHtml) => {
//       setItems((prevItems) => [...prevItems, { title: itemTitle, html: newHtml }]);
//     },
//     items: items
//   }));

//   return (
//     <Container>
//       {items.map((item, index) => (
//         <Image
//           key={index}
//           src={""}
//         //   style={{
//         //     opacity: index === currentIndex ? 1 : 0,
//         //     transform: `scale(${index === currentIndex ? 1.1 : 1})`,
//         //   }}
//         />
//       ))}
//     </Container>
//   );
// });

// const Container = styled.div
// // `
// //   position: relative;
// //   width: 100%;
// //   height: 100%;
// //   overflow: hidden;
// // `
// ;

// // const Image = styled.img`
// //   position: absolute;
// //   top: 0;
// //   left: 0;
// //   width: 100%;
// //   height: 100%;
// //   object-fit: cover;
// //   transition: opacity 1s ease-in-out, transform 1s ease-in-out;
// // `;

// export default CoverArtFlow;
