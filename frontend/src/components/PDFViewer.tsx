'use client';

import '@/lib/pdfWorker';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, BookOpen, FileText, Move, Keyboard } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PDFViewerProps {
  pdfUrl: string;
  onClose: () => void;
  initialPage?: number;
}

interface ExtractedSpan {
  text: string;
  bold: boolean;
  italic: boolean;
  fontSize: number;
  fontName: string;
}

interface ExtractedBlock {
  spans: ExtractedSpan[];
  isHeading: boolean;
}

export default function PDFViewer({ pdfUrl, onClose, initialPage = 1 }: PDFViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [zoom, setZoom] = useState(1);
  const [readerMode, setReaderMode] = useState(false);
  const [extractedText, setExtractedText] = useState<ExtractedBlock[]>([]);
  const [extracting, setExtracting] = useState(false);
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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(initialPage);
  };

  // Single page view — each PDF page is already a spread
  const basePageWidth = Math.min(containerWidth - 80, 900);
  const pageWidth = basePageWidth * zoom;

  const previousPage = useCallback(() => {
    setPageNumber((prev) => Math.max(1, prev - 1));
    setExtractedText([]);
  }, []);

  const nextPage = useCallback(() => {
    setPageNumber((prev) => Math.min(numPages, prev + 1));
    setExtractedText([]);
  }, [numPages]);

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

  // --- Reader Mode: extract text from current page ---
  const extractPageText = useCallback(async () => {
    if (extracting) return;
    setExtracting(true);
    try {
      const loadingTask = pdfjs.getDocument({
        url: pdfUrl,
        cMapUrl: '/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: '/standard_fonts/',
      });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      // Group text items into blocks based on vertical position gaps
      const blocks: ExtractedBlock[] = [];
      let currentBlock: ExtractedSpan[] = [];
      let lastY: number | null = null;
      const LINE_GAP_THRESHOLD = 5; // pixels gap that signals a new block

      for (const item of content.items) {
        if (!('str' in item) || !item.str.trim()) continue;

        const y = (item as any).transform?.[5] ?? 0;
        const fontSize = (item as any).transform?.[0] ?? 12;
        const fontName = (item as any).fontName ?? '';

        // Detect bold from font name
        const isBold =
          /bold|black|heavy|semibold/i.test(fontName) && fontSize < 16;
        const isItalic = /italic|oblique/i.test(fontName);

        // If the Y position jumps significantly, start a new block
        if (lastY !== null && Math.abs(y - lastY) > LINE_GAP_THRESHOLD && currentBlock.length > 0) {
          const blockIsHeading = currentBlock.some((s) => s.fontSize >= 16);
          blocks.push({ spans: [...currentBlock], isHeading: blockIsHeading });
          currentBlock = [];
        }

        currentBlock.push({
          text: item.str,
          bold: isBold,
          italic: isItalic,
          fontSize,
          fontName,
        });
        lastY = y;
      }

      // Push remaining block
      if (currentBlock.length > 0) {
        const blockIsHeading = currentBlock.some((s) => s.fontSize >= 16);
        blocks.push({ spans: [...currentBlock], isHeading: blockIsHeading });
      }

      setExtractedText(blocks);
      pdf.destroy();
    } catch (err) {
      console.error('Text extraction failed:', err);
    } finally {
      setExtracting(false);
    }
  }, [pdfUrl, pageNumber, extracting]);

  // Extract text when reader mode is toggled on, or page changes while in reader mode
  useEffect(() => {
    if (readerMode && extractedText.length === 0 && !extracting) {
      extractPageText();
    }
  }, [readerMode, pageNumber, extractedText.length, extracting, extractPageText]);

  const isZoomed = zoom > 1;

  return (
    <div ref={containerRef} className="w-full bg-gradient-to-b from-stone-100 to-stone-200 rounded-xl shadow-2xl overflow-hidden">
      <div className="relative flex flex-col min-h-[500px]">

        {/* Top bar: BSJ exit icon (left) + mode/zoom controls (right) */}
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
            {/* Reader Mode toggle */}
            <button
              onClick={() => { setReaderMode(!readerMode); setExtractedText([]); }}
              className={`flex items-center gap-1.5 rounded-full shadow-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                readerMode
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-black/60 text-white hover:bg-black/80'
              }`}
              aria-label="Toggle reader mode"
              title={readerMode ? 'Switch to PDF view' : 'Switch to Reader Mode'}
            >
              {readerMode ? <FileText className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
              <span className="hidden sm:inline">{readerMode ? 'PDF View' : 'Reader'}</span>
            </button>

            {/* Zoom controls (only in PDF mode) */}
            {!readerMode && (
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
            )}
          </div>
        </div>
          {/* Reading progress bar */}
          <div className="w-full h-[2px] bg-white/10">
            <div
              className="h-full bg-[#f97316] transition-[width] duration-200"
              style={{ width: numPages > 0 ? `${(pageNumber / numPages) * 100}%` : '0%' }}
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
          {showOverlays && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              <div className="bg-black/60 text-white rounded-full shadow-lg px-4 py-1.5 text-sm font-medium">
                Page {pageNumber} of {numPages}
              </div>
              {showKeyHint && (
                <div className="bg-black/60 text-white/70 rounded-full shadow-lg px-3 py-1.5 text-xs flex items-center gap-1.5 animate-pulse">
                  <Keyboard className="h-3 w-3" />
                  <span>← → to navigate</span>
                </div>
              )}
            </div>
          )}

          {readerMode ? (
            /* ========== READER MODE ========== */
            <div className="w-full max-w-3xl mx-auto px-6 sm:px-10 py-6">
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
                loading={null}
              >
                {/* Hidden — just to keep page count in sync */}
              </Document>

              {extracting ? (
                <div className="flex items-center justify-center h-[400px] text-stone-400">
                  Extracting text…
                </div>
              ) : extractedText.length === 0 ? (
                <div className="flex items-center justify-center h-[400px] text-stone-400">
                  No extractable text on this page.
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12 space-y-4 leading-relaxed">
                  {extractedText.map((block, i) => {
                    if (block.isHeading) {
                      return (
                        <h2 key={i} className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-6 mb-2">
                          {block.spans.map((s, j) => (
                            <span key={j}>{s.text} </span>
                          ))}
                        </h2>
                      );
                    }
                    return (
                      <p key={i} className="text-base sm:text-lg text-stone-800 font-serif">
                        {block.spans.map((s, j) => {
                          // Bold text at body size → render as regular (the enhancement)
                          // Bold text where we're unsure (very short, single word) → keep bold
                          const keepBold = s.bold && s.text.trim().split(/\s+/).length <= 2;
                          const cls = [
                            keepBold ? 'font-bold' : '',
                            s.italic ? 'italic' : '',
                          ].filter(Boolean).join(' ');
                          return (
                            <span key={j} className={cls || undefined}>
                              {s.text}{' '}
                            </span>
                          );
                        })}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ========== PDF MODE with pan ========== */
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
                  width: isZoomed ? `${containerWidth}px` : undefined,
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
                <div
                  className="bg-white inline-block"
                  style={{
                    userSelect: isPanning ? 'none' : 'auto',
                    width: `${pageWidth}px`,
                  }}
                >
                  <Page
                    pageNumber={pageNumber}
                    width={pageWidth}
                    renderTextLayer
                    renderAnnotationLayer
                  />
                </div>
              </div>
            </Document>
          )}
        </div>
      </div>
    </div>
  );
}
