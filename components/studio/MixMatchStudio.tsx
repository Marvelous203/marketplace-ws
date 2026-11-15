'use client';

import React from 'react';
import { useOutfitLayers } from '@/lib/hooks/useOutfitLayers';
import { LayeredModelViewer } from './LayeredModelViewer';
import { MixMatchPanel } from './MixMatchPanel';

export function MixMatchStudio() {
  const {
    catalog,
    outfit,
    selectProduct,
    clearOutfit,
    addProductToCatalog,
  } = useOutfitLayers();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Layered Model Canvas */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <LayeredModelViewer outfit={outfit} />
        </div>

        {/* Right: Mix & Match Control Panel */}
        <div className="lg:col-span-7 h-full">
          <MixMatchPanel
            outfit={outfit}
            catalog={catalog}
            onSelectProduct={selectProduct}
            onClearOutfit={clearOutfit}
            onAddProductToCatalog={addProductToCatalog}
          />
        </div>
      </div>
    </div>
  );
}
