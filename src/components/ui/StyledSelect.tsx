import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

interface StyledSelectProps {
  value: string | undefined;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  icon?: React.ElementType;
}

export const StyledSelect = ({ value, onChange, options, placeholder, icon: Icon }: StyledSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width
        });
      }
    };
    
    updatePosition();

    const handleScroll = () => {
      updatePosition();
    };

    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative">
      <div 
        ref={triggerRef}
        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm cursor-pointer hover:border-slate-300 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="h-4 w-4 text-slate-400 shrink-0" />}
          <span className={value ? "text-slate-900 truncate" : "text-slate-500 truncate"}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: `${coords.width}px`,
            zIndex: 9999,
          }}
          className="rounded-md border border-slate-200 bg-white shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {options.map((opt) => (
              <div
                key={opt}
                className={`relative flex w-full cursor-default select-none items-center rounded-sm py-2 px-3 text-sm outline-none hover:bg-slate-100 cursor-pointer ${value === opt ? "bg-brown-50 text-brown-700 font-medium" : "text-slate-700"}`}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
