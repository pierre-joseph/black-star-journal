'use client';

import '@/lib/pdfWorker';
import { useEffect, useMemo, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PDFViewerProps {
  pdfUrl: string;
  onClose: () => void;
  initialPage?: number;
}

export default function PDFViewer({ pdfUrl, initialPage = 1 }: PDFViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onErr = (e: any) => console.warn('pdfjs warning/error:', e);
    window.addEventListener('error', onErr);
    return () => window.removeEventListener('error', onErr);
  }, []);

  const file = useMemo(() => ({ url: pdfUrl }), [pdfUrl]);

  const options = useMemo(() => {
    const wasmUrl =
      typeof window !== 'undefined'
        ? new URL('/pdfjs/', window.location.origin).href
        : '/pdfjs/';

    return {
      cMapUrl: '/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: '/standard_fonts/',
      isEvalSupported: false,
      wasmUrl,
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset: number) => {
    setPageNumber((prev) => {
      const next = prev + offset;
      if (next < 1) return 1;
      if (next > numPages) return numPages;
      return next;
    });
  };

  const previousPage = () => {
    if (pageNumber === 1) changePage(1);
    else if (pageNumber === numPages && numPages > 1) changePage(-1);
    else changePage(-2);
  };

  const nextPage = () => {
    if (pageNumber === 1) changePage(1);
    else if (pageNumber === numPages - 1 && numPages > 1) changePage(1);
    else changePage(2);
  };

  const isSinglePage = pageNumber === 1 || pageNumber === numPages;
  const isLeftPage = pageNumber % 2 === 0;
  const leftPageNum = isSinglePage
    ? pageNumber
    : isLeftPage
    ? pageNumber
    : pageNumber - 1;
  const rightPageNum = isSinglePage ? null : leftPageNum + 1;

  // Calculate all pages to render (current + adjacent spreads for instant navigation)
  const pagesToRender = useMemo(() => {
    const pages = new Set<number>();
    
    // Current spread
    pages.add(leftPageNum);
    if (rightPageNum && rightPageNum <= numPages) pages.add(rightPageNum);
    
    // Previous spread
    if (pageNumber > 1) {
      if (pageNumber === 2) {
        pages.add(1);
      } else if (pageNumber === numPages && numPages > 1) {
        const prevLeft = numPages - 2;
        if (prevLeft >= 1) {
          pages.add(prevLeft);
          if (prevLeft + 1 <= numPages) pages.add(prevLeft + 1);
        }
      } else {
        const prevLeft = Math.max(1, leftPageNum - 2);
        pages.add(prevLeft);
        if (prevLeft + 1 <= numPages && prevLeft !== 1) pages.add(prevLeft + 1);
      }
    }
    
    // Next spread
    if (pageNumber < numPages) {
      if (pageNumber === 1) {
        if (numPages >= 2) pages.add(2);
        if (numPages >= 3) pages.add(3);
      } else if (pageNumber === numPages - 1 && numPages > 1) {
        pages.add(numPages);
      } else {
        const nextLeft = isSinglePage ? pageNumber + 1 : leftPageNum + 2;
        if (nextLeft <= numPages) pages.add(nextLeft);
        if (nextLeft + 1 <= numPages) pages.add(nextLeft + 1);
      }
    }
    
    return Array.from(pages).sort((a, b) => a - b);
  }, [pageNumber, numPages, leftPageNum, rightPageNum, isSinglePage]);

  return (
    <div className="w-full bg-gradient-to-b from-amber-50/50 to-stone-100 rounded-xl shadow-2xl overflow-hidden">
      <div className="relative flex items-center justify-center p-8 min-h-[600px] bg-gradient-to-b from-stone-50 to-amber-50/30">
        {/* Zoom */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-white/90 rounded-full shadow-lg px-3 py-2">
          <Button
            onClick={() => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(2)))}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            −
          </Button>
          <span className="text-sm min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            onClick={() => setScale((s) => Math.min(1.5, +(s + 0.1).toFixed(2)))}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            +
          </Button>
        </div>

        {/* Page counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-white/90 rounded-full shadow-lg px-4 py-2 text-sm">
          {isSinglePage
            ? `Page ${pageNumber} of ${numPages}`
            : `Pages ${leftPageNum}-${rightPageNum} of ${numPages}`}
        </div>

        {/* VIEWPORT */}
        <div className="relative flex justify-center items-center gap-6">
          {/* Left nav */}
          {pageNumber > 1 && (
            <Button
              onClick={previousPage}
              variant="ghost"
              size="icon"
              className="z-30 bg-white/90 hover:bg-white shadow-lg
                         h-12 w-12 rounded-full flex-shrink-0"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            <div className="relative flex gap-2 shadow-2xl">
              {!isSinglePage && (
                <div className="absolute left-1/2 top-0 bottom-0 w-2 -ml-1
                                bg-white
                                z-10 pointer-events-none shadow-sm" />
              )}

              {/* Render all needed pages, show/hide based on current spread */}
              {pagesToRender.map((num) => {
                const isCurrentLeft = num === leftPageNum;
                const isCurrentRight = num === rightPageNum;
                const isVisible = isCurrentLeft || isCurrentRight;
                
                if (!isVisible) {
                  // Preload hidden pages
                  return (
                    <div key={num} className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
                      <Page
                        pageNumber={num}
                        scale={scale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </div>
                  );
                }
                
                return (
                  <div key={num} className="bg-amber-50 shadow-2xl">
                    <Page
                      pageNumber={num}
                      scale={scale}
                      renderTextLayer
                      renderAnnotationLayer
                    />
                  </div>
                );
              })}
            </div>
          </Document>

          {/* Right nav */}
          {pageNumber < numPages && (
            <Button
              onClick={nextPage}
              variant="ghost"
              size="icon"
              className="z-30 bg-white/90 hover:bg-white shadow-lg
                         h-12 w-12 rounded-full flex-shrink-0"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
