'use client';

import '@/lib/pdfWorker';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Move, Keyboard } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PDFViewerProps {
  pdfUrl: string;
  onClose: () => void;
  initialPage?: number;
}

export default function PDFViewer({ pdfUrl, onClose, initialPage = 1 }: PDFViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [zoom, setZoom] = useState(1);
  const [showKeyHint, setShowKeyHint] = useState(true);

  // Pan state for drag-to-pan when zoomed
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  // Toggle overlay controls (arrows, center exit, page counter)
  const [showOverlays, setShowOverlays] = useState(true);

  // Measure container width and update on resize
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

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

  const normalizeSpreadPage = useCallback((value: number, totalPages: number): number => {
    const total = Math.max(totalPages, 1);
    const clamped = Math.min(Math.max(1, value), total);

    if (clamped === 1 || clamped === total) {
      return clamped;
    }

    return clamped % 2 === 0 ? clamped : clamped - 1;
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(normalizeSpreadPage(initialPage, numPages));
  };

  const spreadGap = 4;
  const basePageWidth = Math.max(Math.min((containerWidth - 140 - spreadGap) / 2, 520), 140);
  const pageWidth = basePageWidth * zoom;

  // Book spread layout (first and last pages are single pages)
  const isSinglePage = numPages <= 1 || pageNumber === 1 || pageNumber === numPages;
  const isLeftPage = pageNumber % 2 === 0;
  const leftPageNum = isSinglePage ? pageNumber : isLeftPage ? pageNumber : pageNumber - 1;
  const rightPageNum = isSinglePage ? null : Math.min(leftPageNum + 1, numPages);
  const progressPage = rightPageNum ?? leftPageNum;

  const changePage = useCallback((offset: number) => {
    setPageNumber((prev) => {
      if (numPages < 1) return prev;
      const next = prev + offset;
      if (next < 1) return 1;
      if (next > numPages) return numPages;
      return next;
    });
  }, [numPages]);

  const previousPage = useCallback(() => {
    if (pageNumber <= 1) return;

    if (pageNumber === numPages && numPages > 1) {
      changePage(-1);
      return;
    }

    changePage(-2);
  }, [changePage, numPages, pageNumber]);

  const nextPage = useCallback(() => {
    if (pageNumber >= numPages) return;

    if (pageNumber === 1) {
      changePage(1);
      return;
    }

    if (pageNumber === numPages - 1 && numPages > 1) {
      changePage(1);
      return;
    }

    changePage(2);
  }, [changePage, numPages, pageNumber]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { previousPage(); setShowKeyHint(false); }
      if (e.key === 'ArrowRight') { nextPage(); setShowKeyHint(false); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [previousPage, nextPage]);

  // Auto-hide keyboard hint after 5 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowKeyHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // --- Drag-to-pan handlers ---
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el || zoom <= 1) return;
    // Only pan with left mouse button
    if (e.button !== 0) return;
    setIsPanning(true);
    panStart.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
    };
    e.preventDefault();
  }, [zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    el.scrollLeft = panStart.current.scrollLeft - dx;
    el.scrollTop = panStart.current.scrollTop - dy;
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Also handle mouse leaving the container
  const handleMouseLeave = useCallback(() => {
    setIsPanning(false);
  }, []);

  // --- Touch pan handlers ---
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el || zoom <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    panStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
    };
  }, [zoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el || zoom <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - panStart.current.x;
    const dy = touch.clientY - panStart.current.y;
    el.scrollLeft = panStart.current.scrollLeft - dx;
    el.scrollTop = panStart.current.scrollTop - dy;
  }, [zoom]);

  const isZoomed = zoom > 1;

  return (
    <div ref={containerRef} className="w-full bg-gradient-to-b from-stone-100 to-stone-200 rounded-xl shadow-2xl overflow-hidden">
      <div className="relative flex flex-col min-h-[500px]">

        {/* Top bar: BSJ exit icon (left) + zoom controls (right) */}
        <div className="sticky top-0 z-40 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/40 to-transparent pointer-events-none">
          {/* Exit button with BSJ logo */}
          <button
            onClick={onClose}
            className="pointer-events-auto flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white
                       rounded-full pl-1.5 pr-4 py-1.5 shadow-lg transition-colors"
            aria-label="Close reader"
          >
            <img
              src="/images/logo.png"
              alt="BSJ"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm font-semibold">Exit</span>
          </button>

          {/* Controls */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Zoom controls */}
            <div className="flex items-center gap-1 bg-black/60 rounded-full shadow-lg px-2 py-1.5">
              <button
                onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.15).toFixed(2)))}
                className="h-8 w-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-white text-xs font-medium min-w-[42px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.15).toFixed(2)))}
                className="h-8 w-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="text-white/70 hover:text-white text-[10px] font-medium px-2 transition-colors"
              >
                Reset
              </button>
              {isZoomed && (
                <div className="flex items-center gap-1 border-l border-white/20 ml-1 pl-2">
                  <Move className="h-3 w-3 text-white/60" />
                  <span className="text-white/60 text-[10px]">Drag to pan</span>
                </div>
              )}
            </div>
          </div>
        </div>
          {/* Reading progress bar */}
          <div className="w-full h-[2px] bg-white/10">
            <div
              className="h-full bg-[#f97316] transition-[width] duration-200"
              style={{ width: numPages > 0 ? `${(progressPage / numPages) * 100}%` : '0%' }}
            />
          </div>
        </div>

        {/* Content area */}
        <div
          className="relative flex-1 pb-8"
          onClick={(e) => {
            // Toggle overlays only if the click is on the content area itself, not a button
            if ((e.target as HTMLElement).closest('button, a')) return;
            setShowOverlays((v) => !v);
          }}
        >
          {/* Left nav arrow */}
          {showOverlays && pageNumber > 1 && (
            <button
              onClick={previousPage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30
                         bg-black/50 hover:bg-black/70 text-white
                         h-14 w-14 rounded-full flex items-center justify-center
                         shadow-lg transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* Right nav arrow */}
          {showOverlays && pageNumber < numPages && (
            <button
              onClick={nextPage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30
                         bg-black/50 hover:bg-black/70 text-white
                         h-14 w-14 rounded-full flex items-center justify-center
                         shadow-lg transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          {/* Center exit button */}
          {showOverlays && (
            <button
              onClick={onClose}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30
                         bg-black/50 hover:bg-black/70 text-white
                         rounded-full px-5 py-2.5 shadow-lg transition-all
                         opacity-40 hover:opacity-100 flex items-center gap-2"
              aria-label="Close reader"
            >
              <img src="/images/logo.png" alt="" className="h-6 w-6 rounded-full object-cover" />
              <span className="text-sm font-semibold">Exit</span>
            </button>
          )}

          {/* Page counter + keyboard hint */}
          {showOverlays && numPages > 0 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              <div className="bg-black/60 text-white rounded-full shadow-lg px-4 py-1.5 text-sm font-medium">
                {isSinglePage || !rightPageNum
                  ? `Page ${leftPageNum} of ${numPages}`
                  : `Pages ${leftPageNum}-${rightPageNum} of ${numPages}`}
              </div>
              {showKeyHint && (
                <div className="bg-black/60 text-white/70 rounded-full shadow-lg px-3 py-1.5 text-xs flex items-center gap-1.5 animate-pulse">
                  <Keyboard className="h-3 w-3" />
                  <span>← → to navigate</span>
                </div>
              )}
            </div>
          )}

          {/* ========== PDF MODE with book spread layout ========== */}
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
            loading={
              <div className="flex items-center justify-center h-[500px] text-stone-400">
                Loading PDF…
              </div>
            }
          >
            <div
              ref={scrollRef}
              className={`mx-auto shadow-2xl ${
                isZoomed
                  ? 'overflow-scroll cursor-grab active:cursor-grabbing'
                  : 'overflow-hidden'
              }`}
              style={{
                width: `${containerWidth}px`,
                maxHeight: isZoomed ? '80vh' : undefined,
                display: isZoomed ? 'block' : 'flex',
                justifyContent: isZoomed ? undefined : 'center',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              {numPages > 0 && (
                <div
                  className="bg-white flex items-start justify-center mx-auto"
                  style={{
                    userSelect: isPanning ? 'none' : 'auto',
                    width: `${isSinglePage ? pageWidth : pageWidth * 2 + spreadGap}px`,
                    gap: `${spreadGap}px`,
                    padding: '8px',
                  }}
                >
                  <div className="shadow-lg bg-white">
                    <Page
                      pageNumber={leftPageNum}
                      width={pageWidth}
                      renderTextLayer
                      renderAnnotationLayer
                    />
                  </div>

                  {!isSinglePage && rightPageNum && rightPageNum <= numPages && (
                    <div className="shadow-lg bg-white">
                      <Page
                        pageNumber={rightPageNum}
                        width={pageWidth}
                        renderTextLayer
                        renderAnnotationLayer
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Document>
        </div>
      </div>
    </div>
  );
}